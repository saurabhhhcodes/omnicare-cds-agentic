#!/usr/bin/env python3
"""
OmniCare CDS - Voiceover Audio Generator & Synchronizer
Generates studio-mastered audio narration for:
1. Short 34s Product Walkthrough (omnicare_walkthrough_narrated.mp4)
2. Master 2m20s Comprehensive Hackathon Presentation (omnicare_master_demo_narrated_hd.mp4)
"""

import json
import os
import subprocess
import sys

AUDIO_DIR = "/Users/saurabhkumarbajpaiai/.gemini/antigravity/scratch/omnicare-cds-agentic/audio_assets"
os.makedirs(AUDIO_DIR, exist_ok=True)

# -------------------------------------------------------------------------
# SCRIPT 1: Short 34-second Walkthrough Voiceover
# Timed tightly to match the 33.8s existing video
# -------------------------------------------------------------------------
SHORT_SCRIPT = [
    {
        "id": "short_01_intro",
        "start": 0.0,
        "text": "OmniCare CDS: Autonomous healthcare triage powered by AWS Communication Developer Services and Bedrock AgentCore."
    },
    {
        "id": "short_02_whatsapp",
        "start": 5.0,
        "text": "On WhatsApp, the patient uploads a photo. Bedrock Vision detects bilateral pitting edema and recommends dose titration."
    },
    {
        "id": "short_03_rcs",
        "start": 14.0,
        "text": "Handoff to GSMA compliant RCS. The patient browses nearby pharmacies in an interactive carousel and reserves pickup with one tap."
    },
    {
        "id": "short_04_ses",
        "start": 21.5,
        "text": "Amazon SES delivers a DKIM verified clinical summary and contactless QR pass to the patient's inbox."
    },
    {
        "id": "short_05_trace_metrics",
        "start": 27.0,
        "text": "Bedrock AgentCore inspects multi-agent reasoning, driving ninety-nine percent delivery and a ninety-nine point six percent cost reduction."
    }
]

# -------------------------------------------------------------------------
# SCRIPT 2: Master 2m20s Comprehensive Hackathon Presentation
# Covers Problem, Bedrock AgentCore, All 4 CDS Channels, EHR, & Metrics
# -------------------------------------------------------------------------
MASTER_SCRIPT = [
    {
        "id": "scene1_problem_intro",
        "title": "Problem Statement & OmniCare CDS Introduction",
        "text": "Welcome to OmniCare CDS, an autonomous omnichannel healthcare triage and delivery platform built for the AWS Communication Developer Services Partner Hackathon. Over forty-one billion dollars are spent annually on preventable hospital readmissions in the United States. For congestive heart failure patients, managing medication titrations after discharge often fails due to fragmented communication across one-way SMS alerts, unread emails, and forty-five minute phone queues. OmniCare CDS solves this by turning AWS communication channels into an intelligent, continuous conversational experience orchestrated by Amazon Bedrock AgentCore.",
        "pre_wait": 1.0,
        "post_wait": 2.0
    },
    {
        "id": "scene2_whatsapp_vision",
        "title": "AWS EUM Social (WhatsApp) & Bedrock Vision Triage",
        "text": "The patient journey begins with a proactive check-in. The patient chooses to continue on WhatsApp using AWS End User Messaging Social, powered by the Meta Cloud API. Here, Elena reports worsening swelling and uploads a photo of her ankles. In real time, Amazon Bedrock AgentCore invokes its Vision Triage Agent. Using Claude 3.5 Sonnet, the multimodal model analyzes the image, detects plus-two pitting edema, correlates it with her recent discharge record, and recommends an immediate Furosemide dosage increase from twenty to forty milligrams, all within the verified WhatsApp chat.",
        "pre_wait": 1.5,
        "post_wait": 2.5
    },
    {
        "id": "scene3_rcs_carousel",
        "title": "AWS EUM RCS Interactive Pharmacy Carousel",
        "text": "To fulfill the updated prescription, the conversation transitions seamlessly to AWS End User Messaging RCS. Instead of sending an external web link, the patient receives an interactive, GSMA Universal Profile 2.4 compliant RCS carousel. Elena reviews nearby in-network pharmacies with live inventory and distances, and selects CVS HealthHub with a single tap. The Bedrock Pharmacy Routing Agent locks the reservation instantly without requiring a separate portal login, preserving full conversational context across channels.",
        "pre_wait": 1.5,
        "post_wait": 2.5
    },
    {
        "id": "scene4_ses_email",
        "title": "Amazon SES Verified Clinical Summary & Contactless QR Pass",
        "text": "The moment the reservation is confirmed, Amazon Simple Email Service delivers a comprehensive, DKIM-verified clinical visit summary to Elena's inbox. The email includes physician oversight notes, dosage warnings, and a dynamic contactless QR pass for express pickup at the pharmacy counter. This completes a four-channel loop where SMS, WhatsApp, RCS, and SES work together as a single unified system.",
        "pre_wait": 1.5,
        "post_wait": 2.5
    },
    {
        "id": "scene5_bedrock_trace",
        "title": "Amazon Bedrock AgentCore State Machine & Multi-Agent Trace",
        "text": "Under the hood, Amazon Bedrock AgentCore powers this experience. Rather than a rigid scripted bot, four specialized agents collaborate through a state machine: the Clinical Triage Agent assesses patient risk, the Vision Agent inspects medical imagery, the Pharmacy Routing Agent coordinates fulfillment, and the Omnichannel Dispatcher preserves conversational memory across every channel transition.",
        "pre_wait": 1.0,
        "post_wait": 2.0
    },
    {
        "id": "scene6_clinic_ops_analytics",
        "title": "Clinical EHR Sync, Quantitative Results & AWS Marketplace",
        "text": "In the Clinic Operations Center, healthcare providers see real-time FHIR SOAP notes synchronized automatically. Crucially, our telemetry demonstrates a ninety-nine point four percent message deliverability rate and reduces post-discharge triage costs from six dollars and fifty cents per call to under three cents per automated interaction—a ninety-nine point six percent savings. Packaged with AWS CDK, OmniCare CDS is ready for immediate deployment on AWS Marketplace. Thank you!",
        "pre_wait": 1.5,
        "post_wait": 2.0
    }
]

def get_duration(audio_path: str) -> float:
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", audio_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def synthesize_speech(text: str, out_raw: str, voice: str = "Samantha", rate: int = 175):
    """Synthesize speech using macOS say command."""
    subprocess.run(["say", "-v", voice, "-r", str(rate), "-o", out_raw, text], check=True)

def master_audio(in_file: str, out_file: str):
    """Apply broadcast compression and EBU R128 loudness normalization (-16 LUFS)."""
    filter_chain = (
        "highpass=f=80,lowpass=f=9000,"
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

def build_short_voiceover():
    print("🎙️ Generating Short Walkthrough Voiceover (33.8s video)...")
    # For short walkthrough, we create precisely positioned audio tracks on a 33.8s canvas
    filter_inputs = []
    amix_inputs = []
    
    for i, item in enumerate(SHORT_SCRIPT):
        raw_path = os.path.join(AUDIO_DIR, f"{item['id']}_raw.m4a")
        proc_path = os.path.join(AUDIO_DIR, f"{item['id']}_proc.m4a")
        synthesize_speech(item["text"], raw_path, voice="Samantha", rate=190)
        master_audio(raw_path, proc_path)
        dur = get_duration(proc_path)
        print(f"  [{i+1}/5] {item['id']} @ {item['start']}s -> {dur:.2f}s")
        filter_inputs.append(proc_path)
    
    # Merge using ffmpeg adelay
    # Target canvas is 34.0 seconds silence with audio clips placed at their start times
    delay_filters = []
    for i, item in enumerate(SHORT_SCRIPT):
        delay_ms = int(item["start"] * 1000)
        delay_filters.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}]")
    
    mix_inputs = "".join(f"[a{i}]" for i in range(len(SHORT_SCRIPT)))
    filter_complex = f"{';'.join(delay_filters)};{mix_inputs}amix=inputs={len(SHORT_SCRIPT)}:normalize=0,apad=whole_dur=34.0[outa]"
    
    cmd = ["/opt/homebrew/bin/ffmpeg", "-y"]
    for p in filter_inputs:
        cmd.extend(["-i", p])
    
    final_short_audio = os.path.join(AUDIO_DIR, "short_voiceover_master.m4a")
    cmd.extend([
        "-filter_complex", filter_complex,
        "-map", "[outa]",
        "-c:a", "aac", "-b:a", "192k",
        final_short_audio
    ])
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    dur = get_duration(final_short_audio)
    print(f"✅ Generated Short Master Audio: {final_short_audio} ({dur:.2f}s)")
    return final_short_audio

def build_master_voiceover():
    print("\n🎙️ Generating Master 2m20s Hackathon Presentation Voiceover...")
    segments = []
    concat_files = []
    
    for i, item in enumerate(MASTER_SCRIPT):
        raw_path = os.path.join(AUDIO_DIR, f"{item['id']}_raw.m4a")
        proc_path = os.path.join(AUDIO_DIR, f"{item['id']}_proc.m4a")
        synthesize_speech(item["text"], raw_path, voice="Samantha", rate=172)
        master_audio(raw_path, proc_path)
        speech_dur = get_duration(proc_path)
        
        # Calculate scene timings with pre/post wait
        scene_total_dur = item["pre_wait"] + speech_dur + item["post_wait"]
        
        # Create silent pre-delay and post-delay pads
        pre_pad = os.path.join(AUDIO_DIR, f"{item['id']}_pre.m4a")
        post_pad = os.path.join(AUDIO_DIR, f"{item['id']}_post.m4a")
        scene_audio = os.path.join(AUDIO_DIR, f"{item['id']}_full_scene.m4a")
        
        subprocess.run([
            "/opt/homebrew/bin/ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
            "-t", str(item["pre_wait"]), "-c:a", "aac", "-b:a", "192k", pre_pad
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        
        subprocess.run([
            "/opt/homebrew/bin/ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
            "-t", str(item["post_wait"]), "-c:a", "aac", "-b:a", "192k", post_pad
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        
        # Concat pre + proc + post
        concat_txt = os.path.join(AUDIO_DIR, f"{item['id']}_concat.txt")
        with open(concat_txt, "w") as f:
            f.write(f"file '{pre_pad}'\nfile '{proc_path}'\nfile '{post_pad}'\n")
            
        subprocess.run([
            "/opt/homebrew/bin/ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", concat_txt, "-c:a", "aac", "-b:a", "192k", scene_audio
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        
        measured_scene_dur = get_duration(scene_audio)
        print(f"  [{i+1}/6] {item['title']} -> Speech: {speech_dur:.2f}s | Full Scene: {measured_scene_dur:.2f}s")
        
        segments.append({
            "index": i,
            "id": item["id"],
            "title": item["title"],
            "speech_duration": speech_dur,
            "pre_wait": item["pre_wait"],
            "post_wait": item["post_wait"],
            "total_scene_duration": measured_scene_dur,
            "audio_file": scene_audio
        })
        concat_files.append(scene_audio)
        
    # Concat all scenes into a single master audio track
    master_concat_txt = os.path.join(AUDIO_DIR, "master_scenes_concat.txt")
    with open(master_concat_txt, "w") as f:
        for cf in concat_files:
            f.write(f"file '{cf}'\n")
            
    master_full_audio = os.path.join(AUDIO_DIR, "master_presentation_audio.m4a")
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", master_concat_txt, "-c:a", "aac", "-b:a", "192k", master_full_audio
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    total_dur = get_duration(master_full_audio)
    print(f"\n🎉 SUCCESS: Master Full Presentation Audio Generated: {master_full_audio} ({total_dur:.2f}s / {int(total_dur//60)}m {int(total_dur%60)}s)")
    
    # Save metadata for Playwright recorder
    metadata_path = os.path.join(AUDIO_DIR, "presentation_timing_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump({
            "total_duration": total_dur,
            "scenes": segments
        }, f, indent=2)
    print(f"📄 Saved Timing Metadata for Recorder: {metadata_path}")
    return master_full_audio, metadata_path

if __name__ == "__main__":
    short_audio = build_short_voiceover()
    master_audio_track, meta = build_master_voiceover()
