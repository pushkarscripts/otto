const Footer = () => {
  return (
    <footer className="border-t border-border-color">
      <div className="container mx-auto px-6 py-8 flex justify-between items-center text-sm">
        <p className="font-serif text-lg font-bold text-primary-text/80">
          Auto & Make
        </p>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-primary-text/60 hover:text-accent transition-colors">
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;