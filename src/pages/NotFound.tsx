import React, { useEffect } from 'react';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  navigate: (path: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ navigate }) => {
  useEffect(() => {
    document.title = '404 - Page Not Found | ApexGarments';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 shadow-xl">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
          ERROR 404
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Page or Route Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          The ERP system could not find the requested route or production resource. Check the navigation menu or return to the home terminal.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>

        <button
          onClick={() => window.history.back()}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};
