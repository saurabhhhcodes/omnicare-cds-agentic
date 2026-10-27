import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid() -> str:
    return uuid.uuid4().hex

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    first_name = Column(String(64), nullable=False)
    last_name = Column(String(64), nullable=False)
    phone_number = Column(String(32), nullable=False, unique=True)
    email = Column(String(128), nullable=False, unique=True)
    condition = Column(String(128), nullable=False)
    discharge_date = Column(String(64), nullable=False)
    risk_level = Column(String(32), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    preferred_channel = Column(String(32), default="WHATSAPP") # SMS, RCS, WHATSAPP, EMAIL
    current_medications = Column(Text, default="[]") # JSON list of medications
    allergies = Column(Text, default="[]")
    assigned_physician = Column(String(128), default="Dr. Sarah Chen, MD (Cardiology)")
    created_at = Column(String(64), default=now_iso)

    sessions = relationship("SessionState", back_populates="patient", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="patient", cascade="all, delete-orphan")

class SessionState(Base):
    __tablename__ = "session_states"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    active_channel = Column(String(32), default="SMS") # SMS -> RCS -> WHATSAPP -> SES_EMAIL
    stage = Column(String(64), default="INITIATED") # INITIATED, TRIAGE_ACTIVE, RCS_CAROUSEL_SENT, WHATSAPP_CONSULTATION, PHARMACY_SELECTED, PRESCRIPTION_DISPATCHED, RESOLVED
    triage_score = Column(Float, default=0.0) # 0.0 - 1.0
    triage_summary = Column(Text, default="")
    symptoms_reported = Column(Text, default="[]")
    uploaded_image_url = Column(String(256), nullable=True)
    image_analysis_summary = Column(Text, nullable=True)
    selected_pharmacy_id = Column(String(36), nullable=True)
    selected_pickup_slot = Column(String(64), nullable=True)
    prescription_token = Column(String(64), nullable=True)
    is_escalated_to_human = Column(Boolean, default=False)
    context_graph = Column(Text, default="{}") # JSON representation of multi-agent state memory
    updated_at = Column(String(64), default=now_iso)
    created_at = Column(String(64), default=now_iso)

    patient = relationship("Patient", back_populates="sessions")
    messages = relationship("Message", back_populates="session", cascade="all, delete-orphan")
    traces = relationship("AgentTrace", back_populates="session", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("session_states.id"), nullable=False)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    channel = Column(String(32), nullable=False) # SMS, RCS, WHATSAPP, SES_EMAIL
    direction = Column(String(16), nullable=False) # INBOUND, OUTBOUND
    message_type = Column(String(32), default="TEXT") # TEXT, RICH_CARD, CAROUSEL, IMAGE, LOCATION, ACTION_BUTTONS, TEMPLATE
    content = Column(Text, nullable=False)
    payload_json = Column(Text, default="{}") # Structured cards, suggestions, buttons, or email metadata
    delivery_status = Column(String(32), default="SENT") # SENT, DELIVERED, READ, ACKNOWLEDGED, FAILED
    aws_message_id = Column(String(64), nullable=True)
    created_at = Column(String(64), default=now_iso)

    patient = relationship("Patient", back_populates="messages")
    session = relationship("SessionState", back_populates="messages")

class AgentTrace(Base):
    __tablename__ = "agent_traces"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("session_states.id"), nullable=False)
    agent_name = Column(String(64), nullable=False) # BedrockSupervisor, ClinicalTriageAgent, VisionTriageAgent, PharmacyRoutingAgent, OmnichannelDispatcher
    state_node = Column(String(64), default="EVALUATE")
    thought = Column(Text, nullable=False)
    tool_name = Column(String(64), nullable=True)
    tool_input = Column(Text, default="{}")
    tool_output = Column(Text, default="{}")
    channel_handover = Column(String(64), nullable=True) # e.g. "SMS -> RCS" or "RCS -> WHATSAPP"
    latency_ms = Column(Float, default=0.0)
    timestamp = Column(String(64), default=now_iso)

    session = relationship("SessionState", back_populates="traces")

class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(128), nullable=False)
    chain = Column(String(64), default="CVS Health")
    address = Column(String(256), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    distance_miles = Column(Float, default=0.8)
    phone = Column(String(32), default="(555) 234-5678")
    hours = Column(String(64), default="Open 24 Hours")
    stock_status = Column(String(32), default="IN_STOCK") # IN_STOCK, LIMITED, LOW
    has_drive_thru = Column(Boolean, default=True)

class CdsMetric(Base):
    __tablename__ = "cds_metrics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    channel = Column(String(32), nullable=False) # SMS, RCS, WHATSAPP, SES_EMAIL
    event_type = Column(String(32), nullable=False) # OUTBOUND_SENT, DELIVERED, READ, USER_TAP, CHANNEL_HOP, EMAIL_OPEN
    latency_ms = Column(Float, default=45.0)
    cost_usd = Column(Float, default=0.0075) # AWS CDS unit pricing
    timestamp = Column(String(64), default=now_iso)
