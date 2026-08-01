// src/pages/dashboard/ContentStudio.jsx
//
// AI Content Studio. Composition only — the state lives in useContentStudio and
// every request goes through services/contentStudio.js.
//
// It renders inside the /dashboard layout route, so the sidebar, header and
// search come from DashboardLayout; this file owns the content area alone.

import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import Panel from "../../components/dashboard/Panel";
import GeneratedContentCard from "../../components/dashboard/studio/GeneratedContentCard";
import GeneratorCard from "../../components/dashboard/studio/GeneratorCard";
import ImageIntelligenceCard from "../../components/dashboard/studio/ImageIntelligenceCard";
import RecentGenerations from "../../components/dashboard/studio/RecentGenerations";
import useContentStudio from "../../components/dashboard/studio/useContentStudio";

/**
 * Before the first generation. Not the shared EmptyState: that one always offers
 * the mic and navigates to /speak, and there's nothing to act on here yet.
 */
function ResultPlaceholder({ isLight }) {
  return (
    <Panel eyebrow="Output" title="Generated content" delay={0.05}>
      <div
        className={`flex flex-col items-center gap-4 rounded-[1.5rem] border border-dashed px-6 py-14 text-center ${
          isLight ? "border-[#223843]/15" : "border-white/15"
        }`}
      >
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full ${
            isLight ? "bg-[#223843]/6 text-[#223843]/45" : "bg-white/8 text-[#EFF1F3]/45"
          }`}
        >
          <Sparkles size={23} strokeWidth={1.7} />
        </span>

        <div>
          <p className="text-base font-semibold">
            Your generated content will appear here.
          </p>

          <p
            className={`mx-auto mt-1.5 max-w-xs text-sm leading-6 ${
              isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"
            }`}
          >
            Describe your product, pick a tone and a language, and generate.
          </p>
        </div>
      </div>
    </Panel>
  );
}

function ContentStudio() {
  const { theme } = useTheme();

  const {
    form,
    setField,
    image,
    imageError,
    selectImage,
    clearImage,
    result,
    isGenerating,
    error,
    generate,
    save,
    isSaving,
    savedId,
    history,
    removeFromHistory,
    openFromHistory,
  } = useContentStudio();

  const isLight = theme === "light";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
          AI Content Studio
        </p>

        <h2 className="mt-2 max-w-3xl text-xl font-medium leading-8 tracking-[-0.035em]">
          Create engaging captions, social media posts, product descriptions and
          promotional content in seconds.
        </h2>
      </div>

      {/* Form on the left, output beside it on wide screens and stacked below on
          anything narrower. */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:items-start">
        <GeneratorCard
          form={form}
          setField={setField}
          image={image}
          imageError={imageError}
          onSelectImage={selectImage}
          onRemoveImage={clearImage}
          onGenerate={generate}
          isGenerating={isGenerating}
          error={error}
        />

        <div className="flex flex-col gap-6">
          {isGenerating && !result ? (
            <LoadingSkeleton variant="list" rows={4} />
          ) : result ? (
            <GeneratedContentCard
              content={result}
              onRegenerate={generate}
              onSave={save}
              isSaving={isSaving}
              isSaved={savedId === result.id}
              isGenerating={isGenerating}
              delay={0.05}
            />
          ) : (
            <ResultPlaceholder isLight={isLight} />
          )}

          <AnimatePresence>
            {image && <ImageIntelligenceCard image={image} delay={0.1} />}
          </AnimatePresence>
        </div>
      </div>

      <RecentGenerations
        history={history}
        onOpen={openFromHistory}
        onDelete={removeFromHistory}
        delay={0.15}
      />
    </div>
  );
}

export default ContentStudio;
