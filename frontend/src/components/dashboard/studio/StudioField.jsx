// src/components/dashboard/studio/StudioField.jsx
//
// The form primitives the generator card is built from. The repo has no shared
// Input/Select/Textarea components — each page has styled its own controls — so
// these three exist to keep this feature internally consistent, using the same
// border, radius and focus treatment as the rest of the dashboard.
//
// `label` + `htmlFor` are wired through `useId` so every control is labelled
// without callers inventing ids.

import { useId } from "react";

import useTheme from "../../../hooks/useTheme";

function useFieldStyles() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return {
    isLight,
    label: `text-[11px] font-semibold uppercase tracking-[0.18em] ${
      isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
    }`,
    control: `mt-2 w-full rounded-xl border px-4 py-3 text-[14.5px] outline-none transition-colors duration-300 focus-visible:border-[#D77A61] ${
      isLight
        ? "border-[#223843]/15 bg-[#EFF1F3]/80 placeholder-[#223843]/40"
        : "border-white/15 bg-white/5 placeholder-[#EFF1F3]/40"
    }`,
    hint: `mt-2 text-[12.5px] leading-5 ${
      isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
    }`,
  };
}

export function StudioSelect({ label, value, onChange, options, hint = null }) {
  const id = useId();

  const styles = useFieldStyles();

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.control}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

export function StudioInput({ label, value, onChange, placeholder, hint = null }) {
  const id = useId();

  const styles = useFieldStyles();

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={styles.control}
      />

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

export function StudioTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
  hint = null,
}) {
  const id = useId();

  const styles = useFieldStyles();

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${styles.control} resize-y leading-7`}
      />

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
