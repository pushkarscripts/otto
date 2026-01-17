const OpenSource = () => {
  return (
    <section className="py-24 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-serif font-bold">Open to Open Source Contributions</h2>
        <p className="text-lg text-primary-text/70 mt-4 max-w-2xl mx-auto">
          Auto & Make is an open project. We welcome contributions from developers, designers, and researchers who want to make the web more transparent and user-friendly.
        </p>
        <div className="mt-8">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:opacity-90 transition-opacity">
            Contribute on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
