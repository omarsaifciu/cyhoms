import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireSeller?: boolean;
  redirectTo?: string;
}

/**
 * Protected Route Component
 * Handles authentication and role-based access control for routes
 */
export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireSeller = false,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAdmin, isSeller, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check seller requirement (admin users also have seller privileges)
  if (requireSeller && !isSeller && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
