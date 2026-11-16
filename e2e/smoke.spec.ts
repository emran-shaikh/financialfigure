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

  test("quick calculator performs arithmetic on calculation pages", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/mortgage-calculator");

    const calculator = page.getByRole("complementary", { name: "Quick calculator" });
    await expect(calculator).toBeVisible();
    await calculator.getByRole("button", { name: "2", exact: true }).click();
    await calculator.getByRole("button", { name: "Add" }).click();
    await calculator.getByRole("button", { name: "3", exact: true }).click();
    await calculator.getByRole("button", { name: "Equals" }).click();
    await expect(calculator.locator("output")).toHaveText("5");

    await calculator.getByRole("button", { name: "Clear" }).click();
    await calculator.getByRole("button", { name: "8", exact: true }).click();
    await calculator.getByRole("button", { name: "Divide" }).click();
    await calculator.getByRole("button", { name: "0", exact: true }).click();
    await calculator.getByRole("button", { name: "Equals" }).click();
    await expect(calculator.locator("output")).toHaveText("Cannot divide by zero");
  });

  test("breadcrumb structured data uses absolute URLs", async ({ page }) => {
    await page.goto("/mortgage-calculator");

    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const breadcrumb = scripts
      .map((script) => JSON.parse(script) as { "@type"?: string; itemListElement?: { item: string }[] })
      .find((schema) => schema["@type"] === "BreadcrumbList");

    expect(breadcrumb?.itemListElement?.length).toBeGreaterThan(0);
    expect(
      breadcrumb?.itemListElement?.every((item) =>
        item.item.startsWith("https://financialfigure.com/") ||
        item.item === "https://financialfigure.com",
      ),
    ).toBe(true);
  });

  test("header and footer align with the calculator page container", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/mortgage-calculator");

    const header = await page.locator("header > div").boundingBox();
    const main = await page.locator("main").boundingBox();
    const footer = await page.locator("footer > div.grid").boundingBox();

    if (!header || !main || !footer) throw new Error("A site container was not rendered");
    expect(Math.abs(header.x - main.x)).toBeLessThan(1);
    expect(Math.abs(header.x - footer.x)).toBeLessThan(1);
    expect(Math.abs(header.width - main.width)).toBeLessThan(1);
    expect(Math.abs(header.width - footer.width)).toBeLessThan(1);
  });

  test("a state paycheck page renders its own state-specific heading", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/salary-after-tax/california");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/California/i);
    await expect(page).toHaveTitle("California Paycheck Calculator | Financial Figure");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://financialfigure.com/salary-after-tax/california",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "California Paycheck Calculator | Financial Figure",
    );
    await expect(page.getByLabel("Open quick calculator")).toBeVisible();
    await page.getByLabel("Open quick calculator").click();
    await expect(page.getByRole("complementary", { name: "Quick calculator" })).toBeVisible();
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
