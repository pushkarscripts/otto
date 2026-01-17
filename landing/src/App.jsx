import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import HowItWorks from './components/HowItWorks';
import Classification from './components/Classification';
import Trust from './components/Trust';
import OpenSource from './components/OpenSource';
import Contributors from './components/Contributors';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-background text-primary-text font-sans">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Classification />
        <Trust />
        <OpenSource />
        <Contributors />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;