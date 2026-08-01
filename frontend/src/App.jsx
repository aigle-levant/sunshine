import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Speak from "./pages/Speak";
import NotFound from "./pages/NotFound";
import InstagramConnect from "./pages/InstagramConnect";

// /dashboard is a layout route: Dashboard loads the shared data once and the
// section below it renders into its <Outlet>. Adding a section means one entry
// in components/dashboard/navItems.js and one <Route> here.
import Dashboard from "./pages/Dashboard";
import ContentStudio from "./pages/dashboard/ContentStudio";
import Overview from "./pages/dashboard/Overview";
import Orders from "./pages/dashboard/Orders";
import Customers from "./pages/dashboard/Customers";
import Payments from "./pages/dashboard/Payments";
import Insights from "./pages/dashboard/Insights";
import Marketing from "./pages/dashboard/Marketing";
import MarketingStrategy from "./pages/dashboard/MarketingStrategy";
import Reports from "./pages/dashboard/Reports";
import WeeklyPlanner from "./pages/dashboard/WeeklyPlanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/speak" element={<Speak />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="payments" element={<Payments />} />
          <Route path="insights" element={<Insights />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="marketing-strategy" element={<MarketingStrategy />} />
          <Route path="content-studio" element={<ContentStudio />} />
          <Route path="instagram" element={<InstagramConnect />} />
          <Route path="reports" element={<Reports />} />
          <Route path="weekly-planner" element={<WeeklyPlanner />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
