// src/components/dashboard/studio/ImageDropzone.jsx
//
// Drag-and-drop image upload. Nothing in the repo did file input before this, so
// it's built here rather than pulled from a dependency.
//
// The drop target is a label wrapping a real file input: that keeps click,
// keyboard and drop on one control, and screen readers announce it as the file
// picker it is.

import { useRef, useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";

import useTheme from "../../../hooks/useTheme";
import { IMAGE_ACCEPT, MAX_IMAGE_BYTES } from "./studioOptions";

function describe(bytes) {
  const mb = bytes / (1024 * 1024);

  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function ImageDropzone({ image, error, onSelect, onRemove }) {
  const { theme } = useTheme();

  const [isOver, setIsOver] = useState(false);

  const inputRef = useRef(null);

  const isLight = theme === "light";

  const label = `text-[11px] font-semibold uppercase tracking-[0.18em] ${
    isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
  }`;

  const take = (files) => {
    const file = files?.[0];

    if (file) onSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);
    take(event.dataTransfer?.files);
  };

  if (image) {
    return (
      <div>
        <p className={label}>Image</p>

        <div
          className={`mt-2 flex flex-wrap items-center gap-4 rounded-xl border p-3 ${
            isLight ? "border-[#223843]/15 bg-[#EFF1F3]/80" : "border-white/15 bg-white/5"
          }`}
        >
          <img
            src={image.previewUrl}
            alt={image.name}
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold">{image.name}</p>

            <p
              className={`mt-1 text-[12.5px] ${
                isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
              }`}
            >
              {image.width} × {image.height}
              {image.size ? ` · ${describe(image.size)}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Replace reuses the same input, so the picker behaves identically. */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-300 ${
                isLight
                  ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
                  : "border-white/15 hover:bg-white/10"
              }`}
            >
              Replace
            </button>

            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove image"
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[#C96B53] transition-colors duration-300 ${
                isLight ? "hover:bg-[#223843]/8" : "hover:bg-white/10"
              }`}
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          onChange={(event) => {
            take(event.target.files);
            // Cleared so picking the same file twice still fires a change.
            event.target.value = "";
          }}
          className="hidden"
        />

        {error && <p className="mt-2 text-[12.5px] text-[#C96B53]">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <p className={label}>Upload image</p>

      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={handleDrop}
        className={`mt-2 flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-9 text-center transition-colors duration-300 ${
          isOver
            ? "border-[#D77A61] bg-[#D77A61]/8"
            : isLight
              ? "border-[#223843]/20 hover:bg-[#DBD3D8]/40"
              : "border-white/20 hover:bg-white/5"
        }`}
      >
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isLight ? "bg-[#D77A61]/12" : "bg-[#D77A61]/20"
          } text-[#D77A61]`}
        >
          {isOver ? (
            <UploadCloud size={21} strokeWidth={1.9} />
          ) : (
            <ImagePlus size={21} strokeWidth={1.9} />
          )}
        </span>

        <span className="text-[14px] font-semibold">
          {isOver ? "Drop the image here" : "Drag an image here, or click to choose"}
        </span>

        <span
          className={`text-[12.5px] ${
            isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
          }`}
        >
          JPG, JPEG or PNG · up to {Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB
        </span>

        <input
          type="file"
          accept={IMAGE_ACCEPT}
          onChange={(event) => {
            take(event.target.files);
            event.target.value = "";
          }}
          className="sr-only"
        />
      </label>

      {error && <p className="mt-2 text-[12.5px] text-[#C96B53]">{error}</p>}
    </div>
  );
}

export default ImageDropzone;
