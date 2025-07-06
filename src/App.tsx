
import React, { Suspense, memo, useMemo, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useUserProfile } from "@/hooks/useUserProfile";
import useApplyUserTheme from "@/hooks/useApplyUserTheme";
import { routeConfig } from "@/config/routes";
import "./App.css";

// Lazy loading للصفحات المطلوبة فقط في App.tsx
const Admin = lazy(() => import("@/pages/Admin"));
const AuthPage = lazy(() => import("@/components/auth/AuthPage"));
const MaintenancePage = lazy(() => import("@/pages/MaintenancePage"));
const ProtectedAdminRoute = lazy(() => import("@/components/ProtectedAdminRoute"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Terms = lazy(() => import("@/pages/Terms"));

// QueryClient configuration مع إعدادات محسنة
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 دقائق
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading Spinner محسن
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#222636] transition-colors duration-300">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 
        className="w-12 h-12 animate-spin text-primary" 
        style={{ color: 'var(--brand-gradient-from-color)' }}
      />
      <p className="text-gray-600 dark:text-gray-300 font-medium">
        جاري التحميل...
      </p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Protected Route Component محسن
const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

// Public Route Component محسن - Fixed to prevent Suspense conflicts
const PublicRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Don't redirect during loading to prevent Suspense conflicts
  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
});

PublicRoute.displayName = 'PublicRoute';

// AppLayout محسن
const AppLayout = memo(({ children }: { children: React.ReactNode }) => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#222636] transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-20 bg-white dark:bg-[#222636] transition-colors duration-300">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

// Web Push Notifications Handler
const WebPushNotificationsHandler = memo(() => {
  useWebPushNotifications();
  return null;
});

WebPushNotificationsHandler.displayName = 'WebPushNotificationsHandler';

// استخدام routeConfig من الملف المنفصل

const AppRoutes = memo(() => {
  useApplyUserTheme();

  const { settings, loading: settingsLoading } = useSiteSettings();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  const loading = useMemo(() => 
    settingsLoading || authLoading || (user && profileLoading), 
    [settingsLoading, authLoading, user, profileLoading]
  );

  const isMaintenance = useMemo(() => 
    settings?.maintenanceMode && !profile?.is_admin, 
    [settings?.maintenanceMode, profile?.is_admin]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isMaintenance) {
    return (
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <AppLayout>
                  <AuthPage />
                </AppLayout>
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
        <Toaster />
        <Sonner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Auth Route - Changed from /auth to /login */}
        <Route path="/login" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PublicRoute>
              <AppLayout>
                <AuthPage />
              </AppLayout>
            </PublicRoute>
          </Suspense>
        } />

        {/* Forgot Password Route */}
        <Route path="/forgot-password" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PublicRoute>
              <AppLayout>
                <ForgotPassword />
              </AppLayout>
            </PublicRoute>
          </Suspense>
        } />

        {/* Reset Password Route - Accessible during password reset process */}
        <Route path="/reset-password" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ResetPassword />
          </Suspense>
        } />

        {/* Terms page - accessible without authentication */}
        <Route path="/terms" element={
          <AppLayout>
            <Terms />
          </AppLayout>
        } />

        {/* Public routes */}
        {routeConfig.public.map(({ path, element: Component }) => (
          <Route key={path} path={path} element={
            <AppLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <Component />
              </Suspense>
            </AppLayout>
          } />
        ))}

        {/* Protected Admin route */}
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedAdminRoute>
              <AppLayout>
                <Admin />
              </AppLayout>
            </ProtectedAdminRoute>
          </Suspense>
        } />

        {/* Protected routes */}
        {routeConfig.protected.map(({ path, element: Component }) => (
          <Route key={path} path={path} element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Component />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          } />
        ))}

        {/* Legacy redirects */}
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="/seller-dashboard" element={<Navigate to="/dashboard" replace />} />

        {/* 404 route */}
        <Route path={routeConfig.notFound.path} element={
          <AppLayout>
            <Suspense fallback={<LoadingSpinner />}>
              {React.createElement(routeConfig.notFound.element)}
            </Suspense>
          </AppLayout>
        } />
      </Routes>
      <WebPushNotificationsHandler />
      <Toaster />
      <Sonner />
    </div>
  );
});

AppRoutes.displayName = 'AppRoutes';

// Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#222636] transition-colors duration-300">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              حدث خطأ غير متوقع
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              نعتذر عن الإزعاج. يرجى إعادة تحميل الصفحة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              إعادة تحميل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <DataProvider>
              <LanguageProvider>
                <Router>
                  <AppRoutes />
                </Router>
              </LanguageProvider>
            </DataProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
