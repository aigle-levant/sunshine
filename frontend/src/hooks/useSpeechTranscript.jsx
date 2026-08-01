// src/hooks/useSpeechTranscript.jsx
//
// Live speech-to-text via the browser's Web Speech API.
// The backend expects text, so the transcript is produced here rather than
// by uploading audio.

import { useCallback, useEffect, useRef, useState } from "react";

const SpeechRecognition =
  typeof window === "undefined"
    ? null
    : (window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null);

const ERROR_MESSAGES = {
  "not-allowed":
    "Microphone access was blocked. Allow it in your browser and try again.",
  "service-not-allowed":
    "Microphone access was blocked. Allow it in your browser and try again.",
  "no-speech": "I didn't hear anything. Try speaking again.",
  network: "Speech recognition needs an internet connection.",
  "audio-capture": "No microphone was found.",
};

export default function useSpeechTranscript({ lang = "en-IN", onFinish } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const onFinishRef = useRef(onFinish);

  // Keep the latest callback without restarting recognition.
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const isSupported = Boolean(SpeechRecognition);

  const start = useCallback(() => {
    if (!isSupported || recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    finalTranscriptRef.current = "";
    setTranscript("");
    setError(null);

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];

        if (result.isFinal) {
          finalTranscriptRef.current =
            `${finalTranscriptRef.current} ${result[0].transcript}`.trim();
        } else {
          interim += result[0].transcript;
        }
      }

      setTranscript(`${finalTranscriptRef.current} ${interim}`.trim());
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") return;

      setError(
        ERROR_MESSAGES[event.error] ??
          "Something went wrong while listening. Please try again.",
      );
    };

    // Fires on manual stop and on browser auto-stop (long silence), so this is
    // the single place that hands the final transcript onward.
    recognition.onend = () => {
      recognitionRef.current = null;

      setIsListening(false);
      setTranscript(finalTranscriptRef.current);

      onFinishRef.current?.(finalTranscriptRef.current);
    };

    recognition.start();

    recognitionRef.current = recognition;
    setIsListening(true);
  }, [isSupported, lang]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    finalTranscriptRef.current = "";
    setTranscript("");
    setError(null);
  }, []);

  // Abort (rather than stop) on unmount so onFinish doesn't fire after teardown.
  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current;

      if (recognition) {
        recognition.onend = null;
        recognition.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    start,
    stop,
    reset,
  };
}
