<div align="center">

# 🏥 OmniCare CDS
### Autonomous Omnichannel Clinical Triage & Prescription Delivery Platform
**Built for the AWS Communication Developer Services (CDS) Agentic AI Partner Hackathon 2026**

[![AWS CDS](https://img.shields.io/badge/AWS-Communication%20Developer%20Services-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![Amazon Bedrock](https://img.shields.io/badge/Amazon%20Bedrock-AgentCore%20%7C%20Claude%203.5-5C3EE8?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![WhatsApp](https://img.shields.io/badge/Meta%20WhatsApp-Cloud%20API%20%2410k%20Track-25D366?logo=whatsapp&logoColor=white)](https://developers.facebook.com/products/whatsapp/)
[![RCS](https://img.shields.io/badge/EUM%20RCS-GSMA%20UP%202.4-4285F4?logo=google&logoColor=white)](https://aws.amazon.com)
[![Amazon SES](https://img.shields.io/badge/Amazon%20SES-Verified%20SPF%2FDKIM-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/ses/)
[![Pytest](https://img.shields.io/badge/Pytest-11%2F11%20Passed%20(100%25)-brightgreen?logo=pytest&logoColor=white)](https://pytest.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

[**Devpost Submission Pack**](docs/DEVPOST_SUBMISSION.md) • [**Architecture Specs**](docs/ARCHITECTURE.md) • [**Video Demo Script**](docs/DEMO_VIDEO_SCRIPT.md) • [**Recorded Demo Video**](omnicare_product_walkthrough_hd.mp4) • [**Quickstart**](#-quick-start-guide)

---

</div>

## 📌 Executive Summary

Every year, millions of post-discharge patients suffer preventable complications because clinical communication is fragmented across rigid, single-channel silos. Hospitals send automated phone calls that patients ignore, or one-way SMS alerts that cannot answer follow-up questions.

**OmniCare CDS** revolutionizes patient engagement by establishing an **autonomous, cross-channel communication loop** powered by **AWS Communication Developer Services (CDS)** and **Amazon Bedrock AgentCore**. 

Patients fluidly transition across channels without losing context:
1. **AWS EUM SMS**: Proactive outbound post-discharge check-in.
2. **AWS EUM Social (WhatsApp)**: 2-way conversational triage & multimodal photo diagnostics (*Targeting Meta's \$10,000 Prize*).
3. **AWS EUM RCS (GSMA UP 2.4)**: Interactive, geolocated Pharmacy Carousel with 1-tap booking chips.
4. **Amazon SES**: Authenticated clinical discharge summary with contactless QR code express pickup pass.
5. **Amazon Bedrock AgentCore**: Multi-agent brain (Claude 3.5 Sonnet) preserving the clinical context graph across all channels.

---

## 🏆 Hackathon Tracks Addressed

| Award Track | How OmniCare CDS Wins |
|---|---|
| **1st Place Grand Prize ($18,000 USD)** | Complete, production-grade clinical AI platform utilizing all four core AWS CDS services (EUM SMS, RCS, WhatsApp Social, Amazon SES) and Amazon Bedrock AgentCore. 100% automated test coverage, 99.6% operational cost reduction, and single-port unified deployment. |
| **Best of WhatsApp — Sponsored by Meta ($10,000 USD)** | Deep integration with AWS End User Messaging Social: verified green business account, multimodal clinical vision (diagnosing ankle edema or antibiotic rash), interactive quick-reply buttons, and real-time read receipts (double blue checkmarks). |

---

## 🏗️ Architecture & Omnichannel Flow

```mermaid
flowchart TD
    subgraph CDS ["1. AWS Communication Developer Services (CDS)"]
        SMS["1. AWS EUM SMS\n(Proactive Post-Discharge Alert)"]
        WA["2. WhatsApp (Meta Cloud API)\n(Photo Upload & Clinical Triage)"]
        RCS["3. AWS EUM RCS Carousel\n(Interactive 1-Tap Pharmacy Selection)"]
        SES["4. Amazon SES Email\n(DKIM Verified QR Prescription Pass)"]
    end

    subgraph AGENTCORE ["2. Amazon Bedrock AgentCore (Claude 3.5 Sonnet)"]
        SUPER["BedrockAgentCore Orchestrator"]
        TRIAGE["ClinicalTriageAgent\n(Intent & Severity Scoring)"]
        VISION["VisionTriageAgent\n(Multimodal Claude 3.5 Vision)"]
        ROUTING["PharmacyRoutingAgent\n(Geofenced Inventory Match)"]
        DISPATCH["OmnichannelDispatcher\n(Channel Hop & SES Finalizer)"]
        
        SUPER --> TRIAGE
        SUPER --> VISION
        SUPER --> ROUTING
        SUPER --> DISPATCH
    end

    subgraph TOOLS ["3. Agent Execution Tools"]
        T1["fhir_patient_lookup()"]
        T2["analyze_symptom_or_medication_image()"]
        T3["search_nearby_pharmacies()"]
        T4["reserve_pharmacy_pickup()"]
        T5["dispatch_ses_clinical_summary()"]
    end

    subgraph OUTPUT ["4. Unified Single-Port Command HUD"]
        PHONE["Dual Phone Simulator\n(WhatsApp & RCS / SMS)"]
        INBOX["SES Email Inbox Viewer"]
        TRACE["Live Bedrock AgentCore Trace Visualizer"]
        METRICS["99.6% Cost Reduction Analytics Dashboard"]
    end

    SMS --> WA
    WA --> RCS
    RCS --> SES

    SMS <--> SUPER
    WA <--> SUPER
    RCS <--> SUPER
    SES <--> SUPER

    TRIAGE --> T1
    VISION --> T2
    ROUTING --> T3
    ROUTING --> T4
    DISPATCH --> T5

    SUPER --> OUTPUT
```

---

## ⚡ The Four-Channel Journey in Action

```
[1. OUTBOUND SMS]
  "OmniCare Alert: Hi Elena, Dr. Chen reviewed your post-discharge Heart Failure telemetry.
   Reply PHARMACY to review your Metoprolol refill with 1-tap booking, or WHATSAPP to consult our specialist."
  │
  ▼
[2. WHATSAPP MULTIMODAL TRIAGE]
  Elena switches to WhatsApp: "Here is a photo of my ankles, they feel swollen and puffy."
  ↳ Bedrock Vision Agent analyzes image:
    "Detected Bilateral Pre-tibial Peripheral Edema (94% confidence).
     Recommend Furosemide titration. Would you like me to find nearby refill options?"
  │
  ▼
[3. RCS INTERACTIVE CAROUSEL]
  Elena taps [Find Pharmacies]:
  ↳ AWS EUM RCS renders interactive 3-card carousel:
    • Card 1: CVS Health (0.8 mi away • IN STOCK • 24 Hours Drive-Thru) -> [1-Tap Select]
    • Card 2: Walgreens Pharmacy (1.4 mi away • IN STOCK) -> [1-Tap Select]
    • Card 3: Rite Aid (2.2 mi away • LIMITED)
  Elena taps [1-Tap Select] on CVS Health.
  │
  ▼
[4. AMAZON SES CLINICAL PASS]
  Omnichannel Dispatcher triggers Amazon SES:
  ↳ Elena receives an authenticated, DKIM-signed HTML email with:
    • Physician dosage & titration schedule (Metoprolol ER 50mg)
    • CVS Health pickup confirmation window (Today at 4:30 PM)
    • Embedded Contactless QR Code Pickup Pass (Token: RX-PASS-884920)
```

---

## 🚀 Quick Start Guide

OmniCare CDS features a **unified single-port deployment**: FastAPI serves both the REST API, WebSocket streams, and the pre-compiled React 18 single-page application from `http://127.0.0.1:8000/`.

### 1-Click Startup (macOS / Linux / AWS EC2)
```bash
git clone https://github.com/saurabhhhcodes/omnicare-cds-agentic.git
cd omnicare-cds-agentic
chmod +x start.sh stop.sh
./start.sh
```

To stop:
```bash
./stop.sh
```

---

## 🌐 Application Endpoints

Once started, access the complete platform at:

| Resource | URL | Description |
|---|---|---|
| **Tactical Command Center** | [http://127.0.0.1:8000/](http://127.0.0.1:8000/) | Integrated React 18 HUD (Dual Phone Simulator, SES Email Inbox, Bedrock Trace, Analytics). |
| **OpenAPI / Swagger Docs** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | Interactive endpoint tester and schema viewer. |
| **Health Diagnostics** | [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) | Verification of all 4 active AWS CDS services and Bedrock AgentCore. |
| **Real-Time WebSocket** | `ws://127.0.0.1:8000/ws` | Bi-directional streaming for live chat, tool traces, and carrier receipts. |

---

## 🧪 Comprehensive Automated Testing

Run the full automated test suite:
```bash
python -m pytest -v
```

### Verified Test Results (11/11 Passed, 100%)
```text
tests/test_api.py::test_health_check PASSED                              [  9%]
tests/test_api.py::test_list_patients PASSED                             [ 18%]
tests/test_api.py::test_start_scenario_and_flow PASSED                   [ 27%]
tests/test_api.py::test_telemetry PASSED                                 [ 36%]
tests/test_bedrock_agent.py::test_bedrock_agent_sms_to_rcs_carousel PASSED [ 45%]
tests/test_bedrock_agent.py::test_bedrock_agent_rcs_to_ses_email PASSED  [ 54%]
tests/test_bedrock_agent.py::test_bedrock_agent_whatsapp_multimodal_vision PASSED [ 63%]
tests/test_cds_channels.py::test_eum_sms_dispatch PASSED                 [ 72%]
tests/test_cds_channels.py::test_eum_rcs_rich_card_and_carousel PASSED   [ 81%]
tests/test_cds_channels.py::test_eum_whatsapp_interactive_and_media PASSED [ 90%]
tests/test_cds_channels.py::test_ses_email_clinical_summary PASSED       [100%]

======================== 11 passed in 0.27s ========================
```

---

## 🎬 Automated Product Demo Video Recording

The project includes an automated Playwright + ffmpeg recording pipeline (`recorder/record_demo.js`) that recorded the full product in high-definition:
* **Recorded Video Asset**: [`omnicare_product_walkthrough_hd.mp4`](omnicare_product_walkthrough_hd.mp4)
* **Video Narration Script**: [`docs/DEMO_VIDEO_SCRIPT.md`](docs/DEMO_VIDEO_SCRIPT.md)

---

## 👥 Authors & Hackathon Metadata

* **Competition**: [AWS Communication Developer Services (CDS) Agentic AI Partner Hackathon](https://aws-cds-partner.devpost.com/)
* **Prizes Targeted**: 1st Place Grand Prize (\$18,000 USD) + Best of WhatsApp Sponsored by Meta (\$10,000 USD)
* **Authors**: Saurabh Kumar Bajpai & Anshika Sharma
* **Repository**: [https://github.com/saurabhhhcodes/omnicare-cds-agentic](https://github.com/saurabhhhcodes/omnicare-cds-agentic)

---
<div align="center">
<b>OmniCare CDS — The Future of Healthcare Communication, Powered by AWS.</b>
</div>
