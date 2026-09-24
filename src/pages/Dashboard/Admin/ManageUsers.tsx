import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../../../types/index.ts';
import { useToast } from '../../../context/ToastContext.tsx';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import { Modal } from '../../../components/Modal.tsx';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Edit2,
  AlertTriangle
} from 'lucide-react';

export const ManageUsers: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state (Challenge requirement!)
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // User Update / Suspend Modal state (Challenge point 4!)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<UserRole>('buyer');
  const [targetStatus, setTargetStatus] = useState<UserStatus>('approved');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendFeedback, setSuspendFeedback] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async (targetPage = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', String(targetPage));
      params.append('limit', '8');

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotalUsers(data.total || 0);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Manage Users & Roles - ApexGarments Admin';
    fetchUsers(1);
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setTargetRole(user.role);
    setTargetStatus(user.status);
    setSuspendReason(user.suspendReason || '');
    setSuspendFeedback(user.suspendFeedback || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Challenge point 4 requirement:
    // Admin: suspend modal MUST collect suspend reason & why suspend feedback
    if (targetStatus === 'suspended') {
      if (!suspendReason.trim() || !suspendFeedback.trim()) {
        showToast(
          'Suspend Reason and Feedback are strictly mandatory when suspending an account.',
          'error'
        );
        return;
      }
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        },
        body: JSON.stringify({
          role: targetRole,
          status: targetStatus,
          suspendReason: targetStatus === 'suspended' ? suspendReason.trim() : undefined,
          suspendFeedback: targetStatus === 'suspended' ? suspendFeedback.trim() : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`User ${selectedUser.name} updated successfully!`, 'success');
        setIsEditModalOpen(false);
        fetchUsers(page);
      } else {
        showToast(data.message || 'Failed to update user.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating user profile.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Manage Managers & Buyer Roles</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authorize factory managers, activate registered international buyers, or enforce account suspension.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 self-start sm:self-auto">
          {totalUsers} Total Accounts
        </div>
      </div>

      {/* Challenge: Search and Filter Functionality on User Management Page */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-16 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600 text-white cursor-pointer"
            >
              Filter
            </button>
          </form>

          {/* Role Filter */}
          <div className="sm:col-span-3">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Roles</option>
              <option value="buyer">Buyers Only</option>
              <option value="manager">Managers Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <LoadingSpinner label="Querying user database records..." />
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs">
          No users match the specified search or filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Name + Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                    {u.email}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : u.role === 'manager'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold capitalize text-[11px] px-2 py-0.5 rounded ${
                        u.status === 'approved'
                          ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : u.status === 'suspended'
                          ? 'text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400'
                          : 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400'
                      }`}
                    >
                      {u.status === 'suspended' && <ShieldAlert className="w-3 h-3" />}
                      {u.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="px-3 py-1.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs pt-2">
          <span className="text-slate-500">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalUsers} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => fetchUsers(page - 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => fetchUsers(page + 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* UPDATE / SUSPEND MODAL (Challenge Point 4 Requirement) */}
      {isEditModalOpen && selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Update User: ${selectedUser.name}`}
          subtitle={`Email: ${selectedUser.email}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Role
                </label>
                <select
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="buyer">Buyer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Status
                </label>
                <select
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value as UserStatus)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended (Locks Privileges)</option>
                </select>
              </div>
            </div>

            {/* Challenge Point 4: Suspend Modal MUST collect Suspend Reason & Why Suspend Feedback */}
            {targetStatus === 'suspended' && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Mandatory Suspension Audit Fields</span>
                </div>
                <p className="text-[11px] text-rose-600 dark:text-rose-400">
                  This reason and remediation feedback will be displayed directly on the user's profile.
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suspend Reason *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Production safety protocol deviation / Payment dispute"
                    value={suspendReason}
                    onChange={e => setSuspendReason(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Why Suspend Feedback (Actionable for User) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain why this account was suspended and the exact steps needed for reactivation..."
                    value={suspendFeedback}
                    onChange={e => setSuspendFeedback(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Apply Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
