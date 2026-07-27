import { ArrowUpRight, Mic } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#17382B] text-[#F4F0E8]">
      {/* Large closing statement */}
      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F4F0E8]/50">
          Your business. Your language.
        </p>

        <div className="mt-7 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-4xl text-[clamp(3.2rem,8vw,8rem)] font-medium leading-[0.86] tracking-[-0.065em]">
            Less managing.
            <br />
            More making.
          </h2>

          <button
            type="button"
            className="flex w-fit items-center gap-3 rounded-full bg-[#F0BE5D] px-6 py-4 font-medium text-[#17382B] transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <Mic size={18} />
            Speak to [TESTING]
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/15" />

      {/* Footer links */}
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-12 md:grid-cols-2 md:px-10 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-2">
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            [TESTING]<span className="text-[#F0BE5D]">.</span>
          </p>

          <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
            A voice-first business companion for women building businesses in
            their own way, in their own language.
          </p>
        </div>

        {/* Explore */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Explore
          </p>

          <div className="mt-5 flex flex-col items-start gap-3">
            <a className="footer-link" href="#business">
              My Business
            </a>

            <a className="footer-link" href="#orders">
              Orders
            </a>

            <a className="footer-link" href="#customers">
              Customers
            </a>

            <a className="footer-link" href="#speak">
              Speak to [TESTING]
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Built for
          </p>

          <div className="mt-5 space-y-3 text-sm text-white/65">
            <p>Rural women</p>
            <p>Tailors</p>
            <p>Home bakers</p>
            <p>Beauticians</p>
            <p>Small businesses</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 border-t border-white/15 px-5 py-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© 2026 [TESTING]</p>

        <p>Made for women who make things happen.</p>

        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 transition-colors hover:text-white"
        >
          GitHub
          <ArrowUpRight size={12} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
