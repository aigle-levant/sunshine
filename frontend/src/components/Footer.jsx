import { ArrowUpRight, Mic } from "lucide-react";
import useTheme from "../hooks/useTheme";

function Footer() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <footer
      className={`transition-all duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 lg:px-16 lg:py-28">
        {/* Hero */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                isLight ? "text-[#223843]/50" : "text-[#D8B4A0]"
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

          <button className="group flex w-fit items-center gap-5 rounded-full bg-[#D77A61] py-2 pl-7 pr-2 text-lg font-semibold text-[#EFF1F3] transition-all duration-300 hover:scale-[1.03] hover:bg-[#C96B53]">
            Speak to VoiceKart AI
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#223843] text-[#EFF1F3] transition-transform duration-300 group-hover:rotate-6">
              <Mic size={20} />
            </span>
          </button>
        </div>

        {/* Divider */}
        <div
          className={`my-20 h-px ${
            isLight ? "bg-[#223843]/10" : "bg-white/10"
          }`}
        />

        {/* Content */}
        <div className="grid gap-14 lg:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-semibold tracking-[-0.05em]">
              VoiceKart AI
              <span className="text-[#D77A61]">.</span>
            </h3>

            <p
              className={`mt-6 max-w-md text-base leading-8 ${
                isLight ? "text-[#223843]/65" : "text-[#EFF1F3]/70"
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
                isLight ? "text-[#223843]/45" : "text-[#D8B4A0]"
              }`}
            >
              Navigate
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {[
                { label: "My Business", href: "#business" },
                { label: "Orders", href: "#orders" },
                { label: "Customers", href: "#customers" },
                { label: "Speak", href: "#speak" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`transition-colors ${
                    isLight ? "hover:text-[#D77A61]" : "hover:text-[#D77A61]"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isLight ? "text-[#223843]/45" : "text-[#D8B4A0]"
              }`}
            >
              Designed for
            </p>

            <div
              className={`mt-6 flex flex-col gap-4 ${
                isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
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
              ? "border-[#223843]/10 text-[#223843]/55"
              : "border-white/10 text-[#EFF1F3]/55"
          }`}
        >
          <p>© 2026 VoiceKart AI. All rights reserved.</p>

          <p>Made with purpose in Chennai.</p>

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-[#D77A61]"
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
