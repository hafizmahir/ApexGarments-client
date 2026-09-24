import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';

// Pages
import { Home } from './pages/Home.tsx';
import { AllProducts } from './pages/AllProducts.tsx';
import { ProductDetails } from './pages/ProductDetails.tsx';
import { AboutUs } from './pages/AboutUs.tsx';
import { Contact } from './pages/Contact.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { NotFound } from './pages/NotFound.tsx';

// Dashboard
import { DashboardLayout } from './pages/Dashboard/DashboardLayout.tsx';
import { ManageUsers } from './pages/Dashboard/Admin/ManageUsers.tsx';
import { AdminAllProducts } from './pages/Dashboard/Admin/AdminAllProducts.tsx';
import { AdminAllOrders } from './pages/Dashboard/Admin/AdminAllOrders.tsx';
import { AdminAnalytics } from './pages/Dashboard/Admin/AdminAnalytics.tsx';
import { AddProduct } from './pages/Dashboard/Manager/AddProduct.tsx';
import { ManageProducts } from './pages/Dashboard/Manager/ManageProducts.tsx';
import { PendingOrders } from './pages/Dashboard/Manager/PendingOrders.tsx';
import { ApprovedOrders } from './pages/Dashboard/Manager/ApprovedOrders.tsx';
import { MyOrders } from './pages/Dashboard/Buyer/MyOrders.tsx';
import { TrackOrder } from './pages/Dashboard/Buyer/TrackOrder.tsx';
import { Profile } from './pages/Dashboard/Profile.tsx';

const RouterView: React.FC = () => {
  const { user, isAuthenticated, isLoading, isAdmin, isManager, isBuyer } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Sync with browser back/forward history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wait for initial auth restoration so user does NOT redirect on reload
  if (isLoading) {
    return <LoadingSpinner label="Restoring session & ERP workspace..." size="lg" fullScreen />;
  }

  // Route Dispatcher
  const renderContent = () => {
    // 1. Home
    if (currentPath === '/') {
      return <Home navigate={navigate} />;
    }

    // 2. All Products
    if (currentPath === '/all-products') {
      return <AllProducts navigate={navigate} />;
    }

    // 3. Product Details (Private Route: if not authenticated, redirect to login)
    if (currentPath.startsWith('/product/')) {
      const parts = currentPath.split('/');
      const productId = parts[2];
      return <ProductDetails productId={productId} navigate={navigate} />;
    }

    // 4. About Us & Contact
    if (currentPath === '/about-us') {
      return <AboutUs navigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <Contact />;
    }

    // 5. Auth Pages
    if (currentPath === '/login') {
      return <Login navigate={navigate} />;
    }
    if (currentPath === '/register') {
      return <Register navigate={navigate} />;
    }

    // 6. Dashboard Routes (Private Routes)
    if (currentPath.startsWith('/dashboard')) {
      if (!isAuthenticated) {
        // Store target & send to login
        sessionStorage.setItem('apex_redirect_target', currentPath);
        return <Login navigate={navigate} />;
      }

      // Inside Dashboard Layout
      return (
        <DashboardLayout currentPath={currentPath} navigate={navigate}>
          {/* Admin Routes */}
          {currentPath === '/dashboard/manage-users' && (
            isAdmin ? <ManageUsers /> : <AccessDenied userRole={user?.role} required="Admin" navigate={navigate} />
          )}

          {currentPath === '/dashboard/all-products' && (
            isAdmin ? <AdminAllProducts /> : <AccessDenied userRole={user?.role} required="Admin" navigate={navigate} />
          )}

          {currentPath === '/dashboard/all-orders' && (
            isAdmin ? <AdminAllOrders /> : <AccessDenied userRole={user?.role} required="Admin" navigate={navigate} />
          )}

          {currentPath === '/dashboard/analytics' && (
            isAdmin ? <AdminAnalytics /> : <AccessDenied userRole={user?.role} required="Admin" navigate={navigate} />
          )}

          {/* Manager Routes */}
          {currentPath === '/dashboard/add-product' && (
            isManager ? <AddProduct navigate={navigate} /> : <AccessDenied userRole={user?.role} required="Manager" navigate={navigate} />
          )}

          {currentPath === '/dashboard/manage-products' && (
            isManager ? <ManageProducts navigate={navigate} /> : <AccessDenied userRole={user?.role} required="Manager" navigate={navigate} />
          )}

          {currentPath === '/dashboard/pending-orders' && (
            isManager ? <PendingOrders /> : <AccessDenied userRole={user?.role} required="Manager" navigate={navigate} />
          )}

          {currentPath === '/dashboard/approved-orders' && (
            isManager ? <ApprovedOrders /> : <AccessDenied userRole={user?.role} required="Manager" navigate={navigate} />
          )}

          {/* Buyer Routes */}
          {currentPath === '/dashboard/my-orders' && (
            isBuyer ? <MyOrders navigate={navigate} /> : <AccessDenied userRole={user?.role} required="Buyer" navigate={navigate} />
          )}

          {currentPath.startsWith('/dashboard/track-order') && (
            isBuyer ? (
              <TrackOrder
                orderIdFromRoute={currentPath.split('/')[3]}
                navigate={navigate}
              />
            ) : (
              <AccessDenied userRole={user?.role} required="Buyer" navigate={navigate} />
            )
          )}

          {/* Shared Profile */}
          {currentPath === '/dashboard/profile' && <Profile />}
        </DashboardLayout>
      );
    }

    // 7. 404 Route
    return <NotFound navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
      />

      <main className="flex-1">{renderContent()}</main>

      <Footer navigate={navigate} />
    </div>
  );
};

const AccessDenied: React.FC<{ userRole?: string; required: string; navigate: (p: string) => void }> = ({
  userRole,
  required,
  navigate
}) => {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="inline-block p-4 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-8a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role Access Restricted</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        This view requires <strong>{required}</strong> authorization. Your active role is{' '}
        <strong className="uppercase">{userRole}</strong>.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterView />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
