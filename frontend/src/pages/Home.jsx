import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Hero from "../components/home/HeroSectionHomePage";
import ProblemStatement from "../components/home/ProblemStatement";
import Solution from "../components/home/Solution";
import CTA from "../components/home/CTA";

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
