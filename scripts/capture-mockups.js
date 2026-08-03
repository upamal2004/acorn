/**
 * Automated mobile mockup screenshot script using Playwright.
 * Captures key app screens inside an iPhone 14/15 frame (390x844 viewport).
 *
 * Usage: node scripts/capture-mockups.js [baseURL]
 *   baseURL defaults to http://localhost:3100
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// Increase default timeout
const DEFAULT_TIMEOUT = 60000;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const BASE_URL = process.argv[2] || "http://localhost:3100";
const VIEWPORT = { width: 390, height: 844 };
const OUTPUT_DIR = path.resolve(__dirname, "..", "public", "screenshots");
const DPR = 2;

const FRAME_W = 390;
const FRAME_H = 844;
const PAD = 44;
const TOP_SAFE = 54; // dynamic island + status bar clearance
const CANVAS_W = FRAME_W + PAD * 2;
const CANVAS_H = FRAME_H + PAD * 2 + 60;

const TEST_EMAIL = `mockup-${Date.now()}@acorn.test`;
const TEST_PASSWORD = "Test1234!";
const TEST_NAME = "Mockup User";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function captureFramed(page, name) {
  const shot = await page.screenshot({
    type: "png",
    clip: { x: 0, y: TOP_SAFE, width: FRAME_W, height: FRAME_H - TOP_SAFE + 40 },
    path: path.join(OUTPUT_DIR, `_raw_${name}.png`),
  });
  console.log(`  ✓ ${name}.png`);
  return path.join(OUTPUT_DIR, `_raw_${name}.png`);
}

async function composeFrame(rawPngPath, outName) {
  const b64 = fs.readFileSync(rawPngPath).toString("base64");
  const clipH = FRAME_H - TOP_SAFE + 40;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}" height="${CANVAS_H}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">
  <defs>
    <clipPath id="scr"><rect x="${PAD}" y="${PAD + TOP_SAFE}" width="${FRAME_W}" height="${clipH}" rx="0"/></clipPath>
    <linearGradient id="bz" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#0f0f1a"/>
    </linearGradient>
    <filter id="sh" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect x="18" y="8" width="${CANVAS_W - 36}" height="${CANVAS_H - 16}" rx="50" ry="50" fill="url(#bz)" filter="url(#sh)"/>
  <rect x="10" y="180" width="4" height="36" rx="2" fill="#2a2a3e"/>
  <rect x="10" y="228" width="4" height="56" rx="2" fill="#2a2a3e"/>
  <rect x="10" y="296" width="4" height="56" rx="2" fill="#2a2a3e"/>
  <rect x="${CANVAS_W - 14}" y="230" width="4" height="72" rx="2" fill="#2a2a3e"/>
  <image href="data:image/png;base64,${b64}" x="${PAD}" y="${PAD + TOP_SAFE}" width="${FRAME_W}" height="${clipH}" clip-path="url(#scr)"/>
  <rect x="${CANVAS_W / 2 - 56}" y="${PAD + 8}" width="112" height="30" rx="15" ry="15" fill="#000"/>
  <rect x="${CANVAS_W / 2 - 46}" y="${PAD + FRAME_H - 14}" width="92" height="5" rx="2.5" fill="#fff" opacity="0.55"/>
</svg>`;

  const svgPath = path.join(OUTPUT_DIR, `_frame_${outName}.svg`);
  const pngPath = path.join(OUTPUT_DIR, `${outName}.png`);
  fs.writeFileSync(svgPath, svg, "utf8");

  // Use a fresh browser to render SVG → PNG at high res
  const b = await chromium.launch({ headless: true, args: ["--disable-extensions", "--disable-gpu"] });
  const ctx = await b.newContext({ viewport: { width: CANVAS_W * 2, height: CANVAS_H * 2 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  await pg.goto(`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`, { waitUntil: "domcontentloaded" });
  await pg.screenshot({ path: pngPath, type: "png" });
  await pg.close(); await ctx.close(); await b.close();

  // Cleanup temp files
  fs.unlinkSync(svgPath);
  fs.unlinkSync(rawPngPath);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(async () => {
  ensureDir(OUTPUT_DIR);
  console.log(`\n  Acorn Mockup Capture`);
  console.log(`  Target : ${BASE_URL}`);
  console.log(`  Output : ${OUTPUT_DIR}\n`);

  const freshProfile = path.join(require("os").tmpdir(), `playwright-mockup-${Date.now()}`);
  const ctx = await chromium.launchPersistentContext(freshProfile, {
    headless: true,
    channel: "chromium",
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    args: ["--disable-extensions", "--disable-gpu", "--no-sandbox", "--disable-component-extensions-with-background-pages"],
    ignoreDefaultArgs: ["--enable-automation"],
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(DEFAULT_TIMEOUT);
  page.on("pageerror", () => {});
  page.on("console", () => {});

  // ---- PUBLIC PAGES ----

  console.log("[1/12] Login");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await sleep(2000);
  let raw = await captureFramed(page, "01-login");
  await composeFrame(raw, "01-login");

  console.log("[2/12] Signup");
  await page.goto(`${BASE_URL}/signup`, { waitUntil: "domcontentloaded" });
  await sleep(2000);
  raw = await captureFramed(page, "02-signup");
  await composeFrame(raw, "02-signup");

  console.log("[3/12] About");
  await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
  await sleep(2000);
  raw = await captureFramed(page, "03-about");
  await composeFrame(raw, "03-about");

  // ---- SIGN UP / LOGIN TEST USER ----
  console.log("\n  Authenticating test user...");

  // Try signup first
  await page.goto(`${BASE_URL}/signup`, { waitUntil: "domcontentloaded" });
  await sleep(2000);

  const nameInput = page.locator('input[placeholder="Alex Acorn"]');
  if (await nameInput.count() > 0) await nameInput.fill(TEST_NAME);

  const emailInput = page.locator('input[type="email"]');
  if (await emailInput.count() > 0) await emailInput.fill(TEST_EMAIL);

  const pwInput = page.locator('input[type="password"]').first();
  if (await pwInput.count() > 0) await pwInput.fill(TEST_PASSWORD);

  // Submit signup and wait for navigation
  const submitBtn = page.locator('button[type="submit"]').first();
  if (await submitBtn.count() > 0) {
    await Promise.all([
      page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {}),
      submitBtn.click(),
    ]);
  }
  await sleep(3000);

  // If still on signup, the user might already exist - try login instead
  if (page.url().includes("signup")) {
    console.log("  Signup may have failed, trying login...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await sleep(2000);

    const loginEmail = page.locator('input[type="email"]');
    if (await loginEmail.count() > 0) await loginEmail.fill(TEST_EMAIL);

    const loginPw = page.locator('input[type="password"]').first();
    if (await loginPw.count() > 0) await loginPw.fill(TEST_PASSWORD);

    const loginBtn = page.locator('button[type="submit"]').first();
    if (await loginBtn.count() > 0) {
      await Promise.all([
        page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {}),
        loginBtn.click(),
      ]);
    }
    await sleep(3000);
  }

  console.log(`  Authenticated → ${page.url()}`);

  // ---- AUTHENTICATED PAGES ----

  console.log("[4/12] Dashboard");
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
  await sleep(2500);
  raw = await captureFramed(page, "04-dashboard");
  await composeFrame(raw, "04-dashboard");

  console.log("[5/12] Wallet area (scroll down)");
  await page.evaluate(() => window.scrollBy(0, 400));
  await sleep(1000);
  raw = await captureFramed(page, "05-wallet");
  await composeFrame(raw, "05-wallet");
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);

  // ---- ADD EXPENSE MODAL ----
  console.log("[6/12] Add Expense Modal");
  const addBtn = page.locator('button:has-text("Add expense")').first();
  if (await addBtn.count() > 0) {
    await addBtn.click();
    await sleep(1500);
    raw = await captureFramed(page, "06-add-expense");
    await composeFrame(raw, "06-add-expense");
    // Close by clicking the ✕ button inside the modal
    const closeX = page.locator('button:has-text("✕")').first();
    if (await closeX.count() > 0) {
      await closeX.click({ force: true });
    } else {
      // Fallback: click the backdrop area
      await page.mouse.click(10, 10);
    }
    await sleep(1000);
  } else {
    console.log("  (button not found, skipping)");
  }

  // ---- CALCULATOR MODAL ----
  console.log("[7/12] Calculator Modal");
  // Make sure no modal is blocking - force remove any leftover overlays
  await page.evaluate(() => {
    document.querySelectorAll('.fixed.inset-0.z-50').forEach(el => el.remove());
  });
  await sleep(500);
  // The calculator button is the one with CalcIcon (title="Quick Calculator")
  const calcBtn = page.locator('button[title="Quick Calculator"]').first();
  if (await calcBtn.count() > 0) {
    await calcBtn.click({ force: true });
    await sleep(1200);
    raw = await captureFramed(page, "07-calculator");
    await composeFrame(raw, "07-calculator");
    await page.keyboard.press("Escape");
    await sleep(800);
  } else {
    console.log("  (button not found, skipping)");
  }

  // ---- HISTORY ----
  console.log("[8/12] History");
  await page.goto(`${BASE_URL}/history`, { waitUntil: "domcontentloaded" });
  await sleep(2500);
  raw = await captureFramed(page, "08-history");
  await composeFrame(raw, "08-history");

  // ---- INSIGHTS ----
  console.log("[9/12] Insights");
  await page.goto(`${BASE_URL}/insights`, { waitUntil: "domcontentloaded" });
  await sleep(2500);
  raw = await captureFramed(page, "09-insights");
  await composeFrame(raw, "09-insights");

  // ---- SETTINGS ----
  console.log("[10/12] Settings");
  await page.goto(`${BASE_URL}/settings`, { waitUntil: "domcontentloaded" });
  await sleep(2500);
  raw = await captureFramed(page, "10-settings");
  await composeFrame(raw, "10-settings");

  // ---- FORGOT PASSWORD ----
  console.log("[11/12] Forgot Password");
  await page.goto(`${BASE_URL}/forgot-password`, { waitUntil: "domcontentloaded" });
  await sleep(2000);
  raw = await captureFramed(page, "11-forgot-password");
  await composeFrame(raw, "11-forgot-password");

  // ---- DASHBOARD with wallet "Add Money" modal ----
  console.log("[12/12] Wallet Add Money Modal");
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
  await sleep(2500);
  // Scroll to wallet and click "Add Money"
  await page.evaluate(() => window.scrollBy(0, 350));
  await sleep(800);
  const addMoneyBtn = page.locator('button:has-text("Add Money")').first();
  if (await addMoneyBtn.count() > 0) {
    await addMoneyBtn.click();
    await sleep(1200);
    raw = await captureFramed(page, "12-wallet-add");
    await composeFrame(raw, "12-wallet-add");
  } else {
    console.log("  (Add Money button not found, capturing scrolled wallet)");
    raw = await captureFramed(page, "12-wallet-add");
    await composeFrame(raw, "12-wallet-add");
  }

  await ctx.close();

  const pngs = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".png") && !f.startsWith("_"));
  console.log(`\n  Done! ${pngs.length} screenshots saved.\n`);
})().catch((err) => {
  console.error(" Capture failed:", err);
  process.exit(1);
});
