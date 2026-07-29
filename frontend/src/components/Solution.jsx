import { Mic, ArrowRight } from "lucide-react";
import useTheme from "../hooks/useTheme";

function Solution() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <section
      className={`transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 lg:px-16">
        <div className="grid items-center gap-20 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
              The solution
            </p>

            <h2 className="mt-5 text-[clamp(2.8rem,5vw,5.6rem)] font-medium leading-[0.92] tracking-[-0.05em]">
              A business
              <br />
              assistant that
              <br />
              simply listens.
            </h2>

            <div
              className={`mt-10 max-w-xl space-y-8 text-lg leading-9 ${
                isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
              }`}
            >
              <p>
                Instead of learning software, women continue speaking exactly as
                they already do.
              </p>

              <p>
                [TESTING] understands orders, payments, customers and reminders
                from everyday conversations—then quietly keeps everything
                organised in the background.
              </p>
            </div>

            <button className="group mt-12 flex items-center gap-4 rounded-full bg-[#D77A61] px-7 py-4 font-medium text-[#EFF1F3] transition hover:bg-[#C96B53]">
              <Mic size={18} />
              Try speaking
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Right */}

          <div
            className={`rounded-[2rem] border p-10 lg:p-14 ${
              isLight
                ? "border-[#223843]/10 bg-[#DBD3D8]/45"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold text-[#D77A61]">
                  Woman says
                </p>

                <p className="mt-3 text-xl leading-9 italic">
                  "Lakshmi ordered two blouses.
                  <br />
                  Advance ₹500.
                  <br />
                  Delivery Friday."
                </p>
              </div>

              <div className="h-px bg-current/10" />

              <div>
                <p className="text-sm font-semibold text-[#D77A61]">
                  [TESTING] understands
                </p>

                <div
                  className={`mt-5 space-y-4 ${
                    isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>Customer</span>
                    <span>Lakshmi</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Order</span>
                    <span>2 Blouses</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Advance</span>
                    <span>₹500</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>Friday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Solution;
