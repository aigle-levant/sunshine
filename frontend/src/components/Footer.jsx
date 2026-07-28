import { ArrowUpRight, Mic } from "lucide-react";
import useTheme from "../hooks/useTheme";

function Footer() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <footer
      className={`transition-colors duration-500 ${
        isLight ? "bg-[#F7F3EC] text-[#22332D]" : "bg-[#1E2D28] text-[#F8F6F2]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 lg:px-16 lg:py-28">
        {/* Hero */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                isLight ? "text-[#22332D]/50" : "text-white/45"
              }`}
            >
              Built for women who build.
            </p>

            <h2 className="mt-6 max-w-5xl text-[clamp(3.5rem,8vw,8.5rem)] font-medium leading-[0.84] tracking-[-0.065em]">
              Less managing.
              <br />
              More making.
            </h2>
          </div>

          <button
            className={`group flex w-fit items-center gap-5 rounded-full py-2 pl-7 pr-2 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] ${
              isLight
                ? "bg-[#22332D] text-[#F8F6F2]"
                : "bg-[#D8A15A] text-[#22332D]"
            }`}
          >
            Speak to [TESTING]
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-6 ${
                isLight
                  ? "bg-[#F8F6F2] text-[#22332D]"
                  : "bg-[#22332D] text-[#F8F6F2]"
              }`}
            >
              <Mic size={20} />
            </span>
          </button>
        </div>

        {/* Divider */}
        <div
          className={`my-20 h-px ${
            isLight ? "bg-[#22332D]/10" : "bg-white/10"
          }`}
        />

        {/* Content */}
        <div className="grid gap-14 lg:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-semibold tracking-[-0.05em]">
              [TESTING]
              <span className="text-[#D8A15A]">.</span>
            </h3>

            <p
              className={`mt-6 max-w-md text-base leading-8 ${
                isLight ? "text-[#22332D]/65" : "text-white/60"
              }`}
            >
              A voice-first business companion helping women manage customers,
              orders and payments simply by speaking in the language they use
              every day.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isLight ? "text-[#22332D]/45" : "text-white/40"
              }`}
            >
              Navigate
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {["My Business", "Orders", "Customers", "Speak"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className="transition-colors hover:text-[#D8A15A]"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isLight ? "text-[#22332D]/45" : "text-white/40"
              }`}
            >
              Designed for
            </p>

            <div
              className={`mt-6 flex flex-col gap-4 ${
                isLight ? "text-[#22332D]/70" : "text-white/65"
              }`}
            >
              <span>Tailors</span>
              <span>Home Bakers</span>
              <span>Beauticians</span>
              <span>Women Entrepreneurs</span>
              <span>Small Businesses</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`mt-20 flex flex-col gap-5 border-t pt-8 text-sm md:flex-row md:items-center md:justify-between ${
            isLight
              ? "border-[#22332D]/10 text-[#22332D]/55"
              : "border-white/10 text-white/45"
          }`}
        >
          <p>© 2026 [TESTING]. All rights reserved.</p>

          <p>Made with purpose in Chennai.</p>

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-[#D8A15A]"
          >
            GitHub
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
