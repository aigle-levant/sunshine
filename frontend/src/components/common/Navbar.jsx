import { Menu, Mic, Moon, Sun } from "lucide-react";
import useTheme from "../../hooks/useTheme";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-6 pt-6">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className={`text-3xl font-semibold tracking-[-0.05em] transition-colors ${
            isLight ? "text-[#223843]" : "text-[#EFF1F3]"
          }`}
        >
          VoiceKart AI
          <span className="text-[#D77A61]">.</span>
        </a>

        {/* Navigation */}
        <nav
          className={`hidden items-center rounded-full border p-2 shadow-xl backdrop-blur-xl lg:flex ${
            isLight
              ? "border-[#223843]/10 bg-[#EFF1F3]/90"
              : "border-white/10 bg-[#223843]/85"
          }`}
        >
          {["My Business", "Orders", "Customers"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "")}`}
              className={`rounded-full px-8 py-3 text-[15px] font-medium transition-all ${
                isLight
                  ? "text-[#223843] hover:bg-white"
                  : "text-[#EFF1F3] hover:bg-white/10"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme */}
          <button
            onClick={toggleTheme}
            className={`hidden h-14 w-14 items-center justify-center rounded-full shadow-lg backdrop-blur transition-all sm:flex ${
              isLight
                ? "bg-[#EFF1F3]/90 text-[#223843]"
                : "bg-[#223843]/90 text-[#EFF1F3]"
            }`}
          >
            {isLight ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* CTA */}
          <button className="hidden items-center gap-3 rounded-full bg-[#D77A61] px-7 py-4 text-sm font-medium text-[#EFF1F3] shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#C96B53] sm:flex">
            <Mic size={16} />
            Speak to VoiceKart AI
          </button>

          {/* Mobile */}
          <button
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg backdrop-blur lg:hidden ${
              isLight
                ? "bg-[#EFF1F3]/90 text-[#223843]"
                : "bg-[#223843]/90 text-[#EFF1F3]"
            }`}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
