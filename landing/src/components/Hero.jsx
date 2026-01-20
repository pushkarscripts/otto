import heroIllustration from '../assets/hero-illustration.png';

const Hero = () => {
  return (
    <section className="container mx-auto px-6 py-24 md:py-22">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-text leading-tight">
            Understand Terms,<br />Instantly.
          </h1>
          <p className="text-lg md:text-xl text-primary-text/80 max-w-lg mx-auto md:mx-0">
            Otter helps you make sense of complicated Terms & Conditions. Our AI-powered extension classifies clauses so you can browse with confidence.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 pt-4">
            <a href="https://github.com/pushkarscripts/otto" target="_blank" rel="noopener noreferrer" className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:opacity-90 transition-opacity">
              View on GitHub
            </a>
            <a href="#how-it-works" className="bg-transparent border-2 border-border-color text-primary-text px-8 py-3 rounded-md font-semibold text-lg hover:bg-black/5 transition-colors">
              View Demo
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <img src={heroIllustration} alt="Otter reading terms" className="max-w-sm h-auto drop-shadow-xl" />
        </div>
      </div>
    </section>
  );
};

export default Hero;