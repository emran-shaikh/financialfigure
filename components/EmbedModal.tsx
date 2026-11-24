"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

interface EmbedModalProps {
  slug: string;
  title: string;
}

export default function EmbedModal({ slug, title }: EmbedModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedUrl = `${SITE.url}/embed/${slug}`;
  const pageUrl = `${SITE.url}/${slug}`;

  const snippet = `<iframe src="${embedUrl}" width="100%" height="680" style="border:0;border-radius:12px;overflow:hidden;" loading="lazy" title="${title}"></iframe>
<p style="font-size:12px;color:#64748b;margin-top:6px;text-align:right;">
  Calculator powered by <a href="${pageUrl}" target="_blank" rel="noopener noreferrer" style="color:#0f766e;text-decoration:underline;">Financial Figure</a>
</p>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-teal-700 hover:text-teal-900"
        title="Embed this interactive calculator on your blog or website"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-teal-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <span>Embed</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Embed {title}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600">
              Add this interactive calculator to your website or blog. Free to use, responsive,
              and always updated for the 2026 tax year.
            </p>

            <div className="mt-4">
              <label htmlFor="embed-code" className="block text-xs font-medium text-slate-700">
                HTML Embed Code
              </label>
              <textarea
                id="embed-code"
                readOnly
                rows={5}
                value={snippet}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-teal-700 focus:outline-hidden"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {copied ? "✓ Copied to clipboard!" : "Click below to copy"}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="rounded-lg bg-teal-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-900"
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
