import { NextResponse } from "next/server";
import { countCommand, heartbeatCommands, isHuman, isVisitorId, redisConfig } from "@/lib/presence";

/**
 * Records the caller as online and returns the current head count.
 *
 * Responds 503 while the Redis store is unprovisioned, which tells the badge to
 * stay hidden rather than display a number it cannot vouch for.
 */

interface RedisResponse {
  result?: unknown;
  error?: string;
}

export async function POST(request: Request) {
  const config = redisConfig();
  if (!config) {
    return NextResponse.json({ error: "presence-disabled" }, { status: 503 });
  }

  let commands: string[][];
  if (isHuman(request.headers.get("user-agent"))) {
    const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
    if (!isVisitorId(body?.id)) {
      return NextResponse.json({ error: "bad-id" }, { status: 400 });
    }
    commands = heartbeatCommands(body.id, Math.floor(Date.now() / 1000));
  } else {
    // Crawlers and probes may read the count, but never add to it.
    commands = countCommand();
  }

  try {
    const results = await pipeline(config.url, config.token, commands);
    return NextResponse.json({ online: Number(results[results.length - 1]) || 0 });
  } catch {
    return NextResponse.json({ error: "presence-unavailable" }, { status: 503 });
  }
}

/** Upstash REST pipeline: send several Redis commands in one round trip. */
async function pipeline(url: string, token: string, commands: string[][]): Promise<unknown[]> {
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`redis ${response.status}`);

  const payload = (await response.json()) as RedisResponse[];
  const failed = payload.find((entry) => entry.error);
  if (failed) throw new Error(`redis ${failed.error}`);
  return payload.map((entry) => entry.result);
}
