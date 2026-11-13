import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";

// Pages
import { HomePage } from "./pages/Home";
import { ShopPage } from "./pages/Shop";
import { ProductDetailPage } from "./pages/ProductDetail";
import { CustomPrintsPage } from "./pages/CustomPrints";
import { CheckoutPage } from "./pages/Checkout";
import { OrderSuccessPage } from "./pages/OrderSuccess";
import { TrackOrderPage } from "./pages/TrackOrder";
import { CustomerDashboardPage } from "./pages/customer/Dashboard";
import { AdminDashboardPage } from "./pages/admin/AdminDashboard";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import { ResetPasswordPage } from "./pages/auth/ResetPassword";
import {
  AboutPage,
  ShippingPage,
  ReturnsPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  PricingPage,
  GrievancePage,
  SampleInvoicePage,
} from "./pages/static";

function ScrollToTop() {
  const { pathname } = window.location;
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-cream">
        <div className="card-brutal p-8 max-w-sm text-center space-y-4">
          <div className="w-10 h-10 border-4 border-ink border-t-lime rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-wider font-bold">
            Verifying Administrative Security Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-cream">
        <div className="card-brutal p-8 max-w-lg mx-auto bg-cream-light border-2 border-ink shadow-brutal-xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="badge-coral text-xs">Security Exception // 403</span>
            <span className="font-mono text-[10px] text-ink-muted uppercase">Access Prohibited</span>
          </div>

          <div>
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-ink">
              Admin Portal Restricted<span className="text-coral">.</span>
            </h2>
            <p className="font-mono text-xs text-ink-muted mt-2 leading-relaxed">
              The Operations Control Center is strictly restricted to company administrative personnel (<span className="text-ink font-bold">thetoyzdept@gmail.com</span>). Customer accounts do not have access to this portal.
            </p>
          </div>

          <div className="p-3 bg-cream border-2 border-ink font-mono text-xs space-y-1">
            <p className="text-ink-muted text-[10px] uppercase">Currently Authenticated As:</p>
            <p className="font-bold text-ink truncate">{user.email}</p>
            <span className="badge-lime text-[10px] inline-block mt-1">Customer Account</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/account" className="btn-primary text-xs flex-1 text-center py-3">
              Go to Customer Dashboard
            </Link>
            <Link to="/shop" className="btn-secondary text-xs flex-1 text-center py-3">
              Browse Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function CustomerRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-cream">
        <div className="card-brutal p-8 max-w-sm text-center space-y-4">
          <div className="w-10 h-10 border-4 border-ink border-t-lime rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-wider font-bold">
            Loading Customer Account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppLayout() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/reset-password"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Storefront */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/custom-prints" element={<CustomPrintsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Customer Dashboard */}
          <Route path="/account" element={<CustomerRoute><CustomerDashboardPage /></CustomerRoute>} />
          <Route path="/account/*" element={<CustomerRoute><CustomerDashboardPage /></CustomerRoute>} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

          {/* Brand & Policies */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/refunds" element={<ReturnsPage />} />
          <Route path="/refund-policy" element={<ReturnsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/grievance-redressal" element={<GrievancePage />} />
          <Route path="/sample-invoice" element={<SampleInvoicePage />} />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
                <div className="card-brutal p-8 max-w-md mx-auto">
                  <span className="badge-coral text-xs mb-2">404 Exception</span>
                  <h2 className="font-display font-black text-3xl uppercase mb-2">
                    Page Not Found
                  </h2>
                  <p className="font-mono text-xs text-ink-muted mb-6">
                    The requested page path does not exist in our catalog or router.
                  </p>
                  <a href="/" className="btn-primary text-xs">
                    Back to Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
      {isAuthPage && (
        <footer className="py-4 text-center font-mono text-[11px] text-ink-muted border-t border-ink/10 bg-cream">
          © 2026 THE TOYZ DEPT. // BENGALURU, INDIA • ALL RIGHTS RESERVED
        </footer>
      )}
      <CartDrawer />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
