import json
from sqlalchemy.orm import Session
from ..models import Patient, SessionState, Pharmacy

def seed_default_data(db: Session):
    """Seed realistic clinical personas and pharmacies if database is empty."""
    if db.query(Patient).count() > 0:
        return

    # Seed Pharmacies
    p1 = Pharmacy(
        id="PHARM-01",
        name="CVS Health #4192",
        chain="CVS Health",
        address="742 Evergreen Terrace, West Springfield",
        latitude=37.7749,
        longitude=-122.4194,
        distance_miles=0.8,
        phone="(555) 234-5678",
        hours="Open 24 Hours",
        stock_status="IN_STOCK",
        has_drive_thru=True
    )
    p2 = Pharmacy(
        id="PHARM-02",
        name="Walgreens Pharmacy #1084",
        chain="Walgreens",
        address="1204 Oakmont Blvd, Suite 100",
        latitude=37.7833,
        longitude=-122.4167,
        distance_miles=1.4,
        phone="(555) 876-5432",
        hours="8:00 AM – 10:00 PM",
        stock_status="IN_STOCK",
        has_drive_thru=True
    )
    p3 = Pharmacy(
        id="PHARM-03",
        name="Rite Aid Pharmacy #5512",
        chain="Rite Aid",
        address="390 Market Street, Downtown",
        latitude=37.7891,
        longitude=-122.4014,
        distance_miles=2.2,
        phone="(555) 998-1122",
        hours="9:00 AM – 9:00 PM",
        stock_status="LIMITED_STOCK",
        has_drive_thru=False
    )
    db.add_all([p1, p2, p3])

    # Seed Patient 1: Elena Rostova (Heart Failure post-discharge)
    patient_1 = Patient(
        id="PATIENT-ELENA",
        first_name="Elena",
        last_name="Rostova",
        phone_number="+14155552671",
        email="elena.rostova@example.com",
        condition="Congestive Heart Failure (NYHA Class II)",
        discharge_date="Oct 23, 2026 (4 days ago)",
        risk_level="HIGH",
        preferred_channel="WHATSAPP",
        current_medications=json.dumps([
            {"name": "Metoprolol Succinate ER", "dosage": "50mg Oral Daily", "rx_number": "RX-99281"},
            {"name": "Furosemide (Lasix)", "dosage": "40mg Oral Twice Daily", "rx_number": "RX-88412"},
            {"name": "Lisinopril", "dosage": "10mg Oral Daily", "rx_number": "RX-77190"}
        ]),
        allergies=json.dumps(["Penicillin", "Sulfa Drugs"]),
        assigned_physician="Dr. Sarah Chen, MD (Cardiology)"
    )

    # Seed Patient 2: Marcus Vance (Post-op Wound Care)
    patient_2 = Patient(
        id="PATIENT-MARCUS",
        first_name="Marcus",
        last_name="Vance",
        phone_number="+14155559812",
        email="marcus.vance@example.com",
        condition="Post-Surgical Cellulitis Follow-Up",
        discharge_date="Oct 25, 2026 (2 days ago)",
        risk_level="MEDIUM",
        preferred_channel="RCS",
        current_medications=json.dumps([
            {"name": "Amoxicillin-Clavulanate (Augmentin)", "dosage": "875/125mg Oral Twice Daily", "rx_number": "RX-44102"}
        ]),
        allergies=json.dumps(["Aspirin"]),
        assigned_physician="Dr. James Wilson, MD (Infectious Disease)"
    )

    db.add_all([patient_1, patient_2])
    db.commit()

    # Pre-create an active session for Elena Rostova
    session_1 = SessionState(
        id="SESSION-ELENA-01",
        patient_id=patient_1.id,
        active_channel="SMS",
        stage="INITIATED",
        triage_score=0.45,
        triage_summary="Proactive post-discharge medication check and symptom surveillance.",
        context_graph=json.dumps({
            "stage": "OUTBOUND_TRIGGERED",
            "condition": patient_1.condition,
            "physician": patient_1.assigned_physician
        })
    )
    db.add(session_1)
    db.commit()
