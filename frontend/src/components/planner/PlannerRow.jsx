// src/components/planner/PlannerRow.jsx
//
// One row of the planner, in one of two states. They're separate components so
// the editor mounts fresh when editing starts: its draft state is seeded from
// the row it was opened on, with no effect syncing props into state, and
// cancelling discards by simply unmounting.
//
// Only the row being edited shows inputs — every other row stays plain text, so
// the table reads as a table rather than as a page of form controls.

import { useState } from "react";
import {
  Ban,
  Camera,
  Check,
  Image as ImageIcon,
  MessageCircle,
  Pencil,
  Trash2,
  Video,
  X,
} from "lucide-react";

import useTheme from "../../hooks/useTheme";
import StatusBadge from "./StatusBadge";
import {
  DAYS,
  MEDIA_TYPES,
  PLATFORMS,
  STATUSES,
  coerceContentType,
  dateForDay,
  mediaType,
  shortDateFor,
  timeLabel,
  typesFor,
} from "./plannerModel";

/**
 * Each glyph branches to a literal element rather than resolving a component
 * from data — clearer to read, and it keeps component identity static.
 *
 * lucide-react ships no Instagram glyph at all, so Instagram borrows Camera.
 */
function PlatformGlyph({ platform }) {
  const shared = { size: 14, strokeWidth: 1.9, className: "shrink-0 text-[#D77A61]" };

  if (platform === "WhatsApp") return <MessageCircle {...shared} />;

  return <Camera {...shared} />;
}

function MediaGlyph({ type }) {
  const shared = { size: 14, strokeWidth: 1.9, className: "shrink-0 opacity-55" };

  if (type === "image") return <ImageIcon {...shared} />;
  if (type === "video") return <Video {...shared} />;

  return <Ban {...shared} />;
}

/**
 * The Day column stays put while the rest scrolls sideways, so it needs an
 * opaque background of its own — the row's own tint is translucent and the
 * cells underneath would show through.
 */
const STICKY_DAY =
  "sticky left-0 z-10 bg-[#E6E4E7] group-hover:bg-[#DEDCE0] dark:bg-[#2D424C] dark:group-hover:bg-[#354A55]";

function iconButton(isLight) {
  return `flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
    isLight ? "hover:bg-[#223843]/8" : "hover:bg-white/10"
  }`;
}

function MediaCell({ row }) {
  const [broken, setBroken] = useState(false);

  const showThumb = row.mediaType === "image" && row.mediaUrl && !broken;

  return (
    <span className="flex items-center gap-2">
      {showThumb ? (
        // A small thumbnail, never a media card. A URL that won't load falls
        // back to the type icon instead of a broken-image glyph.
        <img
          src={row.mediaUrl}
          alt=""
          onError={() => setBroken(true)}
          className="h-7 w-7 shrink-0 rounded-md object-cover"
        />
      ) : (
        <MediaGlyph type={row.mediaType} />
      )}

      <span className="whitespace-nowrap">{mediaType(row.mediaType).label}</span>
    </span>
  );
}

function ViewRow({ row, onEdit, onDelete, isLight, muted }) {
  return (
    <>
      <th
        scope="row"
        className={`${STICKY_DAY} px-4 py-3 text-left align-top text-[13.5px] font-semibold`}
      >
        {row.day}
      </th>

      <td className={`px-4 py-3 align-top text-[13.5px] whitespace-nowrap ${muted}`}>
        {shortDateFor(row.date) || "—"}
      </td>

      <td className="px-4 py-3 align-top text-[13.5px]">
        <span className="flex items-center gap-2 whitespace-nowrap">
          <PlatformGlyph platform={row.platform} />
          {row.platform}
        </span>
      </td>

      <td className="px-4 py-3 align-top text-[13.5px]">
        <span
          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11.5px] font-semibold ${
            isLight ? "border-[#223843]/12" : "border-white/12"
          }`}
        >
          {row.contentType}
        </span>
      </td>

      <td className="px-4 py-3 align-top text-[13.5px] font-medium">
        {row.title ? (
          <span className="line-clamp-2">{row.title}</span>
        ) : (
          <span className={muted}>Untitled</span>
        )}
      </td>

      <td className={`px-4 py-3 align-top text-[13px] leading-6 ${muted}`}>
        {row.caption ? (
          // Truncated to two lines by default; the full text is in the editor
          // and in the tooltip, so nothing is unreachable.
          <span className="line-clamp-2 whitespace-pre-line" title={row.caption}>
            {row.caption}
          </span>
        ) : (
          "—"
        )}
      </td>

      <td className="px-4 py-3 align-top text-[13px]">
        <MediaCell row={row} />
      </td>

      <td className="px-4 py-3 align-top text-[13.5px] whitespace-nowrap">
        {timeLabel(row.scheduledTime)}
      </td>

      <td className="px-4 py-3 align-top">
        <StatusBadge status={row.status} />
      </td>

      <td className="px-4 py-3 align-top">
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(row.id)}
            aria-label={`Edit ${row.day} content`}
            title="Edit"
            className={iconButton(isLight)}
          >
            <Pencil size={15} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(row.id)}
            aria-label={`Delete ${row.day} content`}
            title="Delete"
            className={`${iconButton(isLight)} text-[#C96B53]`}
          >
            <Trash2 size={15} strokeWidth={1.9} />
          </button>
        </span>
      </td>
    </>
  );
}

function EditRow({ row, weekStart, onSave, onCancel, isLight, muted }) {
  const [draft, setDraft] = useState(row);

  const field = `w-full rounded-lg border px-2.5 py-1.5 text-[13px] outline-none transition-colors duration-200 focus-visible:border-[#D77A61] ${
    isLight ? "border-[#223843]/15 bg-[#EFF1F3]" : "border-white/15 bg-white/5"
  }`;

  const set = (key) => (event) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }));

  /** Moving a row to another day moves its date with it. */
  const setDay = (event) => {
    const day = event.target.value;

    setDraft((current) => ({ ...current, day, date: dateForDay(weekStart, day) }));
  };

  /** WhatsApp has no "Reel", so the content type follows the platform. */
  const setPlatform = (event) => {
    const platform = event.target.value;

    setDraft((current) => ({
      ...current,
      platform,
      contentType: coerceContentType(platform, current.contentType),
    }));
  };

  return (
    <>
      <th scope="row" className={`${STICKY_DAY} px-2.5 py-3 text-left align-top`}>
        <select value={draft.day} onChange={setDay} aria-label="Day" className={field}>
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </th>

      <td className={`px-2.5 py-3 align-top text-[13.5px] whitespace-nowrap ${muted}`}>
        {shortDateFor(draft.date) || "—"}
      </td>

      <td className="px-2.5 py-3 align-top">
        <select
          value={draft.platform}
          onChange={setPlatform}
          aria-label="Platform"
          className={field}
        >
          {PLATFORMS.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </td>

      <td className="px-2.5 py-3 align-top">
        <select
          value={draft.contentType}
          onChange={set("contentType")}
          aria-label="Content type"
          className={field}
        >
          {typesFor(draft.platform).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </td>

      <td className="px-2.5 py-3 align-top">
        {/* Autofocused because Add Content drops straight into this row. */}
        <input
          value={draft.title}
          onChange={set("title")}
          aria-label="Topic or title"
          placeholder="Topic / title"
          autoFocus
          className={field}
        />
      </td>

      <td className="px-2.5 py-3 align-top">
        <textarea
          value={draft.caption}
          onChange={set("caption")}
          aria-label="Caption"
          placeholder="Write the caption…"
          rows={3}
          className={`${field} resize-y leading-6`}
        />
      </td>

      <td className="px-2.5 py-3 align-top">
        <select
          value={draft.mediaType}
          onChange={set("mediaType")}
          aria-label="Media type"
          className={field}
        >
          {MEDIA_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        {draft.mediaType !== "none" && (
          <input
            value={draft.mediaUrl}
            onChange={set("mediaUrl")}
            aria-label="Media URL"
            placeholder="Paste a URL"
            className={`${field} mt-2`}
          />
        )}
      </td>

      <td className="px-2.5 py-3 align-top">
        <input
          type="time"
          value={draft.scheduledTime}
          onChange={set("scheduledTime")}
          aria-label="Scheduled time"
          className={field}
        />
      </td>

      <td className="px-2.5 py-3 align-top">
        <select
          value={draft.status}
          onChange={set("status")}
          aria-label="Status"
          className={field}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>

      <td className="px-2.5 py-3 align-top">
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSave(draft)}
            aria-label="Save row"
            title="Save"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D77A61] text-[#EFF1F3] transition-colors duration-200 hover:bg-[#C96B53]"
          >
            <Check size={15} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel editing"
            title="Cancel"
            className={iconButton(isLight)}
          >
            <X size={15} strokeWidth={2} />
          </button>
        </span>
      </td>
    </>
  );
}

function PlannerRow({ row, weekStart, isEditing, onEdit, onSave, onCancel, onDelete }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const muted = isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55";

  return (
    <tr
      className={`group border-t transition-colors duration-200 ${
        isLight ? "border-[#223843]/8" : "border-white/8"
      } ${
        isEditing
          ? isLight
            ? "bg-[#DBD3D8]/40"
            : "bg-white/[0.07]"
          : isLight
            ? "hover:bg-[#223843]/[0.03]"
            : "hover:bg-white/[0.03]"
      }`}
    >
      {isEditing ? (
        <EditRow
          row={row}
          weekStart={weekStart}
          onSave={onSave}
          onCancel={onCancel}
          isLight={isLight}
          muted={muted}
        />
      ) : (
        <ViewRow
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
          isLight={isLight}
          muted={muted}
        />
      )}
    </tr>
  );
}

export default PlannerRow;
