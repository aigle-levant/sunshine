// src/components/dashboard/SuggestedCampaign.jsx
//
// One suggested outreach. The copy is pre-filled so it can be sent as-is, but
// nothing sends automatically — the button hands off to WhatsApp/SMS and the
// user decides.

import { motion } from "framer-motion";
import { Copy, Check, Send } from "lucide-react";
import { useState } from "react";

import useTheme from "../../hooks/useTheme";

function SuggestedCampaign({ campaign, index = 0, onSend }) {
  const { theme } = useTheme();

  const [copied, setCopied] = useState(false);

  const isLight = theme === "light";

  const mutedText = isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(campaign?.message ?? "");

      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is permission-gated; failing silently beats an alert here.
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border p-5 transition-colors duration-300 ${
        isLight
          ? "border-[#223843]/10 bg-[#EFF1F3]/60"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#D77A61]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D77A61]">
          {campaign?.channel ?? "WhatsApp"}
        </span>

        <p className="text-[15px] font-semibold">{campaign?.title}</p>
      </div>

      <p className={`mt-3 text-[13px] leading-6 ${mutedText}`}>
        {campaign?.reason}
      </p>

      <p
        className={`mt-4 rounded-xl px-4 py-3 text-sm leading-7 ${
          isLight ? "bg-[#223843]/5" : "bg-black/20"
        }`}
      >
        “{campaign?.message}”
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => onSend?.(campaign)}
          className="flex items-center gap-2 rounded-full bg-[#D77A61] px-4 py-2.5 text-[13px] font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#C96B53]"
        >
          <Send size={14} strokeWidth={2} />
          Send
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
            isLight
              ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
              : "border-white/15 hover:bg-white/10"
          }`}
        >
          {copied ? <Check size={14} strokeWidth={2.2} /> : <Copy size={14} strokeWidth={2} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </motion.li>
  );
}

export default SuggestedCampaign;
