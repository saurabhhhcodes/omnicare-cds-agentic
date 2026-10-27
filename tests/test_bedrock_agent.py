import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.database import Base
from backend.app.models import Patient, SessionState, Message, AgentTrace, Pharmacy
from backend.app.services.patient_service import seed_default_data
from backend.app.bedrock_agent.agent_core import bedrock_agent_core

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    seed_default_data(db)
    yield db
    db.close()

def test_bedrock_agent_sms_to_rcs_carousel(test_db):
    session = test_db.query(SessionState).first()
    assert session is not None

    # Step 1: Patient asks to find pharmacies on SMS
    res = bedrock_agent_core.process_incoming_event(
        db=test_db,
        session_id=session.id,
        channel="SMS",
        content="Where can I pickup my prescription nearby?"
    )

    assert res["stage"] == "RCS_CAROUSEL_SENT"
    assert res["active_channel"] == "RCS"
    assert len(res["traces"]) >= 2
    assert any(t["agent"] == "PharmacyRoutingAgent" for t in res["traces"])

def test_bedrock_agent_rcs_to_ses_email(test_db):
    session = test_db.query(SessionState).first()

    # Step 2: Patient taps to select Pharmacy #1 on RCS
    res = bedrock_agent_core.process_incoming_event(
        db=test_db,
        session_id=session.id,
        channel="RCS",
        content="SELECT_PHARMACY_PHARM-01"
    )

    assert res["stage"] == "PRESCRIPTION_DISPATCHED"
    # Check that SES Email was dispatched
    email_msg = test_db.query(Message).filter(Message.channel == "SES_EMAIL").first()
    assert email_msg is not None
    assert "Official Clinical Summary" in email_msg.content

def test_bedrock_agent_whatsapp_multimodal_vision(test_db):
    session = test_db.query(SessionState).first()

    # Step 3: Patient uploads ankle photo on WhatsApp
    res = bedrock_agent_core.process_incoming_event(
        db=test_db,
        session_id=session.id,
        channel="WHATSAPP",
        content="Here is a photo of my ankles, they feel swollen and puffy.",
        media_url="https://images.unsplash.com/photo-1584515933487-779824d29309?w=600"
    )

    assert res["stage"] == "WHATSAPP_CONSULTATION"
    assert res["active_channel"] == "WHATSAPP"
    assert any(t["agent"] == "VisionTriageAgent" for t in res["traces"])
