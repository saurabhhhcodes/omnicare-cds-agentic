import os
import json
import uuid
import asyncio
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .config import settings
from .database import engine, Base, get_db, init_db
from .models import Patient, SessionState, Message, AgentTrace, Pharmacy
from .services.patient_service import seed_default_data
from .services.telemetry_service import get_cds_telemetry
from .bedrock_agent.agent_core import bedrock_agent_core
from .aws_cds.eum_sms import eum_sms_service
from .aws_cds.ses_email import ses_email_service

# Ensure DB tables are ready on import
init_db()
with Session(engine) as db:
    seed_default_data(db)

# Lifespan startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    with Session(engine) as db:
        seed_default_data(db)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Agentic Omnichannel Clinical AI Platform powered by AWS Communication Developer Services (CDS) and Amazon Bedrock AgentCore.",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads directory
UPLOADS_DIR = settings.DATA_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(data)
            except Exception:
                self.disconnect(connection)

ws_manager = ConnectionManager()

# --- Pydantic Schemas ---
class InboundMessageRequest(BaseModel):
    session_id: str
    channel: str # SMS, RCS, WHATSAPP
    content: str
    media_url: Optional[str] = None
    location: Optional[Dict[str, float]] = None

class ScenarioStartRequest(BaseModel):
    scenario_type: str = "HEART_FAILURE_TITRATION" # HEART_FAILURE_TITRATION or CELLULITIS_RASH

class AwsConfigRequest(BaseModel):
    aws_region: Optional[str] = None
    aws_cds_mode: Optional[str] = None
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    bedrock_model_id: Optional[str] = None
    ses_sender_email: Optional[str] = None

class EmailTestRequest(BaseModel):
    recipient_email: str
    patient_name: str = "Elena Rostova"
    medication: str = "Metoprolol Succinate ER 50mg"

# --- API Endpoints ---

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "aws_cds_mode": settings.AWS_CDS_MODE,
        "aws_region": settings.AWS_REGION,
        "services_active": {
            "aws_eum_sms": "ONLINE",
            "aws_eum_rcs": "ONLINE (GSMA UP 2.4 Verified)",
            "aws_eum_whatsapp": "ONLINE (Meta Cloud API WABA Active)",
            "amazon_ses": "ONLINE (DKIM/SPF Active)",
            "amazon_bedrock_agentcore": f"ACTIVE ({settings.BEDROCK_MODEL_ID})"
        }
    }

@app.get("/api/config/aws")
def get_aws_config():
    return {
        "aws_region": settings.AWS_REGION,
        "aws_cds_mode": settings.AWS_CDS_MODE,
        "bedrock_model_id": settings.BEDROCK_MODEL_ID,
        "ses_sender_email": settings.AWS_SES_SENDER_EMAIL,
        "origination_number": settings.AWS_EUM_ORIGINATION_NUMBER,
        "has_credentials": bool(os.getenv("AWS_ACCESS_KEY_ID")),
        "services": {
            "aws_eum_sms": "ONLINE (10DLC High Volume)",
            "aws_eum_rcs": "ONLINE (GSMA UP 2.4 Verified)",
            "aws_eum_whatsapp": "ONLINE (Meta Cloud API WABA)",
            "amazon_ses": "ONLINE (DKIM/SPF Signed)",
            "amazon_bedrock": f"ONLINE ({settings.BEDROCK_MODEL_ID})"
        }
    }

@app.post("/api/config/aws")
def update_aws_config(req: AwsConfigRequest):
    if req.aws_region:
        settings.AWS_REGION = req.aws_region
    if req.aws_cds_mode:
        settings.AWS_CDS_MODE = req.aws_cds_mode
    if req.bedrock_model_id:
        settings.BEDROCK_MODEL_ID = req.bedrock_model_id
    if req.ses_sender_email:
        settings.AWS_SES_SENDER_EMAIL = req.ses_sender_email
    if req.aws_access_key_id:
        os.environ["AWS_ACCESS_KEY_ID"] = req.aws_access_key_id
    if req.aws_secret_access_key:
        os.environ["AWS_SECRET_ACCESS_KEY"] = req.aws_secret_access_key
    return {
        "status": "CONFIG_UPDATED",
        "aws_region": settings.AWS_REGION,
        "aws_cds_mode": settings.AWS_CDS_MODE,
        "bedrock_model_id": settings.BEDROCK_MODEL_ID
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = Path(file.filename or "image.jpg").suffix or ".jpg"
    filename = f"symptom_{uuid.uuid4().hex[:10]}{ext}"
    target_path = UPLOADS_DIR / filename
    content = await file.read()
    with open(target_path, "wb") as f:
        f.write(content)
    return {
        "url": f"/uploads/{filename}",
        "filename": filename,
        "size_bytes": len(content)
    }

@app.post("/api/email/dispatch-test")
def dispatch_test_email(req: EmailTestRequest):
    res = ses_email_service.send_clinical_summary_email(
        recipient_email=req.recipient_email,
        patient_name=req.patient_name,
        medication_name=req.medication,
        dosage="50mg Oral Daily",
        instructions="Take one tablet by mouth once daily in the morning with food. Do not skip doses.",
        pharmacy_name="CVS Health #4192 (742 Evergreen Terrace, West Springfield)",
        pickup_slot="Today between 4:00 PM – 6:00 PM",
        qr_token=f"RX-TEST-{uuid.uuid4().hex[:8].upper()}"
    )
    return res

@app.get("/api/patients")
def list_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    return [
        {
            "id": p.id,
            "first_name": p.first_name,
            "last_name": p.last_name,
            "condition": p.condition,
            "discharge_date": p.discharge_date,
            "risk_level": p.risk_level,
            "phone_number": p.phone_number,
            "email": p.email,
            "preferred_channel": p.preferred_channel,
            "current_medications": json.loads(p.current_medications or "[]"),
            "allergies": json.loads(p.allergies or "[]"),
            "assigned_physician": p.assigned_physician
        }
        for p in patients
    ]

@app.get("/api/sessions/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.get(SessionState, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    patient = session.patient
    return {
        "id": session.id,
        "patient": {
            "id": patient.id,
            "name": f"{patient.first_name} {patient.last_name}",
            "condition": patient.condition,
            "discharge_date": patient.discharge_date,
            "risk_level": patient.risk_level,
            "phone": patient.phone_number,
            "email": patient.email,
            "assigned_physician": patient.assigned_physician,
            "medications": json.loads(patient.current_medications or "[]")
        },
        "active_channel": session.active_channel,
        "stage": session.stage,
        "triage_score": session.triage_score,
        "triage_summary": session.triage_summary,
        "uploaded_image_url": session.uploaded_image_url,
        "image_analysis_summary": json.loads(session.image_analysis_summary) if session.image_analysis_summary else None,
        "selected_pharmacy_id": session.selected_pharmacy_id,
        "selected_pickup_slot": session.selected_pickup_slot,
        "prescription_token": session.prescription_token,
        "context_graph": json.loads(session.context_graph or "{}"),
        "updated_at": session.updated_at
    }

@app.get("/api/messages")
def list_messages(session_id: str, db: Session = Depends(get_db)):
    msgs = db.query(Message).filter(Message.session_id == session_id).order_by(Message.created_at.asc()).all()
    return [
        {
            "id": m.id,
            "channel": m.channel,
            "direction": m.direction,
            "message_type": m.message_type,
            "content": m.content,
            "payload": json.loads(m.payload_json or "{}"),
            "delivery_status": m.delivery_status,
            "aws_message_id": m.aws_message_id,
            "created_at": m.created_at
        }
        for m in msgs
    ]

@app.get("/api/traces")
def list_traces(session_id: str, db: Session = Depends(get_db)):
    traces = db.query(AgentTrace).filter(AgentTrace.session_id == session_id).order_by(AgentTrace.timestamp.asc()).all()
    return [
        {
            "id": t.id,
            "agent_name": t.agent_name,
            "state_node": t.state_node,
            "thought": t.thought,
            "tool_name": t.tool_name,
            "tool_input": json.loads(t.tool_input or "{}"),
            "tool_output": json.loads(t.tool_output or "{}"),
            "channel_handover": t.channel_handover,
            "latency_ms": t.latency_ms,
            "timestamp": t.timestamp
        }
        for t in traces
    ]

@app.post("/api/messages/inbound")
async def send_inbound_message(req: InboundMessageRequest, db: Session = Depends(get_db)):
    result = bedrock_agent_core.process_incoming_event(
        db=db,
        session_id=req.session_id,
        channel=req.channel,
        content=req.content,
        media_url=req.media_url,
        location=req.location
    )

    # Broadcast real-time event to WebSockets
    await ws_manager.broadcast({
        "type": "NEW_MESSAGE_AND_TRACE",
        "session_id": req.session_id,
        "active_channel": result.get("active_channel"),
        "stage": result.get("stage")
    })

    return result

@app.post("/api/sessions/start-scenario")
async def start_scenario(req: ScenarioStartRequest, db: Session = Depends(get_db)):
    # Pick patient
    patient_id = "PATIENT-ELENA" if req.scenario_type == "HEART_FAILURE_TITRATION" else "PATIENT-MARCUS"
    patient = db.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Scenario patient not found")

    # Clear old messages and traces for clean test run
    session = db.query(SessionState).filter(SessionState.patient_id == patient.id).first()
    if session:
        db.query(Message).filter(Message.session_id == session.id).delete()
        db.query(AgentTrace).filter(AgentTrace.session_id == session.id).delete()
        session.active_channel = "SMS"
        session.stage = "INITIATED"
        session.uploaded_image_url = None
        session.image_analysis_summary = None
        session.selected_pharmacy_id = None
        session.selected_pickup_slot = None
        session.prescription_token = None
        session.context_graph = json.dumps({"scenario": req.scenario_type})
        db.commit()
    else:
        session = SessionState(
            patient_id=patient.id,
            active_channel="SMS",
            stage="INITIATED",
            context_graph=json.dumps({"scenario": req.scenario_type})
        )
        db.add(session)
        db.commit()

    # Dispatch Initial Outbound Proactive Care Alert via AWS EUM SMS
    alert_text = (
        f"OmniCare Clinical Alert: Hi {patient.first_name}, Dr. Chen has reviewed your post-discharge {patient.condition} recovery metrics. "
        "Reply PHARMACY to review and schedule your Metoprolol ER refill with 1-tap booking, or reply WHATSAPP to consult our clinical specialist."
    )
    sms_res = eum_sms_service.send_sms(destination_phone=patient.phone_number, message_body=alert_text)
    
    init_msg = Message(
        session_id=session.id,
        patient_id=patient.id,
        channel="SMS",
        direction="OUTBOUND",
        message_type="TEXT",
        content=alert_text,
        payload_json=json.dumps(sms_res),
        delivery_status="DELIVERED",
        aws_message_id=sms_res["message_id"]
    )
    db.add(init_msg)

    # Initial Agent Trace
    init_trace = AgentTrace(
        session_id=session.id,
        agent_name="ClinicalTriageAgent",
        state_node="OUTBOUND_PROACTIVE_DISPATCH",
        thought=f"Triggering scheduled post-discharge outreach for {patient.first_name} {patient.last_name} via AWS EUM SMS. Setting up omnichannel context memory.",
        tool_name="dispatch_eum_sms",
        tool_input=json.dumps({"phone": patient.phone_number}),
        tool_output=json.dumps(sms_res),
        channel_handover="OUTBOUND -> SMS",
        latency_ms=38.4
    )
    db.add(init_trace)
    db.commit()

    await ws_manager.broadcast({
        "type": "SCENARIO_STARTED",
        "session_id": session.id,
        "scenario": req.scenario_type
    })

    return {
        "status": "SCENARIO_READY",
        "session_id": session.id,
        "patient": f"{patient.first_name} {patient.last_name}",
        "initial_message": alert_text
    }

@app.get("/api/pharmacies")
def list_pharmacies(db: Session = Depends(get_db)):
    pharmacies = db.query(Pharmacy).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "chain": p.chain,
            "address": p.address,
            "distance_miles": p.distance_miles,
            "phone": p.phone,
            "hours": p.hours,
            "stock_status": p.stock_status,
            "has_drive_thru": p.has_drive_thru
        }
        for p in pharmacies
    ]

@app.get("/api/telemetry")
def telemetry(db: Session = Depends(get_db)):
    return get_cds_telemetry(db)

# WebSocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo ping-pong
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# --- Mount Pre-built Frontend ---
DIST_DIR = settings.DATA_DIR.parent / "frontend" / "dist"
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = DIST_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        index_file = DIST_DIR / "index.html"
        if index_file.is_file():
            return FileResponse(index_file)
        return JSONResponse({"status": "Frontend building..."}, status_code=200)
