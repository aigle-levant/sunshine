import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SpeakHero from "../components/SpeakHero";

import useTheme from "../hooks/useTheme";

/**
 * Shell for voice mode. SpeakHero is the flow controller — it owns the
 * home → listening → processing → results stages, the speech recognition and
 * the analysis call, and renders the immersive stages as full-screen overlays.
 */
function Speak() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3]" : "bg-[#223843]"
      }`}
    >
      <Navbar />

      <main>
        <SpeakHero />
      </main>

      <Footer />
    </div>
  );
}

export default Speak;
