import { afterEach, describe, expect, it, vi } from "vitest";

describe("SITE canonical origin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses www when the configured apex host redirects there", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://financialfigure.com/");

    const { SITE } = await import("./site");

    expect(SITE.url).toBe("https://www.financialfigure.com");
  });
});
