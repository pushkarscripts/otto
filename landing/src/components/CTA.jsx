const CTA = () => {
  return (
    <section id="cta" className="bg-white/5 py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-text leading-tight max-w-2xl mx-auto">
          Open Source & Privacy First.
        </h2>
        <p className="text-lg text-primary-text/80 mt-4 mb-8 max-w-xl mx-auto">
          Otter is designed to be run locally, ensuring your data stays private. Spin it up in seconds using Docker.
        </p>
        <a href="https://github.com/pushkarscripts/otto" target="_blank" rel="noopener noreferrer" className="bg-accent text-white px-10 py-4 rounded-md font-semibold text-xl hover:opacity-90 transition-opacity">
          Run with Docker
        </a>
      </div>
    </section>
  );
};

export default CTA;