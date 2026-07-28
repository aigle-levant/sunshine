import { Menu, Mic, Moon, Sun } from "lucide-react";
import useTheme from "../hooks/useTheme";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-6 pt-6">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className={`text-3xl font-semibold tracking-[-0.05em] drop-shadow-lg ${
            isLight ? "text-[#22332D]" : "text-[#F8F6F2]"
          }`}
        >
          [TESTING]<span className="text-[#D8A15A]">.</span>
        </a>

        {/* Navigation */}
        <nav
          className={`hidden items-center rounded-full border p-2 shadow-xl backdrop-blur-xl lg:flex ${
            isLight
              ? "border-[#22332D]/10 bg-[#F8F6F2]/90"
              : "border-white/10 bg-[#22332D]/75"
          }`}
        >
          {["My Business", "Orders", "Customers"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "")}`}
              className={`rounded-full px-8 py-3 text-[15px] font-medium transition ${
                isLight
                  ? "text-[#22332D] hover:bg-white"
                  : "text-[#F8F6F2] hover:bg-white/10"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`hidden h-14 w-14 items-center justify-center rounded-full shadow-lg backdrop-blur transition sm:flex ${
              isLight
                ? "bg-[#F8F6F2]/90 text-[#22332D]"
                : "bg-[#22332D]/80 text-[#F8F6F2]"
            }`}
          >
            {isLight ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className={`hidden items-center gap-3 rounded-full px-7 py-4 text-sm font-medium shadow-lg transition sm:flex ${
              isLight
                ? "bg-[#22332D] text-[#F8F6F2]"
                : "bg-[#D8A15A] text-[#22332D]"
            }`}
          >
            <Mic size={16} />
            Speak to [TESTING]
          </button>

          <button
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg backdrop-blur lg:hidden ${
              isLight
                ? "bg-[#F8F6F2]/90 text-[#22332D]"
                : "bg-[#22332D]/80 text-[#F8F6F2]"
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
