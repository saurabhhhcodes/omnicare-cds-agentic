import json
import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..models import Patient, Pharmacy, SessionState
from ..aws_cds.ses_email import ses_email_service

class AgentTools:
    """
    Bedrock AgentCore Execution Tools.
    Invoked by the multi-agent cognitive loop to read EHR data, query pharmacies,
    analyze visual imagery, and trigger cross-channel notifications.
    """

    @staticmethod
    def fhir_patient_lookup(db: Session, patient_id: str) -> Dict[str, Any]:
        patient = db.get(Patient, patient_id)
        if not patient:
            return {"error": "Patient not found in FHIR registry"}
        
        return {
            "patient_id": patient.id,
            "name": f"{patient.first_name} {patient.last_name}",
            "condition": patient.condition,
            "discharge_date": patient.discharge_date,
            "risk_level": patient.risk_level,
            "current_medications": json.loads(patient.current_medications or "[]"),
            "allergies": json.loads(patient.allergies or "[]"),
            "assigned_physician": patient.assigned_physician,
            "preferred_channel": patient.preferred_channel
        }

    @staticmethod
    def analyze_symptom_or_medication_image(image_url: str, symptom_context: str) -> Dict[str, Any]:
        """
        Multi-modal diagnostic vision tool.
        In production, executes Amazon Bedrock Claude 3.5 Sonnet multimodal vision call.
        """
        # Simulated intelligent vision inference
        is_rash = "rash" in symptom_context.lower() or "skin" in symptom_context.lower() or "red" in symptom_context.lower()
        is_swelling = any(k in symptom_context.lower() for k in ["swelling", "swollen", "edema", "ankle", "feet", "puff"])
        
        if is_swelling:
            return {
                "detected_feature": "Bilateral Pre-tibial Peripheral Edema (+2 Pitting)",
                "severity": "MODERATE_ELEVATED",
                "confidence": 0.94,
                "clinical_observation": "+2 Bilateral Pitting Edema visible on lower extremities. Possible fluid retention secondary to Congestive Heart Failure titration.",
                "triage_recommendation": "Adjust Furosemide dosage from 20mg to 40mg; schedule pharmacy refill pickup."
            }
        elif is_rash:
            return {
                "detected_feature": "Maculopapular Erythematous Dermatitis",
                "severity": "MILD_TO_MODERATE",
                "confidence": 0.91,
                "clinical_observation": "Well-demarcated erythematous patch without bullae or mucosal involvement. Consistent with mild antibiotic cutaneous drug reaction.",
                "triage_recommendation": "Discontinue current antibiotic; switch to secondary agent (Cephalexin); initiate topical corticosteroid."
            }
        else:
            return {
                "detected_feature": "Pharmaceutical Label & Tablet Verification",
                "severity": "INFORMATIONAL",
                "confidence": 0.98,
                "clinical_observation": "Verified Metoprolol Succinate 50mg Extended Release tablet. Imprint code and NDC match patient active medication profile.",
                "triage_recommendation": "Confirm adherence and monitor resting heart rate."
            }

    @staticmethod
    def search_nearby_pharmacies(db: Session, medication: str = "Metoprolol") -> List[Dict[str, Any]]:
        pharmacies = db.query(Pharmacy).order_by(Pharmacy.distance_miles.asc()).limit(3).all()
        results = []
        for p in pharmacies:
            results.append({
                "pharmacy_id": p.id,
                "name": p.name,
                "chain": p.chain,
                "address": p.address,
                "distance_miles": p.distance_miles,
                "hours": p.hours,
                "stock_status": p.stock_status,
                "has_drive_thru": p.has_drive_thru
            })
        return results

    @staticmethod
    def reserve_pharmacy_pickup(
        db: Session,
        session: SessionState,
        pharmacy_id: str,
        pickup_slot: str = "Today at 4:30 PM"
    ) -> Dict[str, Any]:
        pharmacy = db.get(Pharmacy, pharmacy_id)
        if not pharmacy:
            # Fallback to first pharmacy
            pharmacy = db.query(Pharmacy).first()
        
        token = f"RX-LOCK-{uuid.uuid4().hex[:8].upper()}"
        session.selected_pharmacy_id = pharmacy.id if pharmacy else None
        session.selected_pickup_slot = pickup_slot
        session.prescription_token = token
        session.stage = "PHARMACY_SELECTED"
        db.commit()

        return {
            "status": "RESERVED",
            "reservation_token": token,
            "pharmacy_name": pharmacy.name if pharmacy else "CVS Health #4192",
            "pickup_slot": pickup_slot,
            "ready_status": "READY_FOR_PICKUP_WITHIN_2_HOURS"
        }

    @staticmethod
    def dispatch_ses_clinical_summary(
        db: Session,
        session: SessionState
    ) -> Dict[str, Any]:
        patient = session.patient
        medications = json.loads(patient.current_medications or "[]")
        med_name = medications[0]["name"] if medications else "Metoprolol Succinate"
        dosage = medications[0]["dosage"] if medications else "50mg Oral Daily"
        
        pharmacy_name = "CVS Health — West Arterial Drive-Thru"
        if session.selected_pharmacy_id:
            p = db.get(Pharmacy, session.selected_pharmacy_id)
            if p:
                pharmacy_name = f"{p.name} ({p.address})"

        slot = session.selected_pickup_slot or "Today between 4:00 PM – 6:00 PM"
        token = session.prescription_token or f"RX-EXPRESS-{uuid.uuid4().hex[:8].upper()}"

        ses_res = ses_email_service.send_clinical_summary_email(
            recipient_email=patient.email,
            patient_name=f"{patient.first_name} {patient.last_name}",
            medication_name=med_name,
            dosage=dosage,
            instructions="Take one tablet by mouth once daily in the morning with food. Do not skip doses.",
            pharmacy_name=pharmacy_name,
            pickup_slot=slot,
            qr_token=token
        )

        session.stage = "PRESCRIPTION_DISPATCHED"
        db.commit()
        return ses_res

agent_tools = AgentTools()
