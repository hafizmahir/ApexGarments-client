import React from 'react';
import { Layers, Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                ApexGarments ERP
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              Next-generation apparel manufacturing execution and order tracking ERP platform. Powering end-to-end transparency from pattern cutting, high-precision sewing, multi-point QC to worldwide export logistics.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* Modern X Logo (Requirement: "Use the new X logo instead of the old Twitter bird to match the latest rebrand") */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Home Landing
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/all-products')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about-us')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Factory Profile & Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact & RFP
                </button>
              </li>
            </ul>
          </div>

          {/* Production Workflow */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Manufacturing
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Fabric Sourcing & Lab Dip</li>
              <li>CAD Marker & Precision Cutting</li>
              <li>Modular Juki Line Sewing</li>
              <li>Steam Tunnel Finishing</li>
              <li>AQL 1.5 Quality Assurance</li>
              <li>Custom RFID Barcode Packing</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Factory HQ
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Sector 4, Dhaka Export Processing Zone (DEPZ), Savar, Dhaka 1349</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>+880 2 779 1234 / +1 (800) 427-6368</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>orders@garmentflow.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ApexGarments ERP Systems Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:underline cursor-pointer">Security & Compliance</span>
            <span className="hover:underline cursor-pointer">ISO 9001 / WRAP Certified</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
