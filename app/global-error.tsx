"use client";

/**
 * Last-resort error boundary. Replaces the whole document, so it must render
 * its own <html> and <body>. Only triggered when the root layout itself throws,
 * which is rare — but it prevents a blank white screen for visitors and for
 * Google's crawler.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <main style={{ maxWidth: "48rem", margin: "0 auto", padding: "5rem 1rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 600, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "1rem", color: "#475569" }}>
            The site failed to load. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              background: "#115e59",
              color: "#ffffff",
              border: 0,
              borderRadius: "0.5rem",
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#94a3b8" }}>
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
