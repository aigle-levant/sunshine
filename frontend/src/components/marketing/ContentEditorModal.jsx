// src/components/marketing/ContentEditorModal.jsx
//
// The editor behind every chip and every "+" in the calendar. It edits a copy
// and only hands it back on save, so cancelling really does discard.
//
// The parent keys this by item id, which is what resets the form when a
// different day is opened — no effect syncing props into state.

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, X } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { scriptFontStyle } from "../voice/language";
import { formatDayLabel } from "./calendarMonth";
import { AI_TOOLS, PLATFORMS, STATUSES } from "./contentOptions";
import { CONTENT_TYPE_LIST, getContentType, tint } from "./contentTypes";

function ContentEditorModal({ item, isNew = false, onSave, onDelete, onClose }) {
  const { theme } = useTheme();

  const fieldId = useId();

  const [draft, setDraft] = useState(item);

  const titleRef = useRef(null);

  const isLight = theme === "light";

  const set = (key) => (event) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }));

  // Escape, the page behind not scrolling, and focus coming back to whatever
  // opened this — the three things a dialog has to get right.
  useEffect(() => {
    const opener = document.activeElement;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);

    titleRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKeyDown);

      document.body.style.overflow = previousOverflow;

      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave?.({
      ...draft,
      // An untitled chip is unreadable in the grid, so the type stands in.
      title: draft.title.trim() || getContentType(draft.type).label,
    });
  };

  const label = `text-[11px] font-semibold uppercase tracking-[0.18em] ${
    isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
  }`;

  const field = `mt-2 w-full rounded-xl border px-4 py-3 text-[14.5px] outline-none transition-colors duration-300 focus-visible:border-[#D77A61] ${
    isLight
      ? "border-[#223843]/15 bg-[#EFF1F3]/80"
      : "border-white/15 bg-white/5"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-[#223843]/55 backdrop-blur-sm"
      />

      <motion.form
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${fieldId}-heading`}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border p-6 sm:m-6 sm:rounded-[2rem] sm:p-8 ${
          isLight
            ? "border-[#223843]/10 bg-[#EFF1F3] text-[#223843]"
            : "border-white/10 bg-[#223843] text-[#EFF1F3]"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
              {isNew ? "New content" : "Edit content"}
            </p>

            <h2
              id={`${fieldId}-heading`}
              className="mt-2 text-xl font-medium tracking-[-0.035em]"
            >
              {formatDayLabel(draft.date) || "Pick a date"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              isLight ? "hover:bg-[#DBD3D8]" : "hover:bg-white/10"
            }`}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <fieldset className="mt-7 border-0 p-0">
          <legend className={label}>Content type</legend>

          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CONTENT_TYPE_LIST.map((type) => {
              const Icon = type.icon;

              const isActive = draft.type === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    setDraft((current) => ({ ...current, type: type.id }))
                  }
                  style={
                    isActive
                      ? {
                          backgroundColor: tint(type.color, isLight ? 0.2 : 0.26),
                          borderColor: tint(type.color, 0.75),
                        }
                      : undefined
                  }
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
                    isActive
                      ? ""
                      : isLight
                        ? "border-[#223843]/12 hover:bg-[#DBD3D8]/60"
                        : "border-white/12 hover:bg-white/8"
                  }`}
                >
                  <Icon
                    size={15}
                    strokeWidth={2}
                    style={{ color: type.color }}
                    className="shrink-0"
                  />
                  {type.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6">
          <label htmlFor={`${fieldId}-title`} className={label}>
            Title
          </label>

          <input
            id={`${fieldId}-title`}
            ref={titleRef}
            value={draft.title}
            onChange={set("title")}
            placeholder="What is this content about?"
            style={scriptFontStyle(draft.title)}
            className={field}
          />
        </div>

        <div className="mt-6">
          <label htmlFor={`${fieldId}-caption`} className={label}>
            Caption
          </label>

          <textarea
            id={`${fieldId}-caption`}
            value={draft.caption}
            onChange={set("caption")}
            rows={4}
            placeholder="Write it in Tamil, English or both — whatever your customers read."
            style={scriptFontStyle(draft.caption)}
            className={`${field} resize-y leading-7`}
          />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${fieldId}-date`} className={label}>
              Date
            </label>

            <input
              id={`${fieldId}-date`}
              type="date"
              value={draft.date}
              onChange={set("date")}
              className={field}
            />
          </div>

          <div>
            <label htmlFor={`${fieldId}-platform`} className={label}>
              Platform
            </label>

            <select
              id={`${fieldId}-platform`}
              value={draft.platform}
              onChange={set("platform")}
              className={field}
            >
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor={`${fieldId}-tool`} className={label}>
            AI tool to draft it with
          </label>

          <select
            id={`${fieldId}-tool`}
            value={draft.tool}
            onChange={set("tool")}
            className={field}
          >
            {AI_TOOLS.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="mt-6 border-0 p-0">
          <legend className={label}>Status</legend>

          <div className="mt-2 flex gap-2">
            {STATUSES.map((status) => {
              const isActive = draft.status === status.id;

              return (
                <button
                  key={status.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    setDraft((current) => ({ ...current, status: status.id }))
                  }
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-300 ${
                    isActive
                      ? "border-[#D77A61] bg-[#D77A61]/15 text-[#D77A61]"
                      : isLight
                        ? "border-[#223843]/12 hover:bg-[#DBD3D8]/60"
                        : "border-white/12 hover:bg-white/8"
                  }`}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div
          className={`mt-8 flex flex-wrap items-center gap-2.5 border-t pt-6 ${
            isLight ? "border-[#223843]/10" : "border-white/10"
          }`}
        >
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-[#D77A61] px-6 py-3 text-[13px] font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#C96B53]"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`rounded-full border px-5 py-3 text-[13px] font-semibold transition-colors duration-300 ${
              isLight
                ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
                : "border-white/15 hover:bg-white/10"
            }`}
          >
            Cancel
          </button>

          {!isNew && (
            <button
              type="button"
              onClick={() => onDelete?.(draft.id)}
              className={`ml-auto flex items-center gap-2 rounded-full px-4 py-3 text-[13px] font-semibold text-[#C96B53] transition-colors duration-300 ${
                isLight ? "hover:bg-[#D77A61]/10" : "hover:bg-[#D77A61]/15"
              }`}
            >
              <Trash2 size={15} strokeWidth={2} />
              Delete
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
}

export default ContentEditorModal;
