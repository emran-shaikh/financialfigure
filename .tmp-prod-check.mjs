import { chromium } from "@playwright/test";

const BASE = "http://localhost:3001";
const pages = ["/", "/calculators", "/mortgage-calculator", "/salary-after-tax/california", "/contact", "/privacy-policy"];
const viewports = [
  { name: "360x740 (phone)", width: 360, height: 740 },
  { name: "768x1024 (tablet)", width: 768, height: 1024 },
  { name: "1280x900 (laptop)", width: 1280, height: 900 },
  { name: "1920x1080 (desktop)", width: 1920, height: 1080 },
];

const browser = await chromium.launch();
const problems = [];

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  page.on("console", (m) => {
    if ((m.type() === "error" || m.type() === "warning") && !/\[HMR\]|React DevTools/.test(m.text()))
      problems.push(`[${vp.name}] console.${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`[${vp.name}] pageerror: ${e.message}`));

  for (const path of pages) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const { scrollW, innerW, h1 } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      h1: document.querySelectorAll("h1").length,
    }));
    if (scrollW > innerW + 1)
      problems.push(`[${vp.name}] ${path}: horizontal overflow (scrollWidth ${scrollW} > innerWidth ${innerW})`);
    if (h1 !== 1) problems.push(`[${vp.name}] ${path}: expected exactly one <h1>, found ${h1}`);
  }
  await page.close();
}

// Ad unit + no-CLS spot check at desktop width
const adPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await adPage.goto(BASE + "/mortgage-calculator", { waitUntil: "networkidle" });
const adUnits = await adPage.locator("ins.adsbygoogle").count();
const libLoaded = await adPage.evaluate(() =>
  [...document.scripts].some((s) => s.src.includes("adsbygoogle.js")),
);
console.log(`ad units on /mortgage-calculator: ${adUnits}`);
console.log(`adsbygoogle library tag present: ${libLoaded}`);

console.log(problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : "\nNO PROBLEMS: all viewports clean, no overflow, one H1 per page");
await browser.close();
