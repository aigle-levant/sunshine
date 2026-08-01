import { ArrowRight, Mic } from "lucide-react";
import useTheme from "../../hooks/useTheme";

function CTA() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <section
      className={`transition-colors duration-500 ${
        isLight
          ? "bg-[#EFF1F3] text-[#223843]"
          : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 lg:px-16">
        <div
          className={`overflow-hidden rounded-[2.5rem] border ${
            isLight
              ? "border-[#223843]/10 bg-[#DBD3D8]/45"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="grid gap-16 p-10 lg:grid-cols-[1.4fr_0.6fr] lg:p-20">
            {/* Left */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
                Ready to begin?
              </p>

              <h2 className="mt-6 max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em]">
                Your business
                <br />
                already has
                <br />
                a voice.
              </h2>

              <p
                className={`mt-10 max-w-2xl text-xl leading-10 ${
                  isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
                }`}
              >
                Let it manage orders, customers and payments the same way it
                already manages conversations.
              </p>
            </div>

            {/* Right */}

            <div className="flex flex-col justify-end gap-6">
              <button className="group flex items-center justify-between rounded-full bg-[#D77A61] px-8 py-5 text-lg font-medium text-[#EFF1F3] transition hover:bg-[#C96B53]">
                <span className="flex items-center gap-4">
                  <Mic size={20} />
                  Speak to VoiceKart AI
                </span>

                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <p
                className={`text-sm leading-7 ${
                  isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"
                }`}
              >
                No setup. No training. No complicated software.
                <br />
                Just start talking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;