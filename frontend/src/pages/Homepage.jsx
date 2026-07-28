import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/HeroSectionHomePage";
import ProblemStatement from "../components/ProblemStatement";
import Solution from "../components/Solution";
import CTA from "../components/CTA";

function Home() {
  return (
    <div>
      <Navbar />

      <main>
        {/* Hero */}
        <Hero/>

        {/* Business pulse */}
        <ProblemStatement/>

        {/* Speak */}
        <Solution/>

        {/* Orders */}
        <CTA/>

        {/* Product demo */}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
