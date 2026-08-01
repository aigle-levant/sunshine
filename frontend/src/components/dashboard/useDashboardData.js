// src/components/dashboard/useDashboardData.js
//
// How section routes reach the data the /dashboard layout route already loaded.
// Kept out of the layout file so that one only exports a component, and out of
// the sections so none of them re-read storage on navigation.

import { useOutletContext } from "react-router-dom";

export default function useDashboardData() {
  return useOutletContext();
}
