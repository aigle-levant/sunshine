// src/components/dashboard/WelcomeBanner.jsx
//
// The hero strip at the top of the dashboard. It greets by time of day and
// leads with the most recent thing the model actually understood, so the page
// opens with the user's own words rather than a generic slogan.

import { motion } from "framer-motion";
import { Mic, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useTheme from "../../hooks/useTheme";
import { formatRelativeDate } from "./dashboardData";

function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

function WelcomeBanner({ name = "there", summary = null, lastUpdated = null }) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isLight = theme === "light";

  const relative = formatRelativeDate(lastUpdated);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-[2rem] border p-7 sm:p-9 ${
        isLight
          ? "border-[#223843]/10 bg-[#DBD3D8]/45"
          : "border-white/10 bg-white/5"
      }`}
    >
      {/* Same accent bloom the voice overlay uses, kept subtle behind text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,#D77A61_0%,transparent_65%)] opacity-25 blur-3xl"
      />

      <div className="relative flex flex-wrap items-end justify-between gap-8">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
            {greeting()}
          </p>

          <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.045em]">
            Here's your business,
            <br />
            <span className="font-normal italic">{name}.</span>
          </h2>

          {summary ? (
            <p
              className={`mt-5 max-w-xl text-base leading-8 ${
                isLight ? "text-[#223843]/65" : "text-[#EFF1F3]/65"
              }`}
            >
              {summary}
            </p>
          ) : (
            <p
              className={`mt-5 max-w-xl text-base leading-8 ${
                isLight ? "text-[#223843]/65" : "text-[#EFF1F3]/65"
              }`}
            >
              Nothing recorded yet. Speak once and this page fills itself in.
            </p>
          )}

          {relative && (
            <span
              className={`mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                isLight
                  ? "bg-[#223843]/8 text-[#223843]/60"
                  : "bg-white/10 text-[#EFF1F3]/60"
              }`}
            >
              <Sparkles size={13} strokeWidth={2} />
              Updated {relative.toLowerCase()}
            </span>
          )}
        </div>

        <motion.button
          type="button"
          onClick={() => navigate("/speak")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex shrink-0 items-center gap-4 rounded-full bg-[#D77A61] py-2 pl-7 pr-2 text-base font-semibold text-[#EFF1F3] shadow-[0_18px_45px_-18px_rgba(215,122,97,0.9)] transition-colors duration-300 hover:bg-[#C96B53]"
        >
          Add by voice
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF1F3] text-[#D77A61]">
            <Mic size={19} strokeWidth={1.9} />
          </span>
        </motion.button>
      </div>
    </motion.section>
  );
}

export default WelcomeBanner;
