// src/components/SpeakHero.jsx
//
// Flow controller for voice mode.
//
// The hero stays where it was in the page; starting a session swaps in a
// full-screen experience driven entirely by local state — no routing, no
// reload. Stages: home → listening → processing → results.
//
// Input can be spoken (Tamil or English) or typed; both feed the same
// analysis, and the transcript is sent onward untranslated.

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic } from "lucide-react";

import useTheme from "../hooks/useTheme";
import useSpeechTranscript from "../hooks/useSpeechTranscript";
import { analyzeTranscript } from "../services/api";

import VoiceRecordingScreen from "./voice/VoiceRecordingScreen";
import ProcessingScreen from "./voice/ProcessingScreen";
import ResultsScreen from "./voice/ResultsScreen";
import LanguageToggle from "./voice/LanguageToggle";
import TextInputPanel from "./voice/TextInputPanel";
import { saveEntry, toExtraction } from "./voice/extraction";
import {
  ENGLISH,
  HEADLINE_CLASS,
  copyFor,
  loadLanguage,
  saveLanguage,
  scriptFontStyle,
  supportsAutoDetect,
} from "./voice/language";

// The processing stage is real work, but a sub-second flash reads as a glitch.
const MIN_PROCESSING_MS = 1300;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function SpeakHero({ disabled = false }) {
  const { theme } = useTheme();

  const [stage, setStage] = useState("home");
  const [language, setLanguage] = useState(loadLanguage);
  const [source, setSource] = useState("voice");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [extraction, setExtraction] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [hint, setHint] = useState(null);

  // Distinguishes "user backed out" from "recording ended" — both land in
  // the recogniser's onend, only one should trigger analysis.
  const cancelledRef = useRef(false);

  // Invalidates in-flight analysis when the user leaves or restarts.
  const runIdRef = useRef(0);

  const rawDataRef = useRef(null);

  const isLight = theme === "light";

  const copy = copyFor(language);

  /** Shared by spoken and typed input — the transcript is never translated. */
  const runAnalysis = useCallback(async (text) => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    setFinalTranscript(text);
    setAnalysisError(null);
    setExtraction(null);
    setStage("processing");

    const settled = analyzeTranscript(text).then(
      (data) => ({ data }),
      (requestError) => ({ requestError }),
    );

    const [result] = await Promise.all([settled, wait(MIN_PROCESSING_MS)]);

    // The user moved on while we were waiting.
    if (runId !== runIdRef.current) return;

    if (result.requestError) {
      rawDataRef.current = null;
      setAnalysisError(result.requestError.message);
    } else {
      rawDataRef.current = result.data;
      setExtraction(toExtraction(result.data));
    }

    setStage("results");
  }, []);

  const handleFinish = useCallback(
    (spokenText) => {
      if (cancelledRef.current) return;

      const text = spokenText?.trim();

      if (!text) {
        setStage("home");
        setHint(copy.noSpeech);
        return;
      }

      runAnalysis(text);
    },
    [copy, runAnalysis],
  );

  const {
    isSupported,
    isListening,
    transcript,
    error: speechError,
    start,
    stop,
    reset,
  } = useSpeechTranscript({ lang: language, onFinish: handleFinish });

  const handleStart = useCallback(() => {
    cancelledRef.current = false;
    runIdRef.current += 1;
    rawDataRef.current = null;

    setSource("voice");
    setHint(null);
    setAnalysisError(null);
    setExtraction(null);
    setFinalTranscript("");
    setStage("listening");

    reset();
    start();
  }, [reset, start]);

  const handleTextSubmit = useCallback(
    (text) => {
      cancelledRef.current = false;
      rawDataRef.current = null;

      setSource("text");
      setHint(null);

      runAnalysis(text);
    },
    [runAnalysis],
  );

  const handleExit = useCallback(() => {
    cancelledRef.current = true;
    runIdRef.current += 1;

    stop();
    reset();

    setStage("home");
    setFinalTranscript("");
    setExtraction(null);
    setAnalysisError(null);
    setHint(null);
  }, [reset, stop]);

  const handleLanguageChange = useCallback((code) => {
    setLanguage(code);
    saveLanguage(code);
    setHint(null);
  }, []);

  const handleSave = useCallback(
    (values) => {
      saveEntry({
        transcript: finalTranscript,
        language,
        source,
        values,
        data: rawDataRef.current,
        savedAt: new Date().toISOString(),
      });
    },
    [finalTranscript, language, source],
  );

  const isBlocked = disabled || !isSupported;

  const idleClasses = isLight
    ? "bg-[#223843] text-[#EFF1F3] hover:bg-[#D8B4A0] hover:text-[#223843]"
    : "bg-[#EFF1F3] text-[#223843] hover:bg-[#D8B4A0]";

  const notice = isSupported
    ? (hint ?? (stage === "home" ? speechError : null))
    : copy.unsupported;

  const home = copy.home;

  const isEnglish = language === ENGLISH;

  return (
    <>
      <section
        className={`transition-colors duration-500 ${
          isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
        }`}
      >
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 pt-32 pb-24 text-center md:px-12">
          <p
            lang={language}
            style={scriptFontStyle(home.eyebrow)}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]"
          >
            {home.eyebrow}
          </p>

          <h1
            lang={language}
            style={scriptFontStyle(home.headline.join(" "))}
            className={`mt-6 font-medium ${HEADLINE_CLASS[language]}`}
          >
            {home.headline.map((line, index) => {
              const isLast = index === home.headline.length - 1;

              return (
                <span key={line}>
                  {/* Latin faces have a true italic; Tamil would only get a
                      synthesised slant, so it stays upright. */}
                  <span
                    className={isLast && isEnglish ? "font-normal italic" : ""}
                  >
                    {line}
                  </span>
                  {!isLast && <br />}
                </span>
              );
            })}
          </h1>

          <p
            lang={language}
            style={scriptFontStyle(home.subtitle)}
            className={`mt-8 max-w-lg text-lg leading-9 ${
              isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
            }`}
          >
            {home.subtitle}
          </p>

          {/* No browser detects the spoken language on its own, so let the
              speaker choose before the recogniser starts. */}
          {!supportsAutoDetect() && (
            <div className="mt-10">
              <LanguageToggle
                value={language}
                onChange={handleLanguageChange}
                disabled={isBlocked}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleStart}
            disabled={isBlocked}
            className={`group mt-10 flex items-center gap-5 rounded-full py-2 pl-7 pr-2 text-lg font-semibold transition-all duration-300 ${
              isBlocked
                ? "cursor-not-allowed bg-[#DBD3D8] text-[#223843]/40"
                : `${idleClasses} hover:scale-[1.02]`
            }`}
          >
            <span lang={language} style={scriptFontStyle(home.start)}>
              {home.start}
            </span>

            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 ${
                isBlocked
                  ? "bg-[#EFF1F3] text-[#223843]/40"
                  : "bg-[#D77A61] text-[#EFF1F3]"
              }`}
            >
              <Mic size={21} strokeWidth={1.8} />
            </span>
          </button>

          {/* Typing is a first-class path, not a fallback for broken mics. */}
          <div className="mt-10 flex w-full max-w-xl items-center gap-5">
            <span
              className={`h-px flex-1 ${
                isLight ? "bg-[#223843]/12" : "bg-white/12"
              }`}
            />
            <span
              lang={language}
              style={scriptFontStyle(copy.or)}
              className={`text-sm ${
                isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
              }`}
            >
              {copy.or}
            </span>
            <span
              className={`h-px flex-1 ${
                isLight ? "bg-[#223843]/12" : "bg-white/12"
              }`}
            />
          </div>

          <div className="mt-8 flex w-full justify-center">
            <TextInputPanel
              onSubmit={handleTextSubmit}
              disabled={disabled}
              language={language}
            />
          </div>

          <AnimatePresence>
            {notice && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={scriptFontStyle(notice)}
                className={`mt-10 max-w-xl rounded-3xl border px-7 py-5 text-base leading-8 ${
                  isLight
                    ? "border-[#D77A61]/30 bg-[#D8B4A0]/25 text-[#223843]"
                    : "border-[#D77A61]/30 bg-white/5 text-[#EFF1F3]"
                }`}
              >
                {notice}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {stage === "listening" && (
          <VoiceRecordingScreen
            key="listening"
            transcript={transcript}
            isListening={isListening}
            error={speechError}
            language={language}
            onStop={stop}
            onCancel={handleExit}
          />
        )}

        {stage === "processing" && (
          <ProcessingScreen
            key="processing"
            transcript={finalTranscript}
            language={language}
          />
        )}

        {stage === "results" && (
          <ResultsScreen
            key="results"
            extraction={extraction}
            error={analysisError}
            transcript={finalTranscript}
            onSave={handleSave}
            onRetry={source === "text" ? handleExit : handleStart}
            retryLabel={source === "text" ? "New entry" : "Speak again"}
            onExit={handleExit}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default SpeakHero;
