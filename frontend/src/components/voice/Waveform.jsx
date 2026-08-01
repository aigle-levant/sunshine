// src/components/voice/Waveform.jsx
//
// Live waveform for the listening screen. It taps the microphone through an
// AnalyserNode so the bars actually follow the speaker's voice; if that stream
// can't be opened it falls back to a gentle synthetic wave so the screen never
// looks frozen.
//
// Bar heights are written straight to the DOM inside a rAF loop rather than
// through React state — 44 bars at 60fps is not something to re-render.

import { useEffect, useRef } from "react";

const MIN_SCALE = 0.06;

function easeTowards(current, target, rate) {
  return current + (target - current) * rate;
}

function Waveform({ active = false, bars = 44, className = "" }) {
  const barRefs = useRef([]);

  useEffect(() => {
    const nodes = barRefs.current.filter(Boolean);

    if (!nodes.length) return undefined;

    let cancelled = false;
    let frame = 0;
    let stream = null;
    let audioContext = null;
    let analyser = null;
    let spectrum = null;

    const scales = new Array(bars).fill(MIN_SCALE);
    const middle = (bars - 1) / 2;

    // Taper the ends so the wave reads as a shape rather than a bar chart.
    const taper = scales.map((_, index) => {
      const distance = Math.abs(index - middle) / middle;

      return 0.35 + 0.65 * Math.cos((distance * Math.PI) / 2) ** 1.5;
    });

    async function connectMicrophone() {
      if (!active || !navigator.mediaDevices?.getUserMedia) return;

      try {
        const media = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }

        const AudioContextClass =
          window.AudioContext ?? window.webkitAudioContext;

        if (!AudioContextClass) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = media;
        audioContext = new AudioContextClass();

        const source = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.72;

        source.connect(analyser);

        spectrum = new Uint8Array(analyser.frequencyBinCount);
      } catch {
        // Permission denied or no device — the synthetic wave takes over.
        analyser = null;
      }
    }

    function render(time) {
      if (analyser && spectrum) analyser.getByteFrequencyData(spectrum);

      for (let index = 0; index < bars; index += 1) {
        const distance = Math.abs(index - middle) / middle;

        let target;

        if (analyser && spectrum) {
          // Low frequencies carry the voice, so keep them in the centre.
          const bin = Math.floor(distance * spectrum.length * 0.55);

          target = (spectrum[bin] / 255) * taper[index] * 1.35;
        } else if (active) {
          const wave =
            Math.sin(time / 260 + index * 0.55) * 0.5 +
            Math.sin(time / 410 + index * 0.24) * 0.5;

          target = (0.18 + Math.abs(wave) * 0.42) * taper[index];
        } else {
          target = MIN_SCALE;
        }

        scales[index] = easeTowards(
          scales[index],
          Math.max(MIN_SCALE, Math.min(1, target)),
          0.28,
        );

        const node = nodes[index];

        if (node) node.style.transform = `scaleY(${scales[index].toFixed(3)})`;
      }

      frame = requestAnimationFrame(render);
    }

    connectMicrophone();
    frame = requestAnimationFrame(render);

    return () => {
      cancelled = true;

      cancelAnimationFrame(frame);

      stream?.getTracks().forEach((track) => track.stop());
      audioContext?.close().catch(() => {});
    };
  }, [active, bars]);

  return (
    <div
      aria-hidden="true"
      className={`flex h-24 w-full items-center justify-center gap-0.75 sm:gap-1.5 ${className}`}
    >
      {Array.from({ length: bars }).map((_, index) => (
        <span
          key={index}
          ref={(node) => {
            barRefs.current[index] = node;
          }}
          className="h-full w-0.75 origin-center rounded-full bg-[#D77A61] sm:w-1"
          style={{ transform: `scaleY(${MIN_SCALE})`, willChange: "transform" }}
        />
      ))}
    </div>
  );
}

export default Waveform;
