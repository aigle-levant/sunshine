// src/components/dashboard/EmptyState.jsx
//
// Shown wherever a panel has nothing to render. Every empty state on this page
// points back at the mic — that's the only way data gets in.

import { motion } from "framer-motion";
import { Inbox, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useTheme from "../../hooks/useTheme";

function EmptyState({
  title = "Nothing here yet",
  description = "Record something and it'll show up here.",
  icon: Icon = Inbox,
  actionLabel = null,
  onAction = null,
  compact = false,
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isLight = theme === "light";

  // Default action is the mic, since that's how every panel gets populated.
  const handleAction = onAction ?? (() => navigate("/speak"));

  const label = actionLabel ?? "Speak to add";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed text-center ${
        compact ? "gap-3 px-5 py-8" : "gap-4 px-6 py-14"
      } ${isLight ? "border-[#223843]/15" : "border-white/15"}`}
    >
      <span
        className={`flex items-center justify-center rounded-full ${
          compact ? "h-11 w-11" : "h-14 w-14"
        } ${isLight ? "bg-[#223843]/6" : "bg-white/8"} ${
          isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
        }`}
      >
        <Icon size={compact ? 19 : 23} strokeWidth={1.7} />
      </span>

      <div>
        <p className={compact ? "text-sm font-semibold" : "text-base font-semibold"}>
          {title}
        </p>

        <p
          className={`mx-auto mt-1.5 max-w-xs leading-6 ${
            compact ? "text-[13px]" : "text-sm"
          } ${isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"}`}
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAction}
        className={`mt-1 flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
          isLight
            ? "border border-[#223843]/15 hover:bg-[#DBD3D8]"
            : "border border-white/15 hover:bg-white/10"
        }`}
      >
        <Mic size={15} strokeWidth={1.9} />
        {label}
      </button>
    </motion.div>
  );
}

export default EmptyState;
