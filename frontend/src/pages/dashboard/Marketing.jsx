// src/pages/dashboard/Marketing.jsx
//
// Marketing, first version: a month of planned content, today's suggestion
// beside it, and the outreach messages that were already here. This page only
// composes — the plan lives in useContentPlan, and the editor is the one place
// an item can be changed, wherever it was opened from.
//
// It renders inside the /dashboard layout route, so the sidebar, header and
// search come from there and no route changes were needed.

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";

import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import MarketingPreview from "../../components/dashboard/MarketingPreview";
import useDashboardData from "../../components/dashboard/useDashboardData";
import AISuggestionPanel from "../../components/marketing/AISuggestionPanel";
import ContentCalendar from "../../components/marketing/ContentCalendar";
import ContentEditorModal from "../../components/marketing/ContentEditorModal";
import VoiceAssistantBar from "../../components/marketing/VoiceAssistantBar";
import { createItem } from "../../components/marketing/contentPlan";
import useContentPlan from "../../components/marketing/useContentPlan";

function Marketing() {
  const { data, isLoading } = useDashboardData();

  // Unfiltered on purpose. The header's search box narrows the order and
  // customer lists, but a month of planned content shouldn't empty out while
  // someone types — same reasoning as the campaign suggestions on Overview.
  const orders = data?.orders ?? [];
  const customers = data?.customers ?? [];

  // The plan is seeded from products that appear in real orders; the suggestion
  // panel is the part that also reads customers.
  const { byDate, saveItem, removeItem, reseed } = useContentPlan({ orders });

  // `{ item, isNew }`, or null when closed. One editor serves the calendar's
  // chips, the calendar's "+" buttons and the suggestion panel's Edit.
  const [editing, setEditing] = useState(null);

  const openNew = useCallback((date) => {
    setEditing({ item: createItem({ date }), isNew: true });
  }, []);

  const openExisting = useCallback((item) => {
    setEditing({ item, isNew: false });
  }, []);

  const openDraft = useCallback((item) => {
    setEditing({ item, isNew: true });
  }, []);

  const closeEditor = useCallback(() => setEditing(null), []);

  const handleSave = useCallback(
    (item) => {
      saveItem(item);
      setEditing(null);
    },
    [saveItem],
  );

  const handleDelete = useCallback(
    (id) => {
      removeItem(id);
      setEditing(null);
    },
    [removeItem],
  );

  if (isLoading) return <LoadingSkeleton variant="list" rows={6} />;

  return (
    <div className="flex flex-col gap-6">
      {/* The calendar takes twice the width: seven columns need it, and the
          suggestion beside it is a single column of short rows. */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ContentCalendar
          byDate={byDate}
          onOpenItem={openExisting}
          onAdd={openNew}
          onReseed={reseed}
        />

        {/* Follows the calendar down on wide screens, where the month is tall.
            `top-24` clears the sticky dashboard header rather than sliding under it. */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <AISuggestionPanel
            orders={orders}
            customers={customers}
            onEdit={openDraft}
            onPost={saveItem}
            delay={0.05}
          />
        </div>
      </div>

      <MarketingPreview
        orders={orders}
        customers={customers}
        limit={20}
        title="All suggestions"
        delay={0.1}
      />

      <VoiceAssistantBar delay={0.15} />

      <AnimatePresence>
        {editing && (
          // Keyed by item, which is what resets the form between days.
          <ContentEditorModal
            key={editing.item.id}
            item={editing.item}
            isNew={editing.isNew}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeEditor}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Marketing;
