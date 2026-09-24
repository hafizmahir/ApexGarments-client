import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Users,
  Package,
  ShoppingBag,
  PlusCircle,
  Clock,
  CheckCircle,
  BarChart3,
  User,
  LogOut,
  ShieldAlert,
  Layers,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  currentPath: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentPath, navigate, children }) => {
  const { user, isAdmin, isManager, isBuyer, isSuspended, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Define navigation items per role
  const adminNav = [
    { label: 'Analytics KPI', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Manage Users', path: '/dashboard/manage-users', icon: Users },
    { label: 'All Products', path: '/dashboard/all-products', icon: Package },
    { label: 'All Orders', path: '/dashboard/all-orders', icon: ShoppingBag },
    { label: 'My Profile', path: '/dashboard/profile', icon: User }
  ];

  const managerNav = [
    { label: 'Add Product', path: '/dashboard/add-product', icon: PlusCircle },
    { label: 'Manage Products', path: '/dashboard/manage-products', icon: Package },
    { label: 'Pending Orders', path: '/dashboard/pending-orders', icon: Clock },
    { label: 'Approved Orders', path: '/dashboard/approved-orders', icon: CheckCircle },
    { label: 'My Profile', path: '/dashboard/profile', icon: User }
  ];

  const buyerNav = [
    { label: 'My Orders', path: '/dashboard/my-orders', icon: ShoppingBag },
    { label: 'Order Tracking', path: '/dashboard/track-order', icon: Layers },
    { label: 'My Profile', path: '/dashboard/profile', icon: User }
  ];

  const navItems = isAdmin ? adminNav : isManager ? managerNav : buyerNav;

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50/60 dark:bg-slate-950/60">
      {/* Top Mobile Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {user?.role} Portal
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-25 bg-slate-950/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 lg:w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-6">
            {/* User Mini Profile Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                {isSuspended && (
                  <span className="absolute -top-1 -right-1 p-0.5 bg-rose-500 text-white rounded-full">
                    <ShieldAlert className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    {user?.role}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span
                    className={`text-[10px] font-bold capitalize ${
                      user?.status === 'approved'
                        ? 'text-emerald-500'
                        : user?.status === 'suspended'
                        ? 'text-rose-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                Menu Routes
              </span>
              {navItems.map(item => {
                const Icon = item.icon;
                const active = currentPath === item.path || (item.path !== '/dashboard/profile' && currentPath.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs min-h-[600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
