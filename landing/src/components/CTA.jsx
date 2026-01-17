const CTA = () => {
  return (
    <section id="cta" className="bg-white/5 py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-text leading-tight max-w-2xl mx-auto">
          Ready to Browse with Confidence?
        </h2>
        <p className="text-lg text-primary-text/80 mt-4 mb-8 max-w-xl mx-auto">
          Install Ollie today and take the first step towards understanding the web's fine print. It's free and always will be.
        </p>
        <a href="#cta-button" className="bg-accent text-white px-10 py-4 rounded-md font-semibold text-xl hover:opacity-90 transition-opacity">
          Add to Chrome for Free
        </a>
      </div>
    </section>
  );
};

export default CTA;