# 🎬 OmniCare CDS — Demonstration Videos & Narration Scripts
### AWS Communication Developer Services (CDS) Agentic AI Partner Hackathon ($40,000 Prize Pool)
**Targeting**: 1st Place Grand Prize ($18,000) & Best of WhatsApp Sponsored by Meta ($10,000)

---

## 📹 Video Assets Summary

Two distinct high-definition MP4 videos with synchronized studio-mastered voiceover narration are available:

| Video Asset | Description | Duration | Resolution / Specs | File Link |
|---|---|---|---|---|
| **Master Hackathon Presentation** (Recommended for Devpost) | Comprehensive end-to-end demonstration covering the real-world healthcare crisis, Bedrock AgentCore multi-agent architecture, all 4 AWS CDS channels (SMS, WhatsApp, RCS, SES), Clinic EHR sync, and quantitative ROI. | **3 min 30 sec** (210.7s) | 1440x900 HD @ 30 FPS, EBU R128 Mastered Voiceover | [omnicare_master_demo_narrated_hd.mp4](file:///Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/omnicare-cds-agentic/omnicare_master_demo_narrated_hd.mp4) |
| **Short Product Walkthrough** | Rapid, high-energy live UI walkthrough showing photo upload, vision diagnosis, RCS carousel 1-tap select, SES inbox with QR code, and AgentCore trace. | **34 seconds** (33.8s) | 1440x900 HD @ 30 FPS, Voiceover Synced | [omnicare_walkthrough_narrated.mp4](file:///Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/omnicare-cds-agentic/omnicare_walkthrough_narrated.mp4) |

---

## ⏱️ Master Video Timeline & Spoken Transcript (3:30)

### Scene 1: Problem Statement & OmniCare CDS Introduction (0:00 – 0:43)
- **Visuals**: OmniCare CDS header, AWS CDS architecture badges (AWS EUM SMS, RCS, WhatsApp, Amazon SES, Amazon Bedrock AgentCore), and active patient profile card (Elena Rostova, Congestive Heart Failure).
- **Spoken Voiceover**:
  > *"Welcome to OmniCare CDS, an autonomous omnichannel healthcare triage and delivery platform built for the AWS Communication Developer Services Partner Hackathon. Over forty-one billion dollars are spent annually on preventable hospital readmissions in the United States. For congestive heart failure patients, managing medication titrations after discharge often fails due to fragmented communication across one-way SMS alerts, unread emails, and forty-five minute phone queues. OmniCare CDS solves this by turning AWS communication channels into an intelligent, continuous conversational experience orchestrated by Amazon Bedrock AgentCore."*

### Scene 2: AWS EUM Social (WhatsApp) & Bedrock Vision Triage (0:43 – 1:23)
- **Visuals**: WhatsApp interface with verified business badge. Patient uploads ankle photo. Bedrock Vision Agent analyzes bilateral pitting edema (+2), cross-references EHR records, and recommends diuretic titration (Furosemide 20mg -> 40mg) with interactive action chips.
- **Spoken Voiceover**:
  > *"The patient journey begins with a proactive check-in. The patient chooses to continue on WhatsApp using AWS End User Messaging Social, powered by the Meta Cloud API. Here, Elena reports worsening swelling and uploads a photo of her ankles. In real time, Amazon Bedrock AgentCore invokes its Vision Triage Agent. Using Claude 3.5 Sonnet, the multimodal model analyzes the image, detects plus-two pitting edema, correlates it with her recent discharge record, and recommends an immediate Furosemide dosage increase from twenty to forty milligrams, all within the verified WhatsApp chat."*

### Scene 3: AWS EUM RCS Interactive Pharmacy Carousel (1:23 – 2:00)
- **Visuals**: Smooth transition to RCS & SMS view. GSMA UP 2.4 compliant RCS carousel with 3 geolocated pharmacies (CVS HealthHub, Walgreens, Rite Aid), live inventory status, distance tags, and 1-tap select. CVS Pharmacy is selected with confirmation badge.
- **Spoken Voiceover**:
  > *"To fulfill the updated prescription, the conversation transitions seamlessly to AWS End User Messaging RCS. Instead of sending an external web link, the patient receives an interactive, GSMA Universal Profile 2.4 compliant RCS carousel. Elena reviews nearby in-network pharmacies with live inventory and distances, and selects CVS HealthHub with a single tap. The Bedrock Pharmacy Routing Agent locks the reservation instantly without requiring a separate portal login, preserving full conversational context across channels."*

### Scene 4: Amazon SES Verified Prescription Pass & Contactless QR (2:00 – 2:30)
- **Visuals**: Amazon SES patient inbox. Verified email message displaying DKIM: PASS and SPF: PASS authentication, physician review note, dosage escalation instructions, and a dynamic contactless QR pass for express pharmacy pickup.
- **Spoken Voiceover**:
  > *"The moment the reservation is confirmed, Amazon Simple Email Service delivers a comprehensive, DKIM-verified clinical visit summary to Elena's inbox. The email includes physician oversight notes, dosage warnings, and a dynamic contactless QR pass for express pickup at the pharmacy counter. This completes a four-channel loop where SMS, WhatsApp, RCS, and SES work together as a single unified system."*

### Scene 5: Amazon Bedrock AgentCore State Machine & Multi-Agent Trace (2:30 – 2:56)
- **Visuals**: Inspection of the Bedrock AgentCore execution trace panel and tool invocation JSON modal (`analyze_symptom_or_medication_image`, `search_nearby_pharmacies`). The 4 collaborative agents are highlighted (`ClinicalTriageAgent`, `VisionTriageAgent`, `PharmacyRoutingAgent`, `OmnichannelDispatcher`).
- **Spoken Voiceover**:
  > *"Under the hood, Amazon Bedrock AgentCore powers this experience. Rather than a rigid scripted bot, four specialized agents collaborate through a state machine: the Clinical Triage Agent assesses patient risk, the Vision Agent inspects medical imagery, the Pharmacy Routing Agent coordinates fulfillment, and the Omnichannel Dispatcher preserves conversational memory across every channel transition."*

### Scene 6: Clinical EHR Sync, Quantitative Results & AWS Marketplace (2:56 – 3:30)
- **Visuals**: Smooth scroll to Clinic Operations Center showing real-time SOAP note and FHIR sync. Scroll down to AWS CDS Deliverability & Financial Impact Analytics dashboard (99.4% RCS delivery rate, 99.6% operational cost reduction: $0.027 vs $6.50).
- **Spoken Voiceover**:
  > *"In the Clinic Operations Center, healthcare providers see real-time FHIR SOAP notes synchronized automatically. Crucially, our telemetry demonstrates a ninety-nine point four percent message deliverability rate and reduces post-discharge triage costs from six dollars and fifty cents per call to under three cents per automated interaction—a ninety-nine point six percent savings. Packaged with AWS CDK, OmniCare CDS is ready for immediate deployment on AWS Marketplace. Thank you!"*
