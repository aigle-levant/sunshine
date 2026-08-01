// src/components/dashboard/studio/GeneratorCard.jsx
//
// The form. Wrapped in the shared Panel so it sits in the same card shell as
// every other section of the dashboard, with the controls from StudioField.
//
// Submitting is a real form submit, so Enter works from any field — and the
// in-flight guard lives in the hook rather than relying on the disabled button.

import { AlertCircle, Loader2, Sparkles } from "lucide-react";

import Panel from "../Panel";
import ImageDropzone from "./ImageDropzone";
import { StudioInput, StudioSelect, StudioTextarea } from "./StudioField";
import { CONTENT_TYPES, LANGUAGES, TONES } from "./studioOptions";

function GeneratorCard({
  form,
  setField,
  image,
  imageError,
  onSelectImage,
  onRemoveImage,
  onGenerate,
  isGenerating,
  error,
  delay = 0,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onGenerate();
  };

  return (
    <Panel eyebrow="Generator" title="What should we write?" delay={delay}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <StudioSelect
          label="Content type"
          value={form.contentType}
          onChange={setField("contentType")}
          options={CONTENT_TYPES}
        />

        <StudioTextarea
          label="Prompt"
          value={form.prompt}
          onChange={setField("prompt")}
          placeholder="Describe your product or what you want to create..."
          rows={6}
        />

        <ImageDropzone
          image={image}
          error={imageError}
          onSelect={onSelectImage}
          onRemove={onRemoveImage}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <StudioSelect
            label="Tone"
            value={form.tone}
            onChange={setField("tone")}
            options={TONES}
          />

          <StudioSelect
            label="Language"
            value={form.language}
            onChange={setField("language")}
            options={LANGUAGES}
          />
        </div>

        <StudioInput
          label="Target audience"
          value={form.targetAudience}
          onChange={setField("targetAudience")}
          placeholder="College students"
          hint="Optional — who the copy should speak to."
        />

        {error && (
          <div className="flex gap-3 rounded-2xl border border-[#D77A61]/30 bg-[#D77A61]/10 px-5 py-4 text-[#C96B53] dark:text-[#E29883]">
            <AlertCircle size={17} strokeWidth={2} className="mt-0.5 shrink-0" />
            <p className="text-[13.5px] leading-6">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          aria-busy={isGenerating}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#D77A61] px-6 py-4 text-[14.5px] font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#C96B53] disabled:cursor-default disabled:hover:bg-[#D77A61]"
        >
          {isGenerating ? (
            <Loader2 size={17} strokeWidth={2} className="animate-spin" />
          ) : (
            <Sparkles size={17} strokeWidth={2} />
          )}
          {isGenerating ? "Generating…" : "Generate content"}
        </button>
      </form>
    </Panel>
  );
}

export default GeneratorCard;
