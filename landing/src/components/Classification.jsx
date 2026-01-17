const Classification = () => {
  return (
    <section className="bg-white/5 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold">A Clearer Picture</h2>
          <p className="text-lg text-primary-text/70 mt-2">We classify terms into three distinct categories.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Safe Card */}
          <div className="bg-green-500/10 backdrop-blur-md border border-black/5 rounded-xl p-8 space-y-3">
            <h3 className="text-2xl font-serif font-semibold text-green-900">Safe</h3>
            <p className="text-green-900/80">
              These are standard, fair clauses that pose little to no risk. They typically cover basic service provisions and user rights.
            </p>
          </div>

          {/* Needs Attention Card */}
          <div className="bg-yellow-500/10 backdrop-blur-md border border-black/5 rounded-xl p-8 space-y-3">
            <h3 className="text-2xl font-serif font-semibold text-yellow-900">Needs Attention</h3>
            <p className="text-yellow-900/80">
              These clauses are not immediately dangerous, but may involve data sharing, marketing consents, or other non-standard terms you should be aware of.
            </p>
          </div>
          
          {/* Risky Card */}
          <div className="bg-red-500/10 backdrop-blur-md border border-black/5 rounded-xl p-8 space-y-3">
            <h3 className="text-2xl font-serif font-semibold text-red-900">Risky</h3>
            <p className="text-red-900/80">
              Proceed with caution. These clauses might waive significant rights, contain hidden fees, or grant excessive permissions.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Classification;