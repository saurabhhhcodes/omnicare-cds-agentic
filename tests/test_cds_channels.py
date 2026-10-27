import pytest
from backend.app.aws_cds.eum_sms import eum_sms_service
from backend.app.aws_cds.eum_rcs import eum_rcs_service
from backend.app.aws_cds.eum_whatsapp import eum_whatsapp_service
from backend.app.aws_cds.ses_email import ses_email_service

def test_eum_sms_dispatch():
    res = eum_sms_service.send_sms(
        destination_phone="+14155552671",
        message_body="OmniCare Clinical Alert: Prescription ready."
    )
    assert res["channel"] == "SMS"
    assert res["status"] == "DELIVERED"
    assert res["message_id"].startswith("sms-")
    assert res["latency_ms"] > 0

def test_eum_rcs_rich_card_and_carousel():
    card_res = eum_rcs_service.send_rich_card(
        destination_phone="+14155552671",
        title="Prescription Ready",
        description="Your Metoprolol ER is in stock.",
        suggestions=[{"type": "reply", "text": "Schedule Pickup", "postback": "ACTION_SCHEDULE_PICKUP"}]
    )
    assert card_res["channel"] == "RCS"
    assert card_res["verified_sender"] is True
    assert card_res["payload"]["card_type"] == "STANDALONE_RICH_CARD"

    carousel_res = eum_rcs_service.send_carousel(
        destination_phone="+14155552671",
        cards=[
            {"title": "CVS Health", "description": "0.8 mi away"},
            {"title": "Walgreens", "description": "1.4 mi away"}
        ]
    )
    assert carousel_res["channel"] == "RCS"
    assert carousel_res["payload"]["card_type"] == "CAROUSEL"
    assert len(carousel_res["payload"]["cards"]) == 2

def test_eum_whatsapp_interactive_and_media():
    wa_res = eum_whatsapp_service.send_text_message(
        to_phone="+14155552671",
        text_body="Hello Elena! You are connected with OmniCare.",
        quick_reply_buttons=["Report Symptoms", "Find Pharmacies"]
    )
    assert wa_res["channel"] == "WHATSAPP"
    assert wa_res["status"] == "READ"
    assert wa_res["verified_badge"] is True
    assert "interactive" in wa_res["payload"]

    media_res = eum_whatsapp_service.send_media_message(
        to_phone="+14155552671",
        media_type="image",
        media_url="https://example.com/symptom_swelling.jpg",
        caption="Verified Peripheral Edema Observation"
    )
    assert media_res["channel"] == "WHATSAPP"
    assert media_res["message_type"] == "IMAGE"

def test_ses_email_clinical_summary():
    email_res = ses_email_service.send_clinical_summary_email(
        recipient_email="elena.rostova@example.com",
        patient_name="Elena Rostova",
        medication_name="Metoprolol Succinate ER",
        dosage="50mg Oral Daily",
        instructions="Take with breakfast.",
        pharmacy_name="CVS Health (West Springfield)",
        pickup_slot="Today at 4:30 PM",
        qr_token="RX-PASS-884920"
    )
    assert email_res["channel"] == "SES_EMAIL"
    assert email_res["dkim_verified"] is True
    assert email_res["spf_verified"] is True
    assert "EXPRESS CONTACTLESS PICKUP PASS" in email_res["html_content"]
    assert "RX-PASS-884920" in email_res["html_content"]
