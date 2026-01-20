const Footer = () => {
  return (
    <footer className="border-t border-border-color">
      <div className="container mx-auto px-6 py-8 flex justify-between items-center text-sm">
        <p className="text-primary-text/60 italic max-w-xs">
          AI can make mistakes, always read important clauses yourself.
        </p>
        <div className="flex items-center space-x-4">
          <a href="https://github.com/pushkarscripts/otto" target="_blank" rel="noopener noreferrer" className="text-primary-text/60 hover:text-accent transition-colors">
            Open Source | MIT Licensed
          </a>
          <a href="https://github.com/pushkarscripts/otto" target="_blank" rel="noopener noreferrer" className="text-primary-text/60 hover:text-accent transition-colors font-bold">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;