import { Square } from "lucide-react";
import useTheme from "../hooks/useTheme";

function ListeningPanel({ isRecording = false, transcript = "", onStop }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  if (!isRecording && !transcript) return null;

  return (
    <section
      className={`transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16">
        <div
          className={`border-t pt-14 pb-20 ${
            isLight ? "border-[#223843]/10" : "border-white/10"
          }`}
        >
          {/* Status */}
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="relative flex h-2.5 w-2.5">
                {isRecording && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D77A61] opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    isRecording ? "bg-[#D77A61]" : "bg-[#DBD3D8]"
                  }`}
                />
              </span>

              <p
                className={`text-xs font-semibold uppercase tracking-[0.25em] ${
                  isRecording
                    ? "text-[#D77A61]"
                    : isLight
                      ? "text-[#223843]/50"
                      : "text-[#EFF1F3]/50"
                }`}
              >
                {isRecording ? "Listening…" : "Stopped"}
              </p>
            </div>

            {isRecording && (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-3 rounded-full bg-[#D77A61] px-6 py-3 text-sm font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#D8B4A0] hover:text-[#223843]"
              >
                <Square size={14} strokeWidth={2.4} fill="currentColor" />
                Stop
              </button>
            )}
          </div>

          {/* Live transcript */}
          <div
            className={`mt-10 rounded-[2rem] border p-10 lg:p-14 ${
              isLight
                ? "border-[#223843]/10 bg-[#DBD3D8]/45"
                : "border-white/10 bg-white/5"
            }`}
          >
            <p className="text-sm font-semibold text-[#D77A61]">
              Live transcript
            </p>

            <p
              aria-live="polite"
              className={`mt-5 text-[clamp(1.25rem,2.4vw,2rem)] leading-[1.6] italic ${
                transcript
                  ? ""
                  : isLight
                    ? "text-[#223843]/40"
                    : "text-[#EFF1F3]/40"
              }`}
            >
              {transcript ? `"${transcript}"` : "Start speaking to see your words appear here…"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ListeningPanel;
