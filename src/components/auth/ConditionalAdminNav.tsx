import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';

/**
 * Example: Conditional UI Component
 * This component demonstrates how to use the useAuth hook to conditionally 
 * render UI elements based on user roles.
 */
export function ConditionalAdminNav() {
  const { isAdmin, isSeller, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center text-gray-500">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-4">
      {/* Always show profile link for authenticated users */}
      {profile && (
        <Link 
          to="/profile" 
          className="text-gray-600 hover:text-gray-800"
        >
          Profile
        </Link>
      )}

      {/* Show seller dashboard if user has seller or admin role */}
      {(isSeller || isAdmin) && (
        <Link
          to="/dashboard"
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Dashboard
        </Link>
      )}

      {/* CONDITIONAL RENDERING: Only show Admin Dashboard link if user has 'admin' role */}
      {isAdmin && (
        <Link 
          to="/admin" 
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-medium flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Admin Dashboard
        </Link>
      )}

      {/* User info display */}
      {profile && (
        <div className="flex items-center text-sm text-gray-500">
          <span>Welcome, {profile.full_name || 'User'}</span>
        </div>
      )}
    </nav>
  );
}
