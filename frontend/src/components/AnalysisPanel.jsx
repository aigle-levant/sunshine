import useTheme from "../hooks/useTheme";

const INTENT_LABELS = {
  record_sale: "Record Sale",
  record_payment: "Record Payment",
  add_customer: "Add Customer",
  add_order: "Add Order",
  set_reminder: "Set Reminder",
  unknown: "Not sure yet",
};

function formatIntent(intent) {
  if (!intent) return null;

  return (
    INTENT_LABELS[intent] ??
    intent
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === "") return null;

  const value = typeof amount === "number" ? amount : Number(amount);

  if (Number.isNaN(value)) return String(amount);

  return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

function AnalysisPanel({ analysis, isLoading = false, error = null }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  if (!isLoading && !error && !analysis) return null;

  const cardBase = `rounded-[2rem] border p-8 transition-colors duration-500 ${
    isLight
      ? "border-[#223843]/10 bg-[#DBD3D8]/45"
      : "border-white/10 bg-white/5"
  }`;

  const mutedText = isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70";

  const placeholderText = isLight ? "text-[#223843]/35" : "text-[#EFF1F3]/35";

  const fields = [
    { label: "Intent", value: formatIntent(analysis?.intent) },
    { label: "Customer", value: analysis?.customer ?? null },
    { label: "Amount", value: formatAmount(analysis?.amount) },
    { label: "Summary", value: analysis?.summary ?? null, wide: true },
  ];

  return (
    <section
      className={`transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16">
        <div
          className={`border-t pt-14 pb-24 ${
            isLight ? "border-[#223843]/10" : "border-white/10"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
            {isLoading ? "Understanding…" : "Analysis"}
          </p>

          <h2 className="mt-5 text-[clamp(2.2rem,4vw,4rem)] font-medium leading-[0.95] tracking-[-0.05em]">
            {error ? "I couldn't quite catch that" : "Here's what I've found"}
          </h2>

          {error && (
            <p className={`mt-6 max-w-xl text-lg leading-9 ${mutedText}`}>
              {typeof error === "string"
                ? error
                : "Something went wrong while understanding your recording. Please try speaking again."}
            </p>
          )}

          {!error && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field) => (
                <div
                  key={field.label}
                  className={`${cardBase} ${
                    field.wide ? "sm:col-span-2 lg:col-span-3" : ""
                  }`}
                >
                  <p className="text-sm font-semibold text-[#D77A61]">
                    {field.label}
                  </p>

                  {isLoading ? (
                    <div
                      className={`mt-5 h-7 w-3/4 animate-pulse rounded-full ${
                        isLight ? "bg-[#DBD3D8]" : "bg-white/10"
                      }`}
                    />
                  ) : (
                    <p
                      className={`mt-4 leading-[1.5] ${
                        field.wide
                          ? `text-lg ${mutedText}`
                          : "text-[clamp(1.4rem,2vw,1.9rem)] tracking-[-0.02em]"
                      } ${field.value ? "" : placeholderText}`}
                    >
                      {field.value ?? "Not mentioned"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AnalysisPanel;
