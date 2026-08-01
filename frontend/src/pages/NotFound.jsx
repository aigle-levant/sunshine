// src/pages/NotFound.jsx
//
// Catch-all for unknown paths. Without it a typo renders a blank page, which
// reads as a crash.

import { Link } from "react-router-dom";
import { ArrowLeft, Mic } from "lucide-react";

import useTheme from "../hooks/useTheme";

function NotFound() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center px-6 text-center transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
        Page not found
      </p>

      <h1 className="mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.05em]">
        That page isn't
        <br />
        <span className="font-normal italic">here.</span>
      </h1>

      <p
        className={`mt-6 max-w-md text-lg leading-8 ${
          isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"
        }`}
      >
        The link may be old, or the page may have moved.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className={`flex items-center gap-3 rounded-full border px-7 py-4 text-base font-semibold transition-colors duration-300 ${
            isLight
              ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
              : "border-white/15 hover:bg-white/10"
          }`}
        >
          <ArrowLeft size={18} strokeWidth={1.8} />
          Back home
        </Link>

        <Link
          to="/speak"
          className="flex items-center gap-3 rounded-full bg-[#D77A61] px-7 py-4 text-base font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#C96B53]"
        >
          <Mic size={18} strokeWidth={1.8} />
          Speak to VoiceKart
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
