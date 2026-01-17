const Trust = () => {
  return (
    <section id="privacy" className="container mx-auto px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold">Trust & Privacy</h2>
          <p className="text-lg text-primary-text/70 mt-2">Your privacy is paramount. Our promises are simple.</p>
        </div>
        <ul className="space-y-6">
          <li className="flex items-start">
            <span className="text-secondary-accent font-bold text-xl mr-4 mt-1">✔</span>
            <p className="text-lg text-primary-text/80">
              <span className="font-semibold text-primary-text">Local Processing:</span> All analysis happens on your computer. Your data never leaves your device.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-secondary-accent font-bold text-xl mr-4 mt-1">✔</span>
            <p className="text-lg text-primary-text/80">
              <span className="font-semibold text-primary-text">No Tracking:</span> We do not collect or store any personal information, browsing history, or T&C content.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-secondary-accent font-bold text-xl mr-4 mt-1">✔</span>
            <p className="text-lg text-primary-text/80">
              <span className="font-semibold text-primary-text">Open Source:</span> Our code is publicly available on GitHub for anyone to inspect and verify.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-secondary-accent font-bold text-xl mr-4 mt-1">✔</span>
            <p className="text-lg text-primary-text/80">
              <span className="font-semibold text-primary-text">Minimal Permissions:</span> The extension requests only the minimum permissions necessary to function.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Trust;