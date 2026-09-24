import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Layers,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Package,
  Home,
  Info,
  PhoneCall,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, isAuthenticated, logout, isAdmin, isManager, isSuspended } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardRoute = () => {
    if (isAdmin) return '/dashboard/manage-users';
    if (isManager) return '/dashboard/manage-products';
    return '/dashboard/my-orders';
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300">
                  ApexGarments
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  ERP
                </span>
              </div>
              <span className="text-[10px] tracking-widest uppercase text-slate-500 font-medium">
                Production & Order Tracker
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('/')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') && currentPath === '/'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('/all-products')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/all-products')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
              }`}
            >
              All-Products
            </button>

            {!isAuthenticated && (
              <>
                <button
                  onClick={() => handleNav('/about-us')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/about-us')
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  About Us
                </button>

                <button
                  onClick={() => handleNav('/contact')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/contact')
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  Contact
                </button>
              </>
            )}

            {isAuthenticated && (
              <button
                onClick={() => handleNav(getDashboardRoute())}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/dashboard')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* User Profile or Login/Register buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div
                  onClick={() => handleNav('/dashboard/profile')}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all"
                    />
                    {isSuspended && (
                      <span className="absolute -top-1 -right-1 p-0.5 bg-rose-500 text-white rounded-full">
                        <ShieldAlert className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-indigo-600 transition-colors">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/all-products')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            All-Products
          </button>
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('/about-us')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                About Us
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Contact
              </button>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600"
                >
                  Register
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav(getDashboardRoute())}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNav('/dashboard/profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                My Profile ({user?.name})
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
