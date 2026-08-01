import useTheme from "../../hooks/useTheme";

function ProblemStatement() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <section
      className={`transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-12 lg:px-16">
        {/* Intro */}
        <div className="grid items-start gap-20 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left */}
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
              Why VoiceKart AI
            </p>

            <h2 className="mt-5 text-[clamp(2.6rem,5vw,5.2rem)] font-medium leading-[0.94] tracking-[-0.05em]">
              Across villages in
              <br />
              Tamil Nadu,
              <br />
              businesses begin
              <br />
              with people.
            </h2>

            <div className="mt-12 space-y-8">
              <p
                className={`text-lg leading-9 ${
                  isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
                }`}
              >
                Before sunrise, a tailor prepares fabrics. A home baker starts
                the first batch. A flower seller arranges fresh jasmine. A
                beautician answers customer calls between appointments.
              </p>

              <p
                className={`text-lg leading-9 ${
                  isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
                }`}
              >
                They already know how to run their business. What slows them
                down isn't the work—it is remembering every order, every payment
                and every promise made during a busy day.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="relative overflow-hidden rounded-[2rem]">
            <img
              src="../../../public/hero.jpg"
              alt="Traditional handloom weaving in Tamil Nadu"
              className="h-[620px] w-full object-cover transition-transform duration-700 hover:scale-105"
            />

            <div
              className={`absolute inset-0 ${
                isLight
                  ? "bg-gradient-to-t from-[#223843]/15 via-transparent to-transparent"
                  : "bg-gradient-to-t from-black/40 via-black/10 to-transparent"
              }`}
            />
          </div>
        </div>

        {/* Quote */}
        <div
          className={`mt-24 rounded-[2rem] border px-10 py-16 lg:px-16 ${
            isLight
              ? "border-[#223843]/10 bg-[#DBD3D8]/45"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="mx-auto flex max-w-5xl justify-center">
            <p className="mx-auto max-w-4xl text-center text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.04em]">
              Entrepreneurship shouldn't depend on spreadsheets, perfect
              English, or learning complicated software.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-24 grid gap-12 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-[#D77A61]">
              Speak naturally
            </p>

            <p
              className={`mt-5 leading-8 ${
                isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
              }`}
            >
              Record orders and payments in Tamil, Tanglish or English—just as
              conversations happen every day.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#D77A61]">Save time</p>

            <p
              className={`mt-5 leading-8 ${
                isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
              }`}
            >
              Spend less time searching through notebooks and more time serving
              customers, creating products and growing the business.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#D77A61]">
              Grow confidently
            </p>

            <p
              className={`mt-5 leading-8 ${
                isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
              }`}
            >
              Every conversation becomes a business record, helping women make
              better decisions without changing how they already work.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div
          className={`mt-24 border-t pt-12 ${
            isLight ? "border-[#223843]/10" : "border-white/10"
          }`}
        >
          <p className="max-w-4xl text-[clamp(2rem,4vw,3.8rem)] font-medium leading-[1.08] tracking-[-0.04em]">
            Because the future of entrepreneurship
            <br />
            in Tamil Nadu shouldn't start
            <br />
            with typing.
          </p>

          <p
            className={`mt-8 max-w-2xl text-lg leading-9 ${
              isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
            }`}
          >
            It should start with a conversation.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProblemStatement;
