const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function recordProductDemo() {
  const outputDir = path.join(__dirname, 'recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 Initializing Automated Product Video Recorder...');
  console.log('Target: OmniCare CDS Clinical Platform on http://127.0.0.1:8000');

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

  console.log('⏳ Navigating to platform...');
  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Showcase Header & Initial Scenario
  console.log('📌 Scene 1: Header, Omnichannel Badges & Scenario A Initiation');
  await page.waitForTimeout(2500);

  // 2. Interact with WhatsApp Interface
  console.log('📌 Scene 2: WhatsApp Interface & Diagnostic Image Upload (Meta $10k Track)');
  const waTabBtn = page.locator('button:has-text("WhatsApp (Meta Social)")');
  await waTabBtn.click();
  await page.waitForTimeout(1500);

  // Upload sample edema photo
  const uploadEdemaBtn = page.locator('button:has-text("📸 Upload Ankle Edema Photo")');
  if (await uploadEdemaBtn.isVisible()) {
    await uploadEdemaBtn.click();
    console.log('📸 Uploaded Ankle Edema Photo to WhatsApp...');
    await page.waitForTimeout(4500);
  }

  // Click quick reply in WhatsApp: "Find Pharmacies"
  const findPharmBtn = page.locator('button:has-text("Find Pharmacies")').first();
  if (await findPharmBtn.isVisible()) {
    await findPharmBtn.click();
    console.log('📍 Clicked "Find Pharmacies" in WhatsApp...');
    await page.waitForTimeout(3000);
  }

  // 3. Switch to RCS & SMS (EUM)
  console.log('📌 Scene 3: AWS EUM RCS Carousel & 1-Tap Pharmacy Booking');
  const rcsTabBtn = page.locator('button:has-text("RCS & SMS (EUM)")');
  await rcsTabBtn.click();
  await page.waitForTimeout(2500);

  // Click 1-Tap Select on first pharmacy
  const selectPharmBtn = page.locator('button:has-text("1-Tap Select")').first();
  if (await selectPharmBtn.isVisible()) {
    await selectPharmBtn.click();
    console.log('✅ Clicked "1-Tap Select" on RCS Pharmacy Card...');
    await page.waitForTimeout(3500);
  }

  // 4. Switch to Amazon SES Email Pass
  console.log('📌 Scene 4: Amazon SES Verified Prescription Pass & Contactless QR');
  const emailTabBtn = page.locator('button:has-text("Amazon SES Inbox")');
  await emailTabBtn.click();
  await page.waitForTimeout(4500);

  // 5. Inspect Bedrock AgentCore Trace
  console.log('📌 Scene 5: Inspecting Bedrock AgentCore Multi-Agent Reasoning Trace');
  const inspectBtn = page.locator('button:has-text("Inspect I/O")').first();
  if (await inspectBtn.isVisible()) {
    await inspectBtn.click();
    await page.waitForTimeout(2000);
  }

  // Scroll down to view Clinic Ops & Analytics
  console.log('📌 Scene 6: Clinic Operations Center & 99.6% Cost Reduction Analytics');
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(3500);

  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(3500);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  console.log('💾 Finalizing video recording...');
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const rawVideo = path.join(outputDir, files[0]);
    const finalMp4 = path.join(__dirname, '..', 'omnicare_product_walkthrough_hd.mp4');
    console.log(`🎬 Transcoding ${rawVideo} to high-definition MP4: ${finalMp4}...`);
    try {
      execSync(`/opt/homebrew/bin/ffmpeg -y -i "${rawVideo}" -c:v libx264 -pix_fmt yuv420p -r 30 "${finalMp4}"`, { stdio: 'inherit' });
      console.log(`✅ SUCCESS: Video recorded and saved to: ${finalMp4}`);
    } catch (err) {
      console.error('Error transcoding with ffmpeg, raw video available at:', rawVideo);
    }
  } else {
    console.log('No video file produced.');
  }
}

recordProductDemo().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
