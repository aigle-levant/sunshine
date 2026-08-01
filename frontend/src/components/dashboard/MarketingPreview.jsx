// src/components/dashboard/MarketingPreview.jsx
//
// Outreach suggestions. The backend returns no campaigns, so these are derived
// locally from real orders and balances — every one names a customer or product
// that actually exists in the data. Nothing is invented, and nothing is sent
// without the user pressing Send.

import { useMemo } from "react";
import { Link2, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

import EmptyState from "./EmptyState";
import Panel from "./Panel";
import SuggestedCampaign from "./SuggestedCampaign";
import { DASHBOARD_ROOT } from "./navItems";
import { formatCurrency } from "./dashboardData";

/** The item that appears in the most orders, if there's a clear one. */
function topProduct(orders) {
  const counts = new Map();

  for (const order of orders) {
    const item = String(order?.item ?? "").trim();

    if (!item) continue;

    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  return best?.[1] > 1 ? { item: best[0], count: best[1] } : null;
}

function buildCampaigns({ orders, customers }) {
  const campaigns = [];

  const owing = customers.filter((customer) => customer.outstanding > 0);

  if (owing.length) {
    const [first] = owing;

    campaigns.push({
      id: "collect",
      channel: "WhatsApp",
      title: `Payment reminder · ${owing.length} ${owing.length === 1 ? "customer" : "customers"}`,
      reason: `${formatCurrency(
        owing.reduce((total, customer) => total + customer.outstanding, 0),
      )} is still to be collected.`,
      message: `Vanakkam ${first.name}! Your balance of ${formatCurrency(
        first.outstanding,
      )} is pending. Please pay when convenient. Thank you!`,
    });
  }

  const popular = topProduct(orders);

  if (popular) {
    campaigns.push({
      id: "promote",
      channel: "WhatsApp",
      title: `Promote ${popular.item}`,
      reason: `${popular.item} appears in ${popular.count} orders — your strongest seller.`,
      message: `Fresh ${popular.item} available this week! Message me to reserve yours. 🌟`,
    });
  }

  const repeat = customers.filter((customer) => customer.orders > 1);

  if (repeat.length) {
    campaigns.push({
      id: "loyalty",
      channel: "SMS",
      title: `Thank ${repeat.length} repeat ${repeat.length === 1 ? "customer" : "customers"}`,
      reason: "Repeat buyers respond best to a small thank-you offer.",
      message: `Thank you for ordering again! Here's 10% off your next order. — VoiceKart`,
    });
  }

  return campaigns;
}

function MarketingPreview({
  orders = [],
  customers = [],
  limit = 2,
  title = "Suggested outreach",
  delay = 0,
  onboardingWhenEmpty = false,
}) {
  const navigate = useNavigate();

  const campaigns = useMemo(
    () => buildCampaigns({ orders, customers }),
    [orders, customers],
  );

  const visible = campaigns.slice(0, limit);

  // Hands off to the user's own WhatsApp — we never send on their behalf.
  const handleSend = (campaign) => {
    const text = encodeURIComponent(campaign?.message ?? "");

    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Panel
      eyebrow="Marketing"
      title={title}
      count={campaigns.length}
      actionLabel={campaigns.length > limit ? "View all" : null}
      actionTo={`${DASHBOARD_ROOT}/marketing`}
      delay={delay}
    >
      {visible.length ? (
        <ul className="flex flex-col gap-3">
          {visible.map((campaign, index) => (
            <SuggestedCampaign
              key={campaign.id}
              campaign={campaign}
              index={index}
              onSend={handleSend}
            />
          ))}
        </ul>
      ) : onboardingWhenEmpty ? (
        <EmptyState
          icon={Link2}
          compact
          title="Connect a platform to get started"
          description="Head to Brand Integration to connect Instagram and let VoiceKart AI learn your brand."
          actionLabel="Go to Brand Integration"
          onAction={() => navigate(`${DASHBOARD_ROOT}/brand-integration`)}
        />
      ) : (
        <EmptyState
          icon={Megaphone}
          compact
          title="No campaigns yet"
          description="Once there are orders and balances, suggestions appear here."
        />
      )}
    </Panel>
  );
}

export default MarketingPreview;
