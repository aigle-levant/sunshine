import { ArrowDown, Mic } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1622182474659-f13d68140bfc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black text-white">
      {/* Full viewport background */}
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Image treatment */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />

      {/* 
        Content can have a max width.
        Background/image MUST NOT.
      */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col px-6 pb-8 pt-28 md:px-12 lg:px-16 lg:pb-10">
        {/* Push main content toward lower portion */}
        <div className="flex flex-1 flex-col justify-end">
          {/* Eyebrow */}
          <div className="mb-8 flex items-center gap-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F5C451]" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 md:text-xs">
              Your business. Your language.
            </p>
          </div>

          {/* Hero content */}
          <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
            {/* Headline */}
            <div>
              <h1 className="max-w-[850px] text-[clamp(4.2rem,8.5vw,9rem)] font-semibold leading-[0.82] tracking-[-0.065em]">
                Business,
                <br />
                in your
                <br />
                <span className="font-normal italic">own words.</span>
              </h1>
            </div>

            {/* Copy + CTA */}
            <div className="max-w-md pb-2 lg:pb-5">
              <p className="text-lg leading-8 text-white/90 md:text-xl md:leading-9">
                Add orders, record payments and understand your business simply
                by speaking naturally.
              </p>

              <button
                type="button"
                className="group mt-8 flex items-center gap-5 rounded-full bg-[#F5C451] py-2 pl-7 pr-2 text-lg font-semibold text-[#17382B] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Speak to Sakhi
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#17382B] text-white">
                  <Mic size={21} strokeWidth={1.8} />
                </span>
              </button>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-14 flex items-end justify-between border-t border-white/30 pt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 md:text-sm">
              Tamil · Tanglish · English
            </p>

            <a
              href="#business"
              aria-label="Scroll down"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 transition-all hover:bg-white hover:text-black"
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
