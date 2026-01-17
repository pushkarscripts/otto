const Hero = () => {
  return (
    <section className="container mx-auto px-6 py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-text leading-tight">
            Understand Terms,<br />Instantly.
          </h1>
          <p className="text-lg md:text-xl text-primary-text/80 max-w-lg mx-auto md:mx-0">
            Auto & Make helps you make sense of complicated Terms & Conditions. Our AI-powered extension classifies clauses so you can browse with confidence.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 pt-4">
            <a href="#cta" className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:opacity-90 transition-opacity">
              Add to Chrome
            </a>
            <a href="#how-it-works" className="bg-transparent border-2 border-border-color text-primary-text px-8 py-3 rounded-md font-semibold text-lg hover:bg-black/5 transition-colors">
              How it works
            </a>
          </div>
        </div>
        <div>
          {/* Empty space for illustration-friendly feel */}
        </div>
      </div>
    </section>
  );
};

export default Hero;