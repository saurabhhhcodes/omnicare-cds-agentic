const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function recordYouTubeMaster() {
  const timingPath = path.join(__dirname, '..', 'audio_assets', 'human_neural', 'human_neural_timing_metadata.json');
  if (!fs.existsSync(timingPath)) {
    throw new Error('Timing metadata file not found at: ' + timingPath);
  }
  const timingData = JSON.parse(fs.readFileSync(timingPath, 'utf8'));

  const outputDir = path.join(__dirname, 'youtube_recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 Starting YouTube Master Video Recording with Human Neural Voiceover...');
  console.log(`⏱️ Total Expected Presentation Duration: ${timingData.total_duration.toFixed(1)} seconds (${(timingData.total_duration/60).toFixed(1)} mins)`);

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();

  // -------------------------------------------------------------
  // SCENE 0: Creator Intro & Architecture Launch (Target: ~51.0s)
  // -------------------------------------------------------------
  const s0 = timingData.scenes[0];
  console.log(`\n📌 [Scene 0] ${s0.title} (${s0.total_scene_duration.toFixed(1)}s)...`);
  const s0Start = Date.now();

  await page.goto('http://127.0.0.1:8000/intro.html', { waitUntil: 'networkidle' });
  await sleep(3000);

  // Hover over architecture cards
  try {
    await page.locator('text=AWS EUM SMS').hover();
    await sleep(4000);
    await page.locator('text=Meta WhatsApp').hover();
    await sleep(4000);
    await page.locator('text=EUM RCS (UP 2.4)').hover();
    await sleep(4000);
    await page.locator('text=Amazon SES').hover();
    await sleep(4000);
  } catch (e) {}

  // Hover over terminal build
  try {
    await page.locator('text=11 passed in 0.27s').hover();
    await sleep(6000);
  } catch (e) {}

  const s0Elapsed = (Date.now() - s0Start) / 1000;
  const s0Remaining = Math.max(0, s0.total_scene_duration - s0Elapsed);
  console.log(`   Waiting remaining ${s0Remaining.toFixed(1)}s for Scene 0 sync...`);
  await sleep(s0Remaining * 1000);

  // -------------------------------------------------------------
  // SCENE 1: Proactive SMS to WhatsApp & Vision Triage (Target: ~52.3s)
  // -------------------------------------------------------------
  const s1 = timingData.scenes[1];
  console.log(`\n📌 [Scene 1] ${s1.title} (${s1.total_scene_duration.toFixed(1)}s)...`);
  const s1Start = Date.now();

  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
  await sleep(2500);

  // Reset to fresh Scenario A
  const resetBtn = page.locator('button[title="Reset Scenario State"]');
  if (await resetBtn.isVisible()) {
    await resetBtn.click();
    await sleep(1500);
  }

  // Switch to WhatsApp Tab
  const waTabBtn = page.locator('button:has-text("WhatsApp")').first();
  await waTabBtn.click();
  await sleep(2500);

  // Click Upload Ankle Edema Photo
  const uploadEdemaBtn = page.locator('button:has-text("📸 Upload Ankle Edema Photo")');
  await uploadEdemaBtn.waitFor({ state: 'visible', timeout: 5000 });
  await uploadEdemaBtn.click();
  console.log('   📸 Uploaded Ankle Edema Photo to WhatsApp...');

  // Wait for diagnosis bubble to appear
  const diagBubble = page.locator('text=+2 Bilateral Pitting Edema').first();
  await diagBubble.waitFor({ state: 'visible', timeout: 12000 });
  console.log('   ✅ AI Diagnosis bubble appeared!');
  await sleep(4000);

  // Hover over diagnosis bubble
  try {
    await diagBubble.hover();
    await sleep(4000);
  } catch (e) {}

  // Hover over "Find Pharmacies" action chip
  const findPharmBtn = page.locator('button:has-text("Find Pharmacies")').first();
  if (await findPharmBtn.isVisible()) {
    await findPharmBtn.hover();
    await sleep(4000);
  }

  const s1Elapsed = (Date.now() - s1Start) / 1000;
  const s1Remaining = Math.max(0, s1.total_scene_duration - s1Elapsed);
  console.log(`   Waiting remaining ${s1Remaining.toFixed(1)}s for Scene 1 sync...`);
  await sleep(s1Remaining * 1000);

  // -------------------------------------------------------------
  // SCENE 2: GSMA UP 2.4 RCS Interactive Pharmacy Carousel (Target: ~43.2s)
  // -------------------------------------------------------------
  const s2 = timingData.scenes[2];
  console.log(`\n📌 [Scene 2] ${s2.title} (${s2.total_scene_duration.toFixed(1)}s)...`);
  const s2Start = Date.now();

  // Click "Find Pharmacies" in WhatsApp
  if (await findPharmBtn.isVisible()) {
    await findPharmBtn.click();
    console.log('   📍 Clicked "Find Pharmacies" in WhatsApp...');
    await sleep(2000);
  }

  // Switch to RCS Tab
  const rcsTabBtn = page.locator('button:has-text("RCS & SMS")').first();
  await rcsTabBtn.click();
  await sleep(2500);

  // Wait for CVS Health card in carousel
  const cvsCard = page.locator('text=CVS Health').first();
  await cvsCard.waitFor({ state: 'visible', timeout: 10000 });
  console.log('   ✅ CVS Health card visible in RCS carousel!');
  await sleep(3000);

  // Hover over pharmacy cards
  try {
    await cvsCard.hover();
    await sleep(3500);
    const walgreensCard = page.locator('text=Walgreens').first();
    if (await walgreensCard.isVisible()) {
      await walgreensCard.hover();
      await sleep(3500);
    }
  } catch (e) {}

  // 1-Tap Select CVS Health Pharmacy
  const selectPharmBtn = page.locator('button:has-text("1-Tap Select")').first();
  await selectPharmBtn.click();
  console.log('   ✅ Clicked "1-Tap Select" on CVS Pharmacy card...');
  await sleep(4000);

  const s2Elapsed = (Date.now() - s2Start) / 1000;
  const s2Remaining = Math.max(0, s2.total_scene_duration - s2Elapsed);
  console.log(`   Waiting remaining ${s2Remaining.toFixed(1)}s for Scene 2 sync...`);
  await sleep(s2Remaining * 1000);

  // -------------------------------------------------------------
  // SCENE 3: Amazon SES Verified Prescription Pass & QR (Target: ~33.9s)
  // -------------------------------------------------------------
  const s3 = timingData.scenes[3];
  console.log(`\n📌 [Scene 3] ${s3.title} (${s3.total_scene_duration.toFixed(1)}s)...`);
  const s3Start = Date.now();

  const emailTabBtn = page.locator('button:has-text("Amazon SES Inbox")').first();
  await emailTabBtn.click();
  await sleep(2500);

  // Wait for verified email header
  const emailHeader = page.locator('text=Amazon SES Verified Dispatch').first();
  await emailHeader.waitFor({ state: 'visible', timeout: 10000 });
  console.log('   ✅ Verified Amazon SES email rendered with QR pass!');

  // Hover over DKIM verification pill
  try {
    const dkim = page.locator('text=DKIM: Valid').first();
    if (await dkim.isVisible()) {
      await dkim.hover();
      await sleep(3500);
    }
  } catch (e) {}

  // Hover over Rx details and QR code
  try {
    await emailHeader.hover();
    await sleep(4000);
  } catch (e) {}

  const s3Elapsed = (Date.now() - s3Start) / 1000;
  const s3Remaining = Math.max(0, s3.total_scene_duration - s3Elapsed);
  console.log(`   Waiting remaining ${s3Remaining.toFixed(1)}s for Scene 3 sync...`);
  await sleep(s3Remaining * 1000);

  // -------------------------------------------------------------
  // SCENE 4: Bedrock AgentCore State Machine & Multi-Agent Trace (Target: ~30.4s)
  // -------------------------------------------------------------
  const s4 = timingData.scenes[4];
  console.log(`\n📌 [Scene 4] ${s4.title} (${s4.total_scene_duration.toFixed(1)}s)...`);
  const s4Start = Date.now();

  // Inspect Bedrock AgentCore trace panel
  const inspectBtn = page.locator('button:has-text("Inspect I/O")').first();
  if (await inspectBtn.isVisible()) {
    await inspectBtn.click();
    console.log('   🔍 Expanded Bedrock AgentCore I/O payload...');
    await sleep(6000);

    // Toggle back
    await inspectBtn.click();
    await sleep(2000);
  }

  // Hover over agent nodes
  try {
    const agentNode = page.locator('text=VisionTriageAgent').first();
    if (await agentNode.isVisible()) {
      await agentNode.hover();
      await sleep(4000);
    }
  } catch (e) {}

  const s4Elapsed = (Date.now() - s4Start) / 1000;
  const s4Remaining = Math.max(0, s4.total_scene_duration - s4Elapsed);
  console.log(`   Waiting remaining ${s4Remaining.toFixed(1)}s for Scene 4 sync...`);
  await sleep(s4Remaining * 1000);

  // -------------------------------------------------------------
  // SCENE 5: Clinic Operations Center & Analytics (Target: ~29.2s)
  // -------------------------------------------------------------
  const s5 = timingData.scenes[5];
  console.log(`\n📌 [Scene 5] ${s5.title} (${s5.total_scene_duration.toFixed(1)}s)...`);
  const s5Start = Date.now();

  console.log('   📜 Scrolling to Clinic Operations Center...');
  await page.evaluate(() => window.scrollBy({ top: 550, behavior: 'smooth' }));
  await sleep(7000);

  console.log('   📊 Scrolling to Analytics & Deliverability Dashboard...');
  await page.evaluate(() => window.scrollBy({ top: 550, behavior: 'smooth' }));
  await sleep(8000);

  try {
    const savings = page.locator('text=99.6%').first();
    if (await savings.isVisible()) {
      await savings.hover();
      await sleep(4000);
    }
  } catch (e) {}

  console.log('   🔝 Scrolling back to top...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(3000);

  const s5Elapsed = (Date.now() - s5Start) / 1000;
  const s5Remaining = Math.max(0, s5.total_scene_duration - s5Elapsed);
  console.log(`   Waiting remaining ${s5Remaining.toFixed(1)}s for Scene 5 sync...`);
  await sleep(s5Remaining * 1000);

  // -------------------------------------------------------------
  // SCENE 6: Creator Outro & Summary (Target: ~35.0s)
  // -------------------------------------------------------------
  const s6 = timingData.scenes[6];
  console.log(`\n📌 [Scene 6] ${s6.title} (${s6.total_scene_duration.toFixed(1)}s)...`);
  const s6Start = Date.now();

  await page.goto('http://127.0.0.1:8000/outro.html', { waitUntil: 'networkidle' });
  await sleep(3000);

  try {
    await page.locator('text=99.6%').hover();
    await sleep(4000);
    await page.locator('text=11 / 11').hover();
    await sleep(4000);
    await page.locator('text=github.com/saurabhhhcodes').hover();
    await sleep(5000);
  } catch (e) {}

  const s6Elapsed = (Date.now() - s6Start) / 1000;
  const s6Remaining = Math.max(0, s6.total_scene_duration - s6Elapsed);
  console.log(`   Waiting remaining ${s6Remaining.toFixed(1)}s for Scene 6 sync...`);
  await sleep(s6Remaining * 1000);

  console.log('\n💾 Finalizing browser recording...');
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    throw new Error('No webm video recorded!');
  }

  const latestWebm = files
    .map(f => ({ name: f, time: fs.statSync(path.join(outputDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time)[0].name;

  const rawVideo = path.join(outputDir, latestWebm);
  const masterAudio = path.join(__dirname, '..', 'audio_assets', 'human_neural', 'master_neural_soundtrack.m4a');
  const finalYouTubeMp4 = path.join(__dirname, '..', 'omnicare_youtube_master_hd.mp4');

  console.log(`\n🎬 Muxing HD Video with Neural Voiceover into:\n   ${finalYouTubeMp4}...`);

  const ffmpegCmd = `/opt/homebrew/bin/ffmpeg -y \
    -i "${rawVideo}" \
    -i "${masterAudio}" \
    -c:v libx264 -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 192k \
    -map 0:v:0 \
    -map 1:a:0 \
    -shortest \
    "${finalYouTubeMp4}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    const stat = fs.statSync(finalYouTubeMp4);
    console.log(`\n🎉 SUCCESS! YouTube Master HD Video Created: ${finalYouTubeMp4} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
  } catch (err) {
    console.error('Error during ffmpeg muxing:', err);
    process.exit(1);
  }
}

recordYouTubeMaster().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
