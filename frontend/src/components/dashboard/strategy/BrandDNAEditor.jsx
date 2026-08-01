// src/components/dashboard/strategy/BrandDNAEditor.jsx
//
// Section 2 — the AI-generated brand summary, editable before it's sent back
// to Claude as context for the strategy.

import { Dna } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

function BrandDNAEditor({ value, onChange }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";
  const textareaBg = isLight
    ? "bg-[#F5F5F5] border-[#223843]/15"
    : "bg-[#333] border-white/15";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center gap-2 text-lg font-bold">
        <Dna size={19} className="text-[#D77A61]" />
        Brand DNA
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`mt-4 w-full resize-y rounded-lg border px-4 py-3 text-sm leading-6 transition-colors duration-300 ${textareaBg}`}
      />
    </div>
  );
}

export default BrandDNAEditor;
