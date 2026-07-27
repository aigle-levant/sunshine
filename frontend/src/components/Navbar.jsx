import { Menu, Mic } from "lucide-react";

function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
        {/* Brand */}
        <a
          href="/"
          className="text-xl font-semibold tracking-[-0.04em] text-[#18382B] md:text-2xl"
        >
          [TESTING]<span className="text-[#D66B3D]">.</span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#business"
            className="text-sm font-medium text-[#18382B]/70 transition-colors hover:text-[#18382B]"
          >
            My Business
          </a>

          <a
            href="#orders"
            className="text-sm font-medium text-[#18382B]/70 transition-colors hover:text-[#18382B]"
          >
            Orders
          </a>

          <a
            href="#customers"
            className="text-sm font-medium text-[#18382B]/70 transition-colors hover:text-[#18382B]"
          >
            Customers
          </a>
        </nav>

        {/* Primary action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full bg-[#18382B] px-5 py-3 text-sm font-medium text-[#F5F0E7] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:flex"
          >
            <Mic size={16} strokeWidth={1.8} />
            Speak to [TESTING]
          </button>

          {/* Mobile menu - visual only for now */}
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#18382B]/15 text-[#18382B] md:hidden"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
