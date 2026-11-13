import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
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
                <Route path="/account" element={<CustomerDashboardPage />} />
                <Route path="/account/orders" element={<CustomerDashboardPage />} />
                <Route path="/account/custom-requests" element={<CustomerDashboardPage />} />
                <Route path="/account/addresses" element={<CustomerDashboardPage />} />
                <Route path="/account/wishlist" element={<CustomerDashboardPage />} />

                {/* Admin Dashboard */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/*" element={<AdminDashboardPage />} />

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
            <Footer />
            <CartDrawer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
