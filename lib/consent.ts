"use client";

/**
 * Consent store for advertising and analytics cookies.
 *
 * Model: **opt-out, US-first**.
 *
 *  - Advertising and analytics are allowed by default so Google can verify the
 *    site, ads can serve and revenue can be earned on first visit.
 *  - The visitor can turn both off in one click ("Essential only" in
 *    ConsentBanner), which persists and immediately removes ad units and GA4.
 *  - When a Google-certified CMP is configured (see ConsentBanner /
 *    CHECKLIST.md) the CMP is the source of truth for EEA, UK and Switzerland
 *    traffic and calls `applyCmpDecision` with the visitor's real choice.
 *
 * Nothing here fakes or silently overrides a consent signal: an explicit
 * decline is honoured everywhere (`advertising: false` renders no ad units and
 * no AdSense personalisation, `analytics: false` loads no GA4).
 */

import { useSyncExternalStore } from "react";

export interface ConsentState {
  /** True when advertising cookies/ads are allowed. Defaults to true (opt-out). */
  advertising: boolean;
  /** True when analytics cookies are allowed. Defaults to true (opt-out). */
  analytics: boolean;
  /** True once the visitor has made a choice (or a CMP has supplied one). */
  decided: boolean;
}

const STORAGE_KEY = "financialfigure.consent.v1";

const DEFAULT_STATE: ConsentState = { advertising: true, analytics: true, decided: false };

let state: ConsentState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

const SERVER_STATE: ConsentState = { advertising: true, analytics: true, decided: false };

function readStorage(): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<ConsentState>) };
  } catch {
    state = DEFAULT_STATE;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

export function getConsent(): ConsentState {
  readStorage();
  return state;
}

export function setConsent(next: Partial<ConsentState>): void {
  readStorage();
  state = { ...state, ...next, decided: true };
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage can be unavailable in private modes — the in-memory value still applies */
  }
  emit();
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook returning the current consent state. Safe during SSR. */
export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribeConsent, getConsent, () => SERVER_STATE);
}

/**
 * Google-certified CMP integration point.
 *
 * Google AdSense requires a CMP that implements the IAB TCF v2.2 (or Google's
 * additional consent) signal for EEA, UK and Switzerland traffic. When you buy
 * a CMP you set NEXT_PUBLIC_CMP_ID; its `<script>` tags belong in
 * components/ConsentScripts.tsx. This helper is where a CMP callback should
 * forward the user's decision into the store above.
 */
export function applyCmpDecision(advertising: boolean, analytics: boolean): void {
  setConsent({ advertising, analytics });
}
