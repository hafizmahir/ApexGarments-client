import React, { useEffect } from 'react';
import { Layers, ShieldCheck, Award, Factory, Users, Globe2, Sparkles } from 'lucide-react';

interface AboutUsProps {
  navigate: (path: string) => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ navigate }) => {
  useEffect(() => {
    document.title = 'About Us - ApexGarments ERP Systems';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Factory className="w-3.5 h-3.5" />
          <span>Established 2012 · DEPZ Dhaka</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pioneering Smart Apparel Manufacturing & Global Sourcing
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          ApexGarments connects international fashion brands directly to intelligent, audit-compliant manufacturing floors. Our proprietary ERP monitors every stitch from raw cotton cone to container ship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">AQL 1.5 Quality Guarantee</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Multi-checkpoint inspections ensure international standard stitch density, color fastness, seam tensile strength, and zero broken needles.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ethical & Social Compliance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            WRAP Gold & Sedex SMETA certified workplace. Climate-controlled production halls, fair living wages, and complete safety training.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <Globe2 className="w-8 h-8 text-sky-600 dark:text-sky-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Worldwide Export Network</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Direct vessel loading partnerships out of Chittagong & Mongla ports to major hubs in North America, Europe, East Asia, and Australia.
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-indigo-600 text-white text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore our export catalog?</h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto">
          View available inventory, evaluate technical specs, or request custom garment production lines.
        </p>
        <button
          onClick={() => navigate('/all-products')}
          className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold text-xs sm:text-sm hover:bg-slate-100 shadow-lg cursor-pointer"
        >
          View All Products
        </button>
      </div>
    </div>
  );
};
