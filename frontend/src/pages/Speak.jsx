import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SpeakHero from "../components/SpeakHero";
import ListeningPanel from "../components/ListeningPanel";
import AnalysisPanel from "../components/AnalysisPanel";
import ContinueButton from "../components/ContinueButton";

import useTheme from "../hooks/useTheme";
import useSpeechTranscript from "../hooks/useSpeechTranscript";
import { analyzeTranscript } from "../services/api";

const LAST_ANALYSIS_KEY = "voicekart:last-analysis";
const HISTORY_KEY = "voicekart:entries";
const MAX_HISTORY = 20;

function saveEntry(entry) {
  try {
    localStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify(entry));

    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    const next = [entry, ...(Array.isArray(history) ? history : [])].slice(
      0,
      MAX_HISTORY,
    );

    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (storageError) {
    // Private mode or a full quota shouldn't break the flow.
    console.warn("Could not save analysis locally:", storageError);
  }
}

function sumAmounts(values) {
  const numbers = values
    .map((value) => (typeof value === "number" ? value : Number(value)))
    .filter((value) => Number.isFinite(value));

  return numbers.length
    ? numbers.reduce((total, value) => total + value, 0)
    : null;
}

function orderValue(order) {
  const price = Number(order?.price);

  if (!Number.isFinite(price)) return null;

  const quantity = Number(order?.quantity);

  return Number.isFinite(quantity) ? price * quantity : price;
}

/**
 * Claude returns full lists (customers/orders/payments/tasks/insights).
 * AnalysisPanel shows the headline of that: intent, customer, amount, summary.
 */
function toHighlights(data) {
  if (!data) return null;

  const customers = data.customers ?? [];
  const orders = data.orders ?? [];
  const payments = data.payments ?? [];
  const tasks = data.tasks ?? [];

  let intent = "unknown";

  if (orders.length && payments.length) intent = "record_sale";
  else if (orders.length) intent = "add_order";
  else if (payments.length) intent = "record_payment";
  else if (customers.length) intent = "add_customer";
  else if (tasks.length) intent = "set_reminder";

  const names = [
    ...new Set(
      [
        ...customers.map((customer) => customer?.name),
        ...orders.map((order) => order?.customer),
        ...payments.map((payment) => payment?.customer),
      ].filter(Boolean),
    ),
  ];

  const customer = names.length
    ? names.length > 1
      ? `${names[0]} +${names.length - 1} more`
      : names[0]
    : null;

  // Money actually received wins; otherwise fall back to what was ordered.
  const amount =
    sumAmounts(payments.map((payment) => payment?.amount)) ??
    sumAmounts(orders.map(orderValue));

  return {
    intent,
    customer,
    amount,
    summary: data.summary || null,
  };
}

function Speak() {
  const navigate = useNavigate();

  const { theme } = useTheme();

  const isLight = theme === "light";

  const [status, setStatus] = useState("idle"); // idle | analyzing | ready | error
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const handleFinish = useCallback(async (finalTranscript) => {
    if (!finalTranscript?.trim()) {
      setStatus("idle");
      return;
    }

    setStatus("analyzing");
    setAnalysisError(null);

    try {
      const data = await analyzeTranscript(finalTranscript);

      saveEntry({
        transcript: finalTranscript,
        data,
        savedAt: new Date().toISOString(),
      });

      setAnalysis(data);
      setStatus("ready");
    } catch (requestError) {
      setAnalysisError(requestError.message);
      setStatus("error");
    }
  }, []);

  const {
    isSupported,
    isListening,
    transcript,
    error: speechError,
    start,
    stop,
    reset,
  } = useSpeechTranscript({ onFinish: handleFinish });

  const handleStart = () => {
    setAnalysis(null);
    setAnalysisError(null);
    setStatus("idle");

    reset();
    start();
  };

  const handleContinue = () => navigate("/dashboard");

  const isAnalyzing = status === "analyzing";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3]" : "bg-[#223843]"
      }`}
    >
      <Navbar />

      <main>
        <SpeakHero
          onStart={handleStart}
          isRecording={isListening}
          disabled={!isSupported || isAnalyzing}
        />

        {(!isSupported || speechError) && (
          <div className="mx-auto max-w-[1600px] px-6 pb-16 md:px-12 lg:px-16">
            <p
              className={`max-w-xl rounded-3xl border px-7 py-5 text-base leading-8 ${
                isLight
                  ? "border-[#D77A61]/30 bg-[#D8B4A0]/25 text-[#223843]"
                  : "border-[#D77A61]/30 bg-white/5 text-[#EFF1F3]"
              }`}
            >
              {isSupported
                ? speechError
                : "This browser can't listen yet. Please use Chrome or Edge to speak to VoiceKart AI."}
            </p>
          </div>
        )}

        <ListeningPanel
          isRecording={isListening}
          transcript={transcript}
          onStop={stop}
        />

        <AnalysisPanel
          analysis={toHighlights(analysis)}
          isLoading={isAnalyzing}
          error={analysisError}
        />

        {status === "ready" && (
          <div className="mx-auto flex max-w-[1600px] justify-end px-6 pb-32 md:px-12 lg:px-16">
            <ContinueButton onClick={handleContinue} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Speak;
