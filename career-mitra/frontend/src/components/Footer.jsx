import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-surface-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm mb-3">
              <span className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center text-white text-2xs font-bold">
                CM
              </span>
              Career Mitra
            </div>
            <p className="text-xs text-ink-600 leading-relaxed max-w-[200px]">
              Connecting students with industry mentors for personalized career guidance.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-ink-800 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { label: 'Find Mentors', href: '/mentors' },
                { label: 'Become a Mentor', href: '/signup' },
                { label: 'How It Works', href: '/' },
                { label: 'Pricing', href: '/' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-ink-600 hover:text-ink-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-ink-800 uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Press'].map((label) => (
                <li key={label}>
                  <Link to="/" className="text-xs text-ink-600 hover:text-ink-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-ink-800 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2">
              {['Help Center', 'Documentation', 'Status'].map((label) => (
                <li key={label}>
                  <Link to="/" className="text-xs text-ink-600 hover:text-ink-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-ink-800 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
                <li key={label}>
                  <Link to="/" className="text-xs text-ink-600 hover:text-ink-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-200 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-ink-500">
            © {currentYear} Career Mitra. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com" className="text-ink-500 hover:text-ink-700 transition-colors text-xs" aria-label="Twitter">
              Twitter
            </a>
            <a href="https://linkedin.com" className="text-ink-500 hover:text-ink-700 transition-colors text-xs" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a href="mailto:support@careermitra.com" className="text-ink-500 hover:text-ink-700 transition-colors text-xs" aria-label="Email">
              support@careermitra.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
