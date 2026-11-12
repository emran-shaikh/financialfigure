import { DISCLAIMER_SHORT } from "@/lib/site";

/**
 * Visible estimate disclaimer. Required on every calculator page.
 * Variants exist so the wording can match the context (tax vs general finance).
 */
export default function Disclaimer({
  variant = "general",
  reviewed,
}: {
  variant?: "general" | "tax" | "investment";
  reviewed?: string;
}) {
  const text: Record<string, string> = {
    general: DISCLAIMER_SHORT,
    tax: "Estimates only — not tax advice. Tax rules change and your situation may differ; confirm figures with the IRS, your state revenue department or a qualified tax professional.",
    investment:
      "Estimates only — not investment advice. Returns are not guaranteed and past performance does not predict future results.",
  };

  return (
    <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <strong className="font-semibold">Disclaimer:</strong> {text[variant]}{" "}
      {reviewed && <span className="text-amber-800">Data last reviewed {reviewed}.</span>}
    </p>
  );
}
