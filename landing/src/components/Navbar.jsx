import logo from '../assets/logo.png';
import { Github, ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-orange-300/20 backdrop-blur-sm border-b border-black/5">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Otter logo" className="h-10 w-auto" />
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="hover:text-accent transition-colors">How it works</a>
            
            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-accent transition-colors">
                <span>Test Pages</span>
                <ChevronDown className="h-4 w-4" />
              </button>
                          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <a href="examples/safe.html" target="_blank" className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50">SafeMail (Low Risk)</a>
                            <a href="examples/medium.html" target="_blank" className="block px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50">StreamFlix (Medium Risk)</a>
                            <a href="examples/risky.html" target="_blank" className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50">SketchyLoans (High Risk)</a>
                          </div>            </div>

            <a href="#privacy" className="hover:text-accent transition-colors">Privacy</a>
          </div>

          <a href="https://github.com/pushkarscripts/otto" target="_blank" rel="noopener noreferrer" className="bg-accent text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity">
            Star on GitHub
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;