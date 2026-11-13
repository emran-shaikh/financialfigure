"use client";

import { useEffect, useState } from "react";
import { HEARTBEAT_INTERVAL_MS, onlineLabel } from "@/lib/presence";

/**
 * Footer badge showing how many people are on the site right now.
 *
 * The number comes from real heartbeats only: it is never padded or faked. An
 * empty site therefore reads "1 person online now" — you — which is the honest
 * answer. The badge hides itself entirely when no presence store is connected.
 */

/** Stable per-browser id, so several tabs of one visit count as one person. */
const VISITOR_KEY = "ff-online-visitor";

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function readVisitorId(): string {
  try {
    const stored = window.localStorage.getItem(VISITOR_KEY);
    if (stored) return stored;
    const created = randomId();
    window.localStorage.setItem(VISITOR_KEY, created);
    return created;
  } catch {
    // Storage blocked: still count the visit, just not shared across tabs.
    return randomId();
  }
}

export default function OnlineCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const id = readVisitorId();
    let timer: ReturnType<typeof setInterval> | undefined;
    let disabled = false;

    const stop = () => {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
    };

    const beat = async () => {
      try {
        const response = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
          cache: "no-store",
        });
        if (!response.ok) {
          // No store connected, or the request was rejected: hide rather than guess.
          disabled = true;
          stop();
          setEnabled(false);
          return;
        }
        const data = (await response.json()) as { online?: number };
        if (!disabled && typeof data.online === "number") setCount(data.online);
      } catch {
        // Transient failure: keep the last known number and retry on the next tick.
      }
    };

    const start = () => {
      if (disabled || timer !== undefined) return;
      void beat();
      timer = setInterval(() => void beat(), HEARTBEAT_INTERVAL_MS);
    };

    // Only a visible tab counts. A page idling behind other tabs is not someone
    // who is on the site right now.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disabled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!enabled) return null;

  return (
    // Reserved height keeps the badge from shifting the footer when it loads.
    <p className="flex min-h-4 items-center gap-2 text-xs text-slate-500">
      {count !== null && (
        <>
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
          </span>
          {onlineLabel(count)}
        </>
      )}
    </p>
  );
}
