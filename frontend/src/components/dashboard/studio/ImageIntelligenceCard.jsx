// src/components/dashboard/studio/ImageIntelligenceCard.jsx
//
// Shown only once an image is uploaded. The colours and the marketing angle are
// computed from the pixels in imageInsights.js; the detected product is the one
// value that needs a vision model, so it's labelled as a placeholder rather than
// presented as a finding.

import { Palette } from "lucide-react";

import useTheme from "../../../hooks/useTheme";
import Panel from "../Panel";

function Row({ label, children, isLight }) {
  return (
    <div>
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
          isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
        }`}
      >
        {label}
      </p>

      <div className="mt-2 text-[14px] leading-7">{children}</div>
    </div>
  );
}

function ImageIntelligenceCard({ image, delay = 0 }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <Panel eyebrow="Image intelligence" title="What we can see" delay={delay}>
      <div className="flex flex-col gap-5">
        <img
          src={image.previewUrl}
          alt={image.name}
          className="h-44 w-full rounded-xl object-cover"
        />

        <Row label="Detected product" isLight={isLight}>
          <span className="font-medium">{image.detectedProduct}</span>

          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              isLight ? "bg-[#223843]/8 text-[#223843]/55" : "bg-white/10 text-[#EFF1F3]/55"
            }`}
          >
            Placeholder
          </span>
        </Row>

        <Row label="Dominant colours" isLight={isLight}>
          {image.colors.length === 0 ? (
            // A fully transparent PNG — a logo, usually — has no colours to count.
            <p className={isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"}>
              None to read — this image is fully transparent.
            </p>
          ) : (
          <ul className="flex flex-wrap items-center gap-2.5">
            {image.colors.map((color) => (
              <li key={color} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: color }}
                  className={`h-7 w-7 rounded-lg border ${
                    isLight ? "border-[#223843]/12" : "border-white/15"
                  }`}
                />

                <span
                  className={`text-[12.5px] font-medium ${
                    isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"
                  }`}
                >
                  {color}
                </span>
              </li>
            ))}
          </ul>
          )}
        </Row>

        <Row label="Suggested marketing angle" isLight={isLight}>
          <p className="flex gap-2.5">
            <Palette size={16} strokeWidth={1.9} className="mt-1.5 shrink-0 text-[#D77A61]" />
            {image.marketingAngle}
          </p>
        </Row>

        <p
          className={`text-[12px] leading-6 ${
            isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
          }`}
        >
          Colours and the angle are read from the image on this device. Naming the
          product needs the vision model, which isn’t wired up yet.
        </p>
      </div>
    </Panel>
  );
}

export default ImageIntelligenceCard;
