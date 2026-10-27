import pytest
import io
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_aws_config_endpoints():
    res = client.get("/api/config/aws")
    assert res.status_code == 200
    data = res.json()
    assert "aws_cds_mode" in data
    assert "services" in data
    assert "amazon_bedrock" in data["services"]

    update_res = client.post("/api/config/aws", json={
        "aws_region": "us-east-1",
        "aws_cds_mode": "HYBRID_SIMULATION",
        "bedrock_model_id": "anthropic.claude-3-5-sonnet-20241022-v2:0"
    })
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "CONFIG_UPDATED"

def test_file_upload_endpoint():
    dummy_file = io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00")
    files = {"file": ("patient_ankle.jpg", dummy_file, "image/jpeg")}
    res = client.post("/api/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "url" in data
    assert data["url"].startswith("/uploads/")

    # Verify static fetch
    fetch_res = client.get(data["url"])
    assert fetch_res.status_code == 200
    assert len(fetch_res.content) > 0

def test_ses_test_dispatch():
    res = client.post("/api/email/dispatch-test", json={
        "recipient_email": "patient.test@example.com",
        "patient_name": "Elena Rostova",
        "medication": "Metoprolol Succinate ER 50mg"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "DELIVERED"
    assert "ses-" in data["message_id"]
    assert "html_content" in data

def test_clinical_conversational_intents():
    # Start scenario
    s_res = client.post("/api/sessions/start-scenario", json={"scenario_type": "HEART_FAILURE_TITRATION"})
    session_id = s_res.json()["session_id"]

    # 1. Dosage
    r1 = client.post("/api/messages/inbound", json={
        "session_id": session_id,
        "channel": "WHATSAPP",
        "content": "How should I take my Metoprolol?"
    })
    assert r1.status_code == 200

    # 2. NSAID interaction check
    r2 = client.post("/api/messages/inbound", json={
        "session_id": session_id,
        "channel": "WHATSAPP",
        "content": "Can I take ibuprofen or Advil?"
    })
    assert r2.status_code == 200

    # 3. Emergency chest pain
    r3 = client.post("/api/messages/inbound", json={
        "session_id": session_id,
        "channel": "WHATSAPP",
        "content": "I am having severe chest pain"
    })
    assert r3.status_code == 200

    # 4. Missed dose
    r4 = client.post("/api/messages/inbound", json={
        "session_id": session_id,
        "channel": "RCS",
        "content": "What if I missed a dose of my morning medication?"
    })
    assert r4.status_code == 200

    # Verify messages stored in session
    msgs = client.get(f"/api/messages?session_id={session_id}").json()
    assert len(msgs) >= 9
