import { Mic } from "lucide-react";
import useTheme from "../hooks/useTheme";

function SpeakHero({ onStart, isRecording = false, disabled = false }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const idleClasses = isLight
    ? "bg-[#223843] text-[#EFF1F3] hover:bg-[#D8B4A0] hover:text-[#223843]"
    : "bg-[#EFF1F3] text-[#223843] hover:bg-[#D8B4A0]";

  return (
    <section
      className={`transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 pt-32 pb-20 md:px-12 lg:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
          Speak naturally
        </p>

        <h1 className="mt-6 max-w-[820px] text-[clamp(3rem,6.5vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em]">
          How can I
          <br />
          help you
          <br />
          <span className="font-normal italic">today?</span>
        </h1>

        <p
          className={`mt-8 max-w-md text-lg leading-9 ${
            isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
          }`}
        >
          Describe your business naturally.
        </p>

        <button
          type="button"
          onClick={onStart}
          disabled={disabled || isRecording}
          aria-pressed={isRecording}
          className={`group mt-12 flex items-center gap-5 rounded-full py-2 pl-7 pr-2 text-lg font-semibold transition-all duration-300 ${
            disabled
              ? "cursor-not-allowed bg-[#DBD3D8] text-[#223843]/40"
              : isRecording
                ? "cursor-default bg-[#D77A61] text-[#EFF1F3]"
                : `${idleClasses} hover:scale-[1.02]`
          }`}
        >
          {isRecording ? "Listening…" : "Start Speaking"}

          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 ${
              disabled
                ? "bg-[#EFF1F3] text-[#223843]/40"
                : isRecording
                  ? "animate-pulse bg-[#EFF1F3] text-[#D77A61]"
                  : "bg-[#D77A61] text-[#EFF1F3]"
            }`}
          >
            <Mic size={21} strokeWidth={1.8} />
          </span>
        </button>
      </div>
    </section>
  );
}

export default SpeakHero;
