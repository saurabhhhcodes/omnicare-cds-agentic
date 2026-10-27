# 🎬 OmniCare CDS — Demonstration Videos & Narration Scripts
### AWS Communication Developer Services (CDS) Agentic AI Partner Hackathon ($40,000 Prize Pool)
**Targeting**: 1st Place Grand Prize ($18,000) & Best of WhatsApp Sponsored by Meta ($10,000)
**Created by**: Saurabh

---

## 📹 Video Assets Summary

| Video Asset | Description | Duration | Resolution / Specs | File Link |
|---|---|---|---|---|
| **YouTube Master Video (Directly Postable)** ⭐ | **Full end-to-end presentation designed specifically for YouTube & Devpost:** Features Creator Introduction by Saurabh, the live product journey across WhatsApp, RCS carousel, SES verified pass, Bedrock AgentCore trace, Clinic EHR sync, 99.6% ROI analytics, and Creator Outro. Powered by an ultra-realistic human neural voice (`en-US-AndrewMultilingualNeural`). | **4 min 35 sec** (275.2s) | 1440x900 HD @ 30 FPS, Human Neural Voice, EBU R128 Mastered Audio | [omnicare_youtube_master_hd.mp4](file:///Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/omnicare-cds-agentic/omnicare_youtube_master_hd.mp4) |
| **Compact Hackathon Presentation** | Focused product demo walking through the clinical workflow and Bedrock AgentCore state machine. | **3 min 30 sec** (210.7s) | 1440x900 HD @ 30 FPS | [omnicare_master_demo_narrated_hd.mp4](file:///Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/omnicare-cds-agentic/omnicare_master_demo_narrated_hd.mp4) |
| **Short Product Walkthrough** | Rapid, high-energy UI walkthrough. | **34 seconds** (33.8s) | 1440x900 HD @ 30 FPS | [omnicare_walkthrough_narrated.mp4](file:///Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/omnicare-cds-agentic/omnicare_walkthrough_narrated.mp4) |

---

## 🎙️ YouTube Master Video Verbatim Transcript (4:35)

### Scene 0: Creator Introduction & Architecture Overview (0:00 – 0:51)
- **Visuals**: Modern developer launchpad showing the medical cross brand mark, "Created by Saurabh", AWS CDS hackathon banner, architecture pipeline, and live terminal showing 11/11 tests passing.
- **Voiceover**:
  > *"Hey everyone, I'm Saurabh! Welcome to my demonstration of OmniCare CDS, an autonomous omnichannel healthcare intelligence platform that I built for the AWS Communication Developer Services Partner Hackathon. In healthcare, preventable hospital readmissions cost over forty-one billion dollars every single year, largely because patient communication is broken across one-way SMS alerts, unread emails, and forty-five minute phone queues. In this project, I set out to prove that AWS Communication Developer Services, combined with Amazon Bedrock AgentCore, can transform static notification channels into a fluid, two-way conversational care experience. Let's jump into the live architecture and watch OmniCare CDS in action!"*

### Scene 1: Proactive SMS to WhatsApp & Multimodal Vision Triage (0:51 – 1:43)
- **Visuals**: Transition to OmniCare CDS live interface. Patient profile for Elena Rostova (CHF). WhatsApp interface with green verified shield. User uploads ankle edema photo. Bedrock Vision Agent analyzes bilateral pitting edema (+2), cross-references EHR records, and recommends diuretic titration (Furosemide 20mg -> 40mg).
- **Voiceover**:
  > *"Our patient journey begins with a proactive post-discharge outreach. Elena Rostova was recently discharged for congestive heart failure. She prefers WhatsApp, so our system transitions seamlessly to AWS End User Messaging Social, powered by the Meta Cloud API. Here, Elena reports worsening swelling and snaps a photo of her ankles. Instantly, our Bedrock AgentCore invokes its Vision Triage Agent. Using multimodal Claude 3.5 Sonnet, it inspects the image in real time, diagnoses plus-two bilateral pitting edema, cross-references her electronic health record, and recommends titrating her Furosemide dosage from twenty to forty milligrams, all within the verified WhatsApp chat."*

### Scene 2: GSMA UP 2.4 RCS Interactive Pharmacy Carousel (1:43 – 2:26)
- **Visuals**: Seamless handoff to RCS & SMS view. GSMA UP 2.4 compliant RCS carousel with 3 geolocated pharmacies (CVS HealthHub, Walgreens, Rite Aid), live inventory status, distance tags, and 1-tap select. CVS Pharmacy is selected with confirmation badge.
- **Voiceover**:
  > *"To fulfill the updated prescription, the conversation shifts smoothly into AWS End User Messaging RCS. Instead of sending an external web portal link, Elena receives an interactive, GSMA Universal Profile 2.4 compliant RCS carousel right in her native messaging app. She reviews nearby in-network pharmacies with live inventory, operating hours, and distances. With a single tap, Elena selects CVS HealthHub. The Bedrock Pharmacy Routing Agent locks the pickup reservation instantly, preserving complete conversational context with zero repetition."*

### Scene 3: Amazon SES Verified Clinical Summary & Contactless QR Pass (2:26 – 3:00)
- **Visuals**: Amazon SES patient inbox. Verified email message displaying DKIM: PASS and SPF: PASS authentication, physician review note, dosage escalation guidelines, and dynamic contactless QR pass for express pharmacy pickup.
- **Voiceover**:
  > *"The moment the reservation is confirmed, Amazon Simple Email Service delivers a comprehensive, DKIM-verified clinical visit summary to Elena's inbox. The email includes physician oversight notes, dosage escalation guidelines, and a dynamic contactless QR pass for express pickup at the pharmacy counter. This completes an end-to-end loop where SMS, WhatsApp, RCS, and SES operate as one unified care experience."*

### Scene 4: Amazon Bedrock AgentCore State Machine & Reasoning Trace (3:00 – 3:30)
- **Visuals**: Inspection of the Bedrock AgentCore execution trace panel and tool invocation JSON modal (`analyze_symptom_or_medication_image`, `search_nearby_pharmacies`). The 4 collaborative agents are highlighted (`ClinicalTriageAgent`, `VisionTriageAgent`, `PharmacyRoutingAgent`, `OmnichannelDispatcher`).
- **Voiceover**:
  > *"Under the hood, Amazon Bedrock AgentCore powers this intelligent orchestration. Rather than a rigid scripted bot, four specialized agents collaborate through an autonomous state machine: the Clinical Triage Agent assesses patient risk, the Vision Agent inspects medical imagery, the Pharmacy Routing Agent coordinates fulfillment, and the Omnichannel Dispatcher preserves conversational memory across every channel transition."*

### Scene 5: Clinic EHR Sync, Quantitative ROI & Operational Savings (3:30 – 4:00)
- **Visuals**: Smooth scroll to Clinic Operations Center showing real-time SOAP notes and FHIR sync. Scroll down to AWS CDS Deliverability & Financial Impact Analytics dashboard (99.4% RCS delivery rate, 99.6% operational cost reduction: $0.027 vs $6.50).
- **Voiceover**:
  > *"In the Clinic Operations Center, healthcare providers see real-time FHIR SOAP notes synchronized automatically. Crucially, our telemetry demonstrates a ninety-nine point four percent message deliverability rate and slashes post-discharge triage costs from six dollars and fifty cents per call down to under three cents per automated interaction, a ninety-nine point six percent operational savings."*

### Scene 6: Creator Outro & Open Source Summary (4:00 – 4:35)
- **Visuals**: Transition to creator summary view. 4 impact metric cards (99.6% Cost Reduction, 99.4% Deliverability, 0% Context Drop-off, 11/11 Tests Passing). GitHub repository link, Apache 2.0 license, and AWS Partner Central campaign code.
- **Voiceover**:
  > *"And that is OmniCare CDS! By bringing AWS Communication Developer Services together with Bedrock AgentCore, we've demonstrated that the future of patient engagement isn't fragmented notifications, it's conversational, autonomous, and unified on AWS. The entire codebase is open-source on GitHub under Apache 2.0, thoroughly tested, and ready for deployment on AWS Marketplace. Thank you so much for watching, and thank you to AWS and the hackathon team!"*
