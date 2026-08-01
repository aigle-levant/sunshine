// src/components/dashboard/marketing/XConnect.jsx
//
// X (Twitter) has no working backend integration yet — this is a placeholder
// that matches the Instagram connect step's shape so switching platforms
// later doesn't restructure the flow.

import { useState } from "react";
import { ArrowLeft, Construction } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

function XConnect({ onBack }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [username, setUsername] = useState("");

  const inputBg = isLight
    ? "bg-[#F5F5F5] border-[#223843]/15"
    : "bg-[#333] border-white/15";

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className={`mb-5 flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
          isLight
            ? "text-[#223843]/70 hover:text-[#223843]"
            : "text-[#EFF1F3]/70 hover:text-[#EFF1F3]"
        }`}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h3 className="text-lg font-bold">Connect X</h3>

      <label className="mb-2 mt-5 block text-sm font-semibold">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="@username"
        disabled
        className={`w-full rounded-lg border px-4 py-3 text-sm opacity-60 transition-colors duration-300 ${inputBg} ${
          isLight ? "placeholder-[#223843]/40" : "placeholder-[#EFF1F3]/40"
        }`}
      />

      <div
        className={`mt-5 flex items-center gap-3 rounded-lg border border-dashed p-4 ${
          isLight ? "border-[#223843]/20 text-[#223843]/60" : "border-white/20 text-[#EFF1F3]/60"
        }`}
      >
        <Construction size={18} className="flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold">Coming Soon</p>
          <p className="text-sm">This feature is under development.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 rounded-lg bg-[#D77A61] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53]"
      >
        Back
      </button>
    </div>
  );
}

export default XConnect;
