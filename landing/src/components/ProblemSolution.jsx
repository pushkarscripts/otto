const ProblemSolution = () => {
  return (
    <section className="bg-white/5 py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-semibold">The Problem</h3>
            <p className="text-lg text-primary-text/80">
              Terms and Conditions are dense, full of legal jargon, and designed to be unreadable. Who has the time to decipher pages of text before signing up for a service?
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-semibold">Our Solution</h3>
            <p className="text-lg text-primary-text/80">
              Ollie reads the fine print for you. Our extension scans T&Cs and uses AI to classify each clause into simple categories, giving you an at-a-glance summary of what you’re agreeing to.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;