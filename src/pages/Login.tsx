import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Layers, Mail, Lock, ArrowRight, ShieldCheck, Github, LogIn } from 'lucide-react';

interface LoginProps {
  navigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ navigate }) => {
  const { login, socialLogin, isAuthenticated, isAdmin, isManager } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Login - ApexGarments Tracker';
    if (isAuthenticated) {
      const redirectTarget = sessionStorage.getItem('apex_redirect_target');
      if (redirectTarget) {
        sessionStorage.removeItem('apex_redirect_target');
        navigate(redirectTarget);
      } else if (isAdmin) {
        navigate('/dashboard/manage-users');
      } else if (isManager) {
        navigate('/dashboard/manage-products');
      } else {
        navigate('/dashboard/my-orders');
      }
    }
  }, [isAuthenticated, isAdmin, isManager]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      showToast(res.message || 'Login successful!', 'success');
      const redirectTarget = sessionStorage.getItem('apex_redirect_target');
      if (redirectTarget) {
        sessionStorage.removeItem('apex_redirect_target');
        navigate(redirectTarget);
      } else if (res.user?.role === 'admin') {
        navigate('/dashboard/manage-users');
      } else if (res.user?.role === 'manager') {
        navigate('/dashboard/manage-products');
      } else {
        navigate('/dashboard/my-orders');
      }
    } else {
      showToast(res.message || 'Invalid email or password.', 'error');
    }
  };

  const handleSocial = async (provider: 'google' | 'github') => {
    setIsSubmitting(true);
    const res = await socialLogin(provider);
    setIsSubmitting(false);
    if (res.success) {
      showToast('Signed in via Google successfully! Role: Buyer (Pending Status)', 'success');
      const redirectTarget = sessionStorage.getItem('apex_redirect_target');
      if (redirectTarget) {
        sessionStorage.removeItem('apex_redirect_target');
        navigate(redirectTarget);
      } else {
        navigate('/dashboard/my-orders');
      }
    } else {
      showToast(res.message || 'Social login failed.', 'error');
    }
  };

  const fillTestCredentials = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sign In to ApexGarments
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Enter your credentials to access your production & order portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Account...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or Continue With
            </span>
          </div>

          {/* Google / Social Sign-In Button (Requirement: role - buyer & status - pending) */}
          <button
            type="button"
            onClick={() => handleSocial('google')}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google (Buyer, Pending)</span>
          </button>

          {/* Quick Credential Helper for Recruiter / Examiner */}
          <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2 text-[11px]">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 block">
              Quick Login Buttons (For Examiner):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => fillTestCredentials('admin@garmentflow.com', 'AdminPassword123')}
                className="px-2 py-1 rounded font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 hover:bg-indigo-50 cursor-pointer text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('manager@garmentflow.com', 'ManagerPassword123')}
                className="px-2 py-1 rounded font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 hover:bg-emerald-50 cursor-pointer text-center"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('buyer@garmentflow.com', 'BuyerPassword123')}
                className="px-2 py-1 rounded font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-600 hover:bg-sky-50 cursor-pointer text-center"
              >
                Buyer
              </button>
            </div>
            <button
              type="button"
              onClick={() => fillTestCredentials('hafizurrahmanhafiz145@gmail.com', 'Password123')}
              className="w-full mt-1.5 py-1 px-2 rounded font-medium bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50/50 cursor-pointer text-center text-[10px]"
            >
              Sign in as Hafizur Rahman (hafizurrahmanhafiz145@gmail.com)
            </button>
          </div>

          {/* Link to Register */}
          <p className="text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
