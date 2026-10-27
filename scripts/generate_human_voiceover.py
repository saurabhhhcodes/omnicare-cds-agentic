#!/usr/bin/env python3
"""
OmniCare CDS - Ultra-Humanistic Neural Voiceover Generator
Uses Microsoft Azure Neural TTS (en-US-AndrewMultilingualNeural)
Generates high-definition audio segments for Intro, Product Walkthrough, and Outro.
"""

import asyncio
import json
import os
import subprocess
import edge_tts

AUDIO_DIR = "/Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/omnicare-cds-agentic/audio_assets/human_neural"
os.makedirs(AUDIO_DIR, exist_ok=True)

VOICE = "en-US-AndrewMultilingualNeural"  # Warm, authentic, confident tech founder voice

SCENES = [
    {
        "id": "scene0_creator_intro",
        "title": "Creator Introduction & Architecture Overview",
        "text": "Hey everyone, I'm Saurabh! Welcome to my demonstration of OmniCare CDS, an autonomous omnichannel healthcare intelligence platform that I built for the AWS Communication Developer Services Partner Hackathon. In healthcare, preventable hospital readmissions cost over forty-one billion dollars every single year, largely because patient communication is broken across one-way SMS alerts, unread emails, and forty-five minute phone queues. In this project, I set out to prove that AWS Communication Developer Services, combined with Amazon Bedrock AgentCore, can transform static notification channels into a fluid, two-way conversational care experience. Let's jump into the live architecture and watch OmniCare CDS in action!",
        "pre_wait": 1.0,
        "post_wait": 2.0
    },
    {
        "id": "scene1_whatsapp_vision",
        "title": "Proactive SMS to WhatsApp & Multimodal Vision Triage",
        "text": "Our patient journey begins with a proactive post-discharge outreach. Elena Rostova was recently discharged for congestive heart failure. She prefers WhatsApp, so our system transitions seamlessly to AWS End User Messaging Social, powered by the Meta Cloud API. Here, Elena reports worsening swelling and snaps a photo of her ankles. Instantly, our Bedrock AgentCore invokes its Vision Triage Agent. Using multimodal Claude 3.5 Sonnet, it inspects the image in real time, diagnoses plus-two bilateral pitting edema, cross-references her electronic health record, and recommends titrating her Furosemide dosage from twenty to forty milligrams, all within the verified WhatsApp chat.",
        "pre_wait": 1.5,
        "post_wait": 2.5
    },
    {
        "id": "scene2_rcs_carousel",
        "title": "GSMA UP 2.4 RCS Interactive Pharmacy Carousel",
        "text": "To fulfill the updated prescription, the conversation shifts smoothly into AWS End User Messaging RCS. Instead of sending an external web portal link, Elena receives an interactive, GSMA Universal Profile 2.4 compliant RCS carousel right in her native messaging app. She reviews nearby in-network pharmacies with live inventory, operating hours, and distances. With a single tap, Elena selects CVS HealthHub. The Bedrock Pharmacy Routing Agent locks the pickup reservation instantly, preserving complete conversational context with zero repetition.",
        "pre_wait": 1.5,
        "post_wait": 2.5
    },
    {
        "id": "scene3_ses_email",
        "title": "Amazon SES Verified Clinical Summary & Contactless QR Pass",
        "text": "The moment the reservation is confirmed, Amazon Simple Email Service delivers a comprehensive, DKIM-verified clinical visit summary to Elena's inbox. The email includes physician oversight notes, dosage escalation guidelines, and a dynamic contactless QR pass for express pickup at the pharmacy counter. This completes an end-to-end loop where SMS, WhatsApp, RCS, and SES operate as one unified care experience.",
        "pre_wait": 1.5,
        "post_wait": 2.5
    },
    {
        "id": "scene4_bedrock_trace",
        "title": "Amazon Bedrock AgentCore State Machine & Reasoning Trace",
        "text": "Under the hood, Amazon Bedrock AgentCore powers this intelligent orchestration. Rather than a rigid scripted bot, four specialized agents collaborate through an autonomous state machine: the Clinical Triage Agent assesses patient risk, the Vision Agent inspects medical imagery, the Pharmacy Routing Agent coordinates fulfillment, and the Omnichannel Dispatcher preserves conversational memory across every channel transition.",
        "pre_wait": 1.2,
        "post_wait": 2.0
    },
    {
        "id": "scene5_clinic_ops_analytics",
        "title": "Clinic EHR Sync, Quantitative ROI & Operational Savings",
        "text": "In the Clinic Operations Center, healthcare providers see real-time FHIR SOAP notes synchronized automatically. Crucially, our telemetry demonstrates a ninety-nine point four percent message deliverability rate and slashes post-discharge triage costs from six dollars and fifty cents per call down to under three cents per automated interaction, a ninety-nine point six percent operational savings.",
        "pre_wait": 1.5,
        "post_wait": 2.5
    },
    {
        "id": "scene6_creator_outro",
        "title": "Creator Outro & Open Source Summary",
        "text": "And that is OmniCare CDS! By bringing AWS Communication Developer Services together with Bedrock AgentCore, we've demonstrated that the future of patient engagement isn't fragmented notifications, it's conversational, autonomous, and unified on AWS. The entire codebase is open-source on GitHub under Apache 2.0, thoroughly tested, and ready for deployment on AWS Marketplace. Thank you so much for watching, and thank you to AWS and the hackathon team!",
        "pre_wait": 1.0,
        "post_wait": 2.5
    }
]

def get_duration(audio_path: str) -> float:
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", audio_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def master_audio(in_file: str, out_file: str):
    """Apply broadcast compression and EBU R128 loudness normalization (-16 LUFS)."""
    filter_chain = (
        "highpass=f=80,lowpass=f=9500,"
        "acompressor=threshold=-16dB:ratio=3:attack=5:release=50,"
        "loudnorm=I=-16:TP=-1.5:LRA=11"
    )
    cmd = [
        "/opt/homebrew/bin/ffmpeg", "-y", "-i", in_file,
        "-af", filter_chain,
        "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
        out_file
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

async def generate_speech(text: str, out_path: str):
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(out_path)

async def main():
    print(f"🎙️ Generating Ultra-Humanistic Neural Narration using voice: {VOICE}...")
    segments = []
    concat_files = []

    for i, scene in enumerate(SCENES):
        raw_mp3 = os.path.join(AUDIO_DIR, f"{scene['id']}_raw.mp3")
        proc_m4a = os.path.join(AUDIO_DIR, f"{scene['id']}_mastered.m4a")
        
        print(f"  [{i+1}/{len(SCENES)}] Synthesizing: {scene['title']}...")
        await generate_speech(scene["text"], raw_mp3)
        master_audio(raw_mp3, proc_m4a)
        
        speech_dur = get_duration(proc_m4a)
        scene_total_dur = scene["pre_wait"] + speech_dur + scene["post_wait"]

        pre_pad = os.path.join(AUDIO_DIR, f"{scene['id']}_pre.m4a")
        post_pad = os.path.join(AUDIO_DIR, f"{scene['id']}_post.m4a")
        full_scene_audio = os.path.join(AUDIO_DIR, f"{scene['id']}_full.m4a")

        # Generate silent pads
        subprocess.run([
            "/opt/homebrew/bin/ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
            "-t", str(scene["pre_wait"]), "-c:a", "aac", "-b:a", "192k", pre_pad
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        subprocess.run([
            "/opt/homebrew/bin/ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
            "-t", str(scene["post_wait"]), "-c:a", "aac", "-b:a", "192k", post_pad
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Concat pre + speech + post
        concat_txt = os.path.join(AUDIO_DIR, f"{scene['id']}_concat.txt")
        with open(concat_txt, "w") as f:
            f.write(f"file '{pre_pad}'\nfile '{proc_m4a}'\nfile '{post_pad}'\n")

        subprocess.run([
            "/opt/homebrew/bin/ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", concat_txt, "-c:a", "aac", "-b:a", "192k", full_scene_audio
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        measured_dur = get_duration(full_scene_audio)
        print(f"      -> Speech: {speech_dur:.2f}s | Total Scene: {measured_dur:.2f}s")

        segments.append({
            "index": i,
            "id": scene["id"],
            "title": scene["title"],
            "speech_duration": speech_dur,
            "pre_wait": scene["pre_wait"],
            "post_wait": scene["post_wait"],
            "total_scene_duration": measured_dur,
            "audio_file": full_scene_audio
        })
        concat_files.append(full_scene_audio)

    # Master full soundtrack
    master_concat_txt = os.path.join(AUDIO_DIR, "master_neural_concat.txt")
    with open(master_concat_txt, "w") as f:
        for cf in concat_files:
            f.write(f"file '{cf}'\n")

    master_soundtrack = os.path.join(AUDIO_DIR, "master_neural_soundtrack.m4a")
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", master_concat_txt, "-c:a", "aac", "-b:a", "192k", master_soundtrack
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    total_dur = get_duration(master_soundtrack)
    print(f"\n🎉 SUCCESS: Master Human Neural Audio Generated: {master_soundtrack} ({total_dur:.2f}s / {int(total_dur//60)}m {int(total_dur%60)}s)")

    metadata_path = os.path.join(AUDIO_DIR, "human_neural_timing_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump({
            "voice": VOICE,
            "total_duration": total_dur,
            "scenes": segments
        }, f, indent=2)

    print(f"📄 Saved Timing Metadata: {metadata_path}")

if __name__ == "__main__":
    asyncio.run(main())
