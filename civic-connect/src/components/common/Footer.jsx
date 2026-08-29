import React from 'react';
import { Layers } from 'lucide-react';

export const Footer = ({ className = '' }) => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-slate-200 py-6 text-slate-500 text-xs ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Layers className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-700">CivicConnect</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">Civic Infrastructure & Pothole Reporting Platform</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Systems Operational
            </span>
            <div className="flex items-center gap-4">
              <a href="#privacy" className="hover:text-slate-700 transition-colors">
                Privacy
              </a>
              <a href="#terms" className="hover:text-slate-700 transition-colors">
                Terms
              </a>
              <a href="#support" className="hover:text-slate-700 transition-colors">
                Help & Support
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© {currentYear} CivicConnect. Built for civic improvement and transparent governance.</p>
          <p className="flex items-center gap-1">
            Empowering citizens and municipal departments
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
