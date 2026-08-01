import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Speak from "./pages/Speak";
// import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/speak" element={<Speak />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
