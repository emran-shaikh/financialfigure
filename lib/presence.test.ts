import { afterEach, describe, expect, it, vi } from "vitest";
import {
  countCommand,
  heartbeatCommands,
  isHuman,
  isVisitorId,
  onlineLabel,
  PRESENCE_KEY,
  PRESENCE_WINDOW_SECONDS,
  redisConfig,
} from "./presence";

const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 Version/18.1 Mobile/15E148 Safari/604.1";

describe("isHuman", () => {
  it("counts real browser user agents", () => {
    expect(isHuman(CHROME)).toBe(true);
    expect(isHuman(IPHONE)).toBe(true);
  });

  it("excludes crawlers, uptime probes and scripted clients", () => {
    expect(isHuman("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe(false);
    expect(isHuman("Mozilla/5.0 (compatible; bingbot/2.0)")).toBe(false);
    expect(isHuman("Mozilla/5.0 (compatible; YandexBot/3.0)")).toBe(false);
    expect(isHuman("curl/8.4.0")).toBe(false);
    expect(isHuman("Wget/1.21.4")).toBe(false);
    expect(isHuman("Pingdom.com_bot_version_1.4")).toBe(false);
  });

  it("treats a missing user agent as non-human", () => {
    expect(isHuman(null)).toBe(false);
    expect(isHuman("")).toBe(false);
  });
});

describe("isVisitorId", () => {
  it("accepts a uuid and the generated fallback id", () => {
    expect(isVisitorId("9f1c4d2e-8a7b-4c3d-9e0f-1a2b3c4d5e6f")).toBe(true);
    expect(isVisitorId("mb2k1x9z-4f7a2b9c1d")).toBe(true);
  });

  it("rejects anything that is not a plausible anonymous id", () => {
    expect(isVisitorId("")).toBe(false);
    expect(isVisitorId("short")).toBe(false);
    expect(isVisitorId("a".repeat(65))).toBe(false);
    expect(isVisitorId("has spaces")).toBe(false);
    expect(isVisitorId(42)).toBe(false);
    expect(isVisitorId(undefined)).toBe(false);
  });
});

describe("heartbeatCommands", () => {
  it("stamps the visitor, prunes stale entries and reads the count in one trip", () => {
    expect(heartbeatCommands("visitor-1", 1_000)).toEqual([
      ["ZADD", PRESENCE_KEY, "1000", "visitor-1"],
      ["ZREMRANGEBYSCORE", PRESENCE_KEY, "-inf", String(1_000 - PRESENCE_WINDOW_SECONDS)],
      ["ZCARD", PRESENCE_KEY],
    ]);
  });

  it("keeps the window comfortably above the client heartbeat so nobody flickers out", () => {
    expect(PRESENCE_WINDOW_SECONDS).toBeGreaterThan(25);
  });
});

describe("countCommand", () => {
  it("reads the count without registering the caller", () => {
    expect(countCommand()).toEqual([["ZCARD", PRESENCE_KEY]]);
  });
});

describe("onlineLabel", () => {
  it("uses the singular for one visitor", () => {
    expect(onlineLabel(1)).toBe("1 person online now");
  });

  it("uses the plural for zero, two and many", () => {
    expect(onlineLabel(0)).toBe("0 people online now");
    expect(onlineLabel(2)).toBe("2 people online now");
    expect(onlineLabel(148)).toBe("148 people online now");
  });
});

describe("redisConfig", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is null when no store is provisioned, so the badge stays hidden", () => {
    vi.stubEnv("KV_REST_API_URL", "");
    vi.stubEnv("KV_REST_API_TOKEN", "");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect(redisConfig()).toBeNull();
  });

  it("accepts the Vercel KV names and strips a trailing slash", () => {
    vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io/");
    vi.stubEnv("KV_REST_API_TOKEN", "token-123");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect(redisConfig()).toEqual({ url: "https://example.upstash.io", token: "token-123" });
  });

  it("accepts the Upstash-native names", () => {
    vi.stubEnv("KV_REST_API_URL", "");
    vi.stubEnv("KV_REST_API_TOKEN", "");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://native.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-456");
    expect(redisConfig()).toEqual({ url: "https://native.upstash.io", token: "token-456" });
  });
});
