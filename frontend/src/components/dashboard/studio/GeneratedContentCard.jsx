// src/components/dashboard/studio/GeneratedContentCard.jsx
//
// The result, plus the four things you'd want to do with it. Copy and Download
// are entirely local; Save Draft goes through the service. Regenerate re-runs
// the same form rather than editing it.
//
// Output text uses scriptFontStyle from voice/language.js, so a Tamil caption
// gets a proper Tamil face instead of the browser's fallback.

import { useEffect, useRef, useState } from "react";
import { Calendar, Check, Copy, Download, RefreshCw, Save } from "lucide-react";

import useTheme from "../../../hooks/useTheme";
import { scriptFontStyle } from "../../voice/language";
import Panel from "../Panel";

/** Everything the result holds, as the plain text Copy and Download produce. */
function asPlainText(content) {
  return [
    content.title,
    "",
    content.caption,
    "",
    content.hashtags?.length ? content.hashtags.map((tag) => `#${tag}`).join(" ") : null,
    content.cta ? `\nCall to action: ${content.cta}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n")
    .trim();
}

function slugify(text) {
  return (
    String(text ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "voicekart-content"
  );
}

function Section({ label, children, isLight }) {
  return (
    <div>
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
          isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
        }`}
      >
        {label}
      </p>

      <div className="mt-2">{children}</div>
    </div>
  );
}

function GeneratedContentCard({
  content,
  onRegenerate,
  onSave,
  isSaving,
  isSaved,
  onAddToPlanner,
  isAddedToPlanner,
  isGenerating,
  delay = 0,
}) {
  const { theme } = useTheme();

  const [copied, setCopied] = useState(false);

  const copiedTimer = useRef(null);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const isLight = theme === "light";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asPlainText(content));

      setCopied(true);
      copiedTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is permission-gated; failing silently beats an alert here.
    }
  };

  const handleDownload = () => {
    const blob = new Blob([asPlainText(content)], { type: "text/plain" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${slugify(content.title)}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const ghost = `flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors duration-300 disabled:cursor-default disabled:opacity-50 ${
    isLight
      ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
      : "border-white/15 hover:bg-white/10"
  }`;

  return (
    <Panel
      eyebrow={content.contentType}
      title="Generated content"
      delay={delay}
    >
      <div className="flex flex-col gap-5">
        <Section label="Title" isLight={isLight}>
          <p
            className="text-[19px] font-medium leading-7 tracking-[-0.025em]"
            style={scriptFontStyle(content.title)}
          >
            {content.title}
          </p>
        </Section>

        <Section label="Caption" isLight={isLight}>
          <p
            className={`whitespace-pre-line rounded-xl px-4 py-3.5 text-[14.5px] leading-7 ${
              isLight ? "bg-[#223843]/5" : "bg-black/20"
            }`}
            style={scriptFontStyle(content.caption)}
          >
            {content.caption}
          </p>
        </Section>

        {content.hashtags?.length > 0 && (
          <Section label="Suggested hashtags" isLight={isLight}>
            <ul className="flex flex-wrap gap-2">
              {content.hashtags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-[#D77A61]/12 px-3 py-1.5 text-[12.5px] font-semibold text-[#C96B53] dark:text-[#E29883]"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {content.cta && (
          <Section label="Call to action" isLight={isLight}>
            <p
              className="text-[14.5px] font-semibold"
              style={scriptFontStyle(content.cta)}
            >
              {content.cta}
            </p>
          </Section>
        )}

        <div
          className={`flex flex-wrap items-center gap-2.5 border-t pt-5 ${
            isLight ? "border-[#223843]/10" : "border-white/10"
          }`}
        >
          <button type="button" onClick={handleCopy} className={ghost}>
            {copied ? (
              <Check size={14} strokeWidth={2.4} />
            ) : (
              <Copy size={14} strokeWidth={2} />
            )}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={isGenerating}
            className={ghost}
          >
            <RefreshCw
              size={14}
              strokeWidth={2}
              className={isGenerating ? "animate-spin" : undefined}
            />
            Regenerate
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isSaved}
            className={ghost}
          >
            {isSaved ? (
              <Check size={14} strokeWidth={2.4} />
            ) : (
              <Save size={14} strokeWidth={2} />
            )}
            {isSaved ? "Saved" : isSaving ? "Saving…" : "Save draft"}
          </button>

          <button type="button" onClick={handleDownload} className={ghost}>
            <Download size={14} strokeWidth={2} />
            Download TXT
          </button>

          <button
            type="button"
            onClick={onAddToPlanner}
            disabled={isAddedToPlanner}
            className={ghost}
          >
            {isAddedToPlanner ? (
              <Check size={14} strokeWidth={2.4} />
            ) : (
              <Calendar size={14} strokeWidth={2} />
            )}
            {isAddedToPlanner ? "Added to Planner" : "Add to Planner"}
          </button>
        </div>

        {content.isPreview && (
          // Said plainly rather than passing sample copy off as model output.
          <p
            className={`text-[12px] leading-6 ${
              isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
            }`}
          >
            Sample copy — the model isn’t connected yet, so this is in English
            whichever language you pick. Your content type, tone, audience and
            prompt are already passed to <code>generateContent()</code>.
          </p>
        )}
      </div>
    </Panel>
  );
}

export default GeneratedContentCard;
