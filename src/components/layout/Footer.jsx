import { Link } from 'react-router-dom';
import { Layers, Github, Twitter, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', path: '/#features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Roadmap', path: '/roadmap' },
        { name: 'Status', path: '/status' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', path: '/docs' },
        { name: 'Blog', path: '/blog' },
        { name: 'Help Center', path: '/help' },
        { name: 'API', path: '/api' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms', path: '/terms' },
        { name: 'Privacy', path: '/privacy' },
        { name: 'Licenses', path: '/licenses' },
        { name: 'Security', path: '/security' },
      ],
    },
  ];
  
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-8 h-8 text-cyan-600" />
              <div>
                <div className="text-2xl font-bold">IP Escrow</div>
                <div className="text-xs text-slate-400">Trust-Free Collaboration</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              Secure blockchain-based platform for creative collaboration with automatic IP registration and revenue splits.
            </p>
            <p className="text-xs text-slate-500 mt-6">
              © {currentYear} IP Escrow. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition" />
              </a>
            </div>
          </div>
          
          {/* Columns 2-4 - Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-sm text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
