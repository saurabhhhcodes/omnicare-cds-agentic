const { chromium } = require('playwright');

async function testFlow() {
  console.log('🧪 Verifying Live Interactive Healthcare Flow...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. WhatsApp Tab
  console.log('1. Checking WhatsApp tab...');
  const waBtn = page.locator('button:has-text("WhatsApp (Meta Social)")');
  await waBtn.click();
  await page.waitForTimeout(1000);

  // 2. Upload photo
  console.log('2. Uploading photo...');
  const uploadBtn = page.locator('button:has-text("📸 Upload Ankle Edema Photo")');
  await uploadBtn.waitFor({ state: 'visible', timeout: 5000 });
  await uploadBtn.click();

  // Wait for diagnosis
  console.log('3. Waiting for AI diagnosis bubble...');
  const diagText = page.locator('text=+2 Bilateral Pitting Edema').first();
  await diagText.waitFor({ state: 'visible', timeout: 10000 });
  console.log('   ✅ AI Diagnosis bubble appeared successfully!');

  // 4. Click Find Pharmacies
  console.log('4. Clicking Find Pharmacies in WhatsApp...');
  const findPharm = page.locator('button:has-text("Find Pharmacies")').first();
  await findPharm.waitFor({ state: 'visible', timeout: 5000 });
  await findPharm.click();
  await page.waitForTimeout(1500);

  // 5. Switch to RCS Tab
  console.log('5. Switching to RCS Tab...');
  const rcsBtn = page.locator('button:has-text("RCS & SMS (EUM)")');
  await rcsBtn.click();
  await page.waitForTimeout(1500);

  // Verify CVS card
  const cvsCard = page.locator('text=CVS Health').first();
  await cvsCard.waitFor({ state: 'visible', timeout: 10000 });
  console.log('   ✅ CVS Health card appeared in RCS carousel!');

  // 6. 1-Tap Select
  console.log('6. Clicking 1-Tap Select...');
  const selectBtn = page.locator('button:has-text("1-Tap Select")').first();
  await selectBtn.click();
  await page.waitForTimeout(2000);

  // 7. Verify SES Email Pass
  console.log('7. Verifying SES Email Pass...');
  const emailBtn = page.locator('button:has-text("Amazon SES Inbox")');
  await emailBtn.click();
  await page.waitForTimeout(1500);

  const dkimBadge = page.locator('text=DKIM: Valid').first();
  await dkimBadge.waitFor({ state: 'visible', timeout: 10000 });
  const emailHeader = page.locator('text=Amazon SES Verified Dispatch').first();
  await emailHeader.waitFor({ state: 'visible', timeout: 5000 });
  console.log('   ✅ Amazon SES Verified email & QR pass appeared!');

  // 8. Verify Bedrock Traces
  console.log('8. Verifying Bedrock AgentCore Traces...');
  const traces = page.locator('text=VisionTriageAgent').first();
  await traces.waitFor({ state: 'visible', timeout: 5000 });
  console.log('   ✅ Bedrock AgentCore trace log verified!');

  await browser.close();
  console.log('\n🎉 ALL INTERACTIVE CLINICAL STEPS VERIFIED 100% WORKING!');
}

testFlow().catch(err => {
  console.error('❌ Flow verification failed:', err);
  process.exit(1);
});
