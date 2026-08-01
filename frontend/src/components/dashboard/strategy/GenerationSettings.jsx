// src/components/dashboard/strategy/GenerationSettings.jsx
//
// Section 5 — posting frequency, content goal (single-select radios) and an
// optional target-audience override.

import useTheme from "../../../hooks/useTheme";

export const POSTING_FREQUENCIES = ["Daily", "3x per week", "Weekly"];
export const CONTENT_GOALS = ["Sales", "Awareness", "Community", "Product Launch"];

function RadioGroup({ title, options, value, onChange, isLight }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">{title}</p>

      <div className="mt-3 flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-2.5 text-sm ${
              isLight ? "text-[#223843]/80" : "text-[#EFF1F3]/80"
            }`}
          >
            <input
              type="radio"
              name={title}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 accent-[#D77A61]"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function GenerationSettings({
  postingFrequency,
  onPostingFrequencyChange,
  contentGoal,
  onContentGoalChange,
  targetAudience,
  onTargetAudienceChange,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";
  const inputBg = isLight ? "bg-[#F5F5F5] border-[#223843]/15" : "bg-[#333] border-white/15";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <h3 className="text-lg font-bold">Generation Settings</h3>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <RadioGroup
          title="Posting Frequency"
          options={POSTING_FREQUENCIES}
          value={postingFrequency}
          onChange={onPostingFrequencyChange}
          isLight={isLight}
        />

        <RadioGroup
          title="Content Goal"
          options={CONTENT_GOALS}
          value={contentGoal}
          onChange={onContentGoalChange}
          isLight={isLight}
        />

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
            Target Audience
          </p>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => onTargetAudienceChange(e.target.value)}
            placeholder="Optional"
            className={`mt-3 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-300 ${inputBg} ${
              isLight ? "placeholder-[#223843]/40" : "placeholder-[#EFF1F3]/40"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default GenerationSettings;
