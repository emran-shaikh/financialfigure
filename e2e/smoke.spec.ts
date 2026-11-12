import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home page loads with a single H1 and primary navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  });

  test("mortgage calculator recalculates when an input changes", async ({ page }) => {
    await page.goto("/mortgage-calculator");

    const headline = page.locator('aside[aria-live="polite"] p.text-3xl');
    await expect(headline).toBeVisible();
    const before = (await headline.textContent()) ?? "";

    await page.getByLabel(/home price/i).fill("800000");

    // The headline must change and remain a valid dollar amount (never NaN).
    await expect(headline).not.toHaveText(before);
    await expect(headline).toContainText("$");
  });

  test("a state paycheck page renders its own state-specific heading", async ({ page }) => {
    await page.goto("/salary-after-tax/california");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/California/i);
  });

  test("robots.txt points to the sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    expect(await res.text()).toContain("Sitemap:");
  });

  test("sitemap.xml lists calculator and state URLs", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain("/mortgage-calculator");
    expect(xml).toContain("/salary-after-tax/california");
  });
});
