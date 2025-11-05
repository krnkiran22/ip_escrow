import { Link, useLocation } from 'react-router-dom';
import { Layers, Menu, X } from 'lucide-react';
import { useState } from 'react';
import WalletButton from '../WalletButton';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'How it Works', path: '/#how-it-works' },
    { name: 'Marketplace', path: '/marketplace' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          {/* Left - Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Layers className="w-8 h-8 text-cyan-600" />
            <div>
              <div className="text-2xl font-bold text-slate-900">IP Escrow</div>
              <div className="text-xs text-slate-600">Trust-Free Collaboration</div>
            </div>
          </Link>
          
          {/* Center - Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition ${
                  isActive(link.path) 
                    ? 'text-slate-900 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Right - Wallet Connect */}
          <div className="hidden md:flex items-center gap-3">
            <WalletButton />
            <Link 
              to="/#learn-more"
              className="border border-slate-900 text-slate-900 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Learn More
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-sm font-medium py-2 ${
                  isActive(link.path) 
                    ? 'text-slate-900 font-semibold' 
                    : 'text-slate-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <WalletButton />
              <Link 
                to="/#learn-more"
                className="block text-center border border-slate-900 text-slate-900 px-6 py-2.5 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
