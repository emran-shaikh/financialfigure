/**
 * Live "people online" presence.
 *
 * A statically generated site cannot know who else is browsing, so every open,
 * visible tab reports in to a shared Redis store on a timer. Each report
 * refreshes that visitor's entry with a rolling expiry, so the head count only
 * ever contains people who were on the site moments ago.
 *
 * The store is Upstash Redis reached over its REST API — Vercel provisions it
 * through the Marketplace integration. With no credentials the counter stays
 * disabled and the rest of the site is untouched.
 */

/**
 * A visitor counts as online while their last heartbeat is younger than this.
 * Kept comfortably above HEARTBEAT_INTERVAL_MS so one dropped request does not
 * make a real visitor flicker out of the count.
 */
export const PRESENCE_WINDOW_SECONDS = 70;

/** Sorted set of `visitorId -> last heartbeat`, scored by unix seconds. */
export const PRESENCE_KEY = "presence:online";

/** How often a visible tab reports in. */
export const HEARTBEAT_INTERVAL_MS = 25_000;

/** Longest visitor id we accept, matching the client's uuid. */
const VISITOR_ID = /^[a-z0-9-]{8,64}$/i;

/**
 * Crawlers, monitors and scripted clients are not people, so they are shown the
 * real count but never add to it.
 */
const NON_HUMAN_UA =
  /bot|crawl|spider|slurp|headless|phantomjs|bingpreview|facebookexternalhit|pingdom|uptime|monitoring|python-requests|curl\/|wget\/|ahrefs|semrush|dotbot/i;

/**
 * True when the user agent is a crawler, uptime probe or scripted client.
 * A missing user agent is treated as non-human: every real browser sends one.
 */
export function isHuman(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return !NON_HUMAN_UA.test(userAgent);
}

/** True when the client supplied a usable anonymous visitor id. */
export function isVisitorId(value: unknown): value is string {
  return typeof value === "string" && VISITOR_ID.test(value);
}

/** Redis REST credentials, or null when the store has not been provisioned. */
export function redisConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

/**
 * Redis commands that record a heartbeat, drop everyone who has gone quiet and
 * return the resulting head count — in one round trip.
 */
export function heartbeatCommands(visitorId: string, nowSeconds: number): string[][] {
  return [
    ["ZADD", PRESENCE_KEY, String(nowSeconds), visitorId],
    ["ZREMRANGEBYSCORE", PRESENCE_KEY, "-inf", String(nowSeconds - PRESENCE_WINDOW_SECONDS)],
    ["ZCARD", PRESENCE_KEY],
  ];
}

/** Read-only variant used for crawlers, who may look but not be counted. */
export function countCommand(): string[][] {
  return [["ZCARD", PRESENCE_KEY]];
}

/** Badge copy, e.g. "1 person online now" / "6 people online now". */
export function onlineLabel(count: number): string {
  return `${count} ${count === 1 ? "person" : "people"} online now`;
}
