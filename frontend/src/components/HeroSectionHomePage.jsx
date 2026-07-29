import { ArrowDown, Mic } from "lucide-react";
import useTheme from "../hooks/useTheme";

const LIGHT_HERO =
  "https://images.unsplash.com/photo-1622182474659-f13d68140bfc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const DARK_HERO =
  "https://images.unsplash.com/photo-1628178693557-0269334ffbe8?q=80&w=1190&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function Hero() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-black text-white">
      {/* Background */}
      <img
        src={isLight ? LIGHT_HERO : DARK_HERO}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
          isLight
            ? "scale-110 object-[68%_center] brightness-[1.03]"
            : "scale-110 object-[58%_center] brightness-[0.82]"
        }`}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: isLight
            ? `
              linear-gradient(
                to bottom,
                rgba(239,241,243,.08),
                rgba(239,241,243,0) 25%
              ),
              linear-gradient(
                to right,
                rgba(215,122,97,.14),
                transparent 45%
              ),
              radial-gradient(
                ellipse at center,
                rgba(0,0,0,0) 30%,
                rgba(0,0,0,.12) 55%,
                rgba(0,0,0,.30) 75%,
                rgba(0,0,0,.68) 100%
              )
            `
            : `
              linear-gradient(
                to bottom,
                rgba(34,56,67,.42),
                rgba(34,56,67,.08) 30%
              ),
              linear-gradient(
                to right,
                rgba(215,122,97,.10),
                transparent 45%
              ),
              radial-gradient(
                ellipse at center,
                rgba(0,0,0,.08) 28%,
                rgba(0,0,0,.22) 50%,
                rgba(0,0,0,.48) 72%,
                rgba(0,0,0,.88) 100%
              )
            `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col px-6 pt-28 pb-8 md:px-12 lg:px-16">
        <div className="flex flex-1 flex-col justify-end">
          {/* Eyebrow */}
          <div className="mb-8 flex items-center gap-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D77A61]" />

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
              Your business. Your language.
            </p>
          </div>

          {/* Main */}
          <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
            <div>
              <h1 className="max-w-[850px] text-[clamp(4.2rem,8.5vw,9rem)] font-semibold leading-[0.82] tracking-[-0.065em]">
                Business,
                <br />
                in your
                <br />
                <span className="font-normal italic">own words.</span>
              </h1>
            </div>

            <div className="max-w-md pb-2 lg:pb-5">
              <p className="text-lg leading-8 text-white/90 md:text-xl md:leading-9">
                Add orders, record payments and understand your business simply
                by speaking naturally.
              </p>

              <button
                type="button"
                className="group mt-8 flex items-center gap-5 rounded-full bg-[#D77A61] py-2 pl-7 pr-2 text-lg font-semibold text-[#EFF1F3] transition-all duration-300 hover:scale-[1.02] hover:bg-[#C96B53]"
              >
                Speak to [TESTING]
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#223843] text-[#EFF1F3]">
                  <Mic size={21} strokeWidth={1.8} />
                </span>
              </button>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-14 flex items-end justify-between border-t border-white/20 pt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 md:text-sm">
              Tamil · Tanglish · English
            </p>

            <a
              href="#business"
              aria-label="Scroll down"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 transition-all duration-300 hover:border-[#D77A61] hover:bg-[#D77A61]"
            >
              <ArrowDown size={19} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
