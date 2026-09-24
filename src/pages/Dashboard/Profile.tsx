import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import {
  User,
  Mail,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  KeyRound
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout, isSuspended, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    document.title = 'My Profile & Account Status - ApexGarments';
    if (user) {
      setName(user.name);
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const res = await updateProfile({ name, photoURL });
    setIsUpdating(false);
    if (res.success) {
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast(res.message || 'Failed to update profile.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          <span>My Profile & ERP Account</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your credentials, permissions, and factory authorization status.
        </p>
      </div>

      {/* CHALLENGE POINT 4: Prominent Suspension Alert Box & Feedback */}
      {isSuspended && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900 shadow-md space-y-3">
          <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            <h3 className="text-base font-bold">Account Privileges Suspended by Administration</h3>
          </div>

          <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
            {user?.role === 'buyer'
              ? 'As a suspended Buyer, your access is locked: You cannot place new apparel bookings. Existing orders can still be tracked below.'
              : 'As a suspended Manager, your production operations are locked: You cannot add new products or approve/reject pending orders.'}
          </p>

          <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                Official Suspend Reason:
              </span>
              <p className="font-semibold text-rose-700 dark:text-rose-400 mt-0.5">
                {user?.suspendReason || 'Policy compliance review required.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                Admin Remediation Feedback:
              </span>
              <p className="text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                {user?.suspendFeedback || 'Please contact factory administration desk at orders@garmentflow.com to resolve outstanding audit questions.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
            />
            {isSuspended && (
              <span className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full shadow">
                <ShieldAlert className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                Role: {user?.role}
              </span>

              <span
                className={`text-[11px] font-bold capitalize px-2.5 py-0.5 rounded-full border ${
                  user?.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                    : user?.status === 'suspended'
                    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                Status: {user?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Profile Photo URL
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={e => setPhotoURL(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout of Session</span>
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
