import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { UserRole } from '../types/index.ts';
import { Layers, User, Mail, Image, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface RegisterProps {
  navigate: (path: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ navigate }) => {
  const { register, socialLogin, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Register - ApexGarments Tracker';
    if (isAuthenticated) {
      navigate('/all-products');
    }
  }, [isAuthenticated]);

  // Live password validation state
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('All fields are required.', 'error');
      return;
    }

    if (!hasMinLength) {
      showToast('Password length must be at least 6 characters.', 'error');
      return;
    }
    if (!hasUpperCase) {
      showToast('Password must contain at least one uppercase letter (A-Z).', 'error');
      return;
    }
    if (!hasLowerCase) {
      showToast('Password must contain at least one lowercase letter (a-z).', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      name,
      email,
      password,
      role,
      photoURL: photoURL || undefined
    });
    setIsSubmitting(false);

    if (res.success) {
      showToast(
        '🎉 Registration successful! Status is set to Pending by default.',
        'success',
        'You can now explore the catalog and dashboard.'
      );
      if (role === 'manager') {
        navigate('/dashboard/manage-products');
      } else {
        navigate('/dashboard/my-orders');
      }
    } else {
      showToast(res.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Garment Portal Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Register as an International Buyer or Factory Floor Manager
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Name */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="E.g. Clara Beaumont"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="clara@nordicvogue.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* photoURL */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profile Photo URL (Optional)
              </label>
              <div className="relative">
                <Image className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={photoURL}
                  onChange={e => setPhotoURL(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Role & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Role *
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="buyer">Buyer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  Default Status
                </label>
                <input
                  type="text"
                  readOnly
                  value="Pending (Default)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-amber-600 dark:text-amber-400 font-bold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Explicit Password Verification Indicators */}
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-600 dark:text-slate-300 block">
                  Password Requirements:
                </span>
                <div className="flex items-center gap-2">
                  {hasMinLength ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                    At least 6 characters in length
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasUpperCase ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={hasUpperCase ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                    At least one Uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasLowerCase ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={hasLowerCase ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                    At least one Lowercase letter (a-z)
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Account...' : 'Register Account'}</span>
            </button>
          </form>

          {/* Social Sign-Up Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or Sign Up With
            </span>
          </div>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={async () => {
              setIsSubmitting(true);
              const res = await socialLogin('google');
              setIsSubmitting(false);
              if (res.success) {
                showToast('Signed up via Google successfully! Role: Buyer (Pending Status)', 'success');
                navigate('/dashboard/my-orders');
              } else {
                showToast(res.message || 'Social sign-up failed.', 'error');
              }
            }}
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
            <span>Sign up with Google (Buyer, Pending)</span>
          </button>

          {/* Link to Login */}
          <p className="text-center text-xs text-slate-500">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Sign In to your account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
