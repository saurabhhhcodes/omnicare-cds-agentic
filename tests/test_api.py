from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert "aws_eum_sms" in data["services_active"]
    assert "aws_eum_whatsapp" in data["services_active"]
    assert "amazon_ses" in data["services_active"]

def test_list_patients():
    res = client.get("/api/patients")
    assert res.status_code == 200
    patients = res.json()
    assert len(patients) >= 2
    assert any(p["first_name"] == "Elena" for p in patients)

def test_start_scenario_and_flow():
    # Start scenario
    start_res = client.post("/api/sessions/start-scenario", json={"scenario_type": "HEART_FAILURE_TITRATION"})
    assert start_res.status_code == 200
    session_id = start_res.json()["session_id"]

    # Inbound message
    inbound_res = client.post("/api/messages/inbound", json={
        "session_id": session_id,
        "channel": "SMS",
        "content": "Can you show me nearby pharmacy pickup options?"
    })
    assert inbound_res.status_code == 200
    assert inbound_res.json()["active_channel"] == "RCS"

    # Check messages
    msg_res = client.get(f"/api/messages?session_id={session_id}")
    assert msg_res.status_code == 200
    assert len(msg_res.json()) >= 3

    # Check traces
    trace_res = client.get(f"/api/traces?session_id={session_id}")
    assert trace_res.status_code == 200
    assert len(trace_res.json()) >= 2

def test_telemetry():
    res = client.get("/api/telemetry")
    assert res.status_code == 200
    telemetry = res.json()
    assert telemetry["status"] == "TELEMETRY_HEALTHY"
    assert "channel_distribution" in telemetry
    assert "financial_impact" in telemetry
