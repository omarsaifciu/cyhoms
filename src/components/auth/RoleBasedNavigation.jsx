
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserSession, isAdmin } from '@/utils/userSessionManager';

/**
 * TASK 2: Conditional UI Rendering (Role-Based Access)
 * Component that shows admin dashboard link only to admin users
 */
const RoleBasedNavigation = () => {
  const [sessionData, setSessionData] = useState({
    user: null,
    profile: null,
    roles: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getUserSession();
        setSessionData({
          ...session,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching session:', error);
        setSessionData({
          user: null,
          profile: null,
          roles: [],
          loading: false,
          error
        });
      }
    };

    fetchSession();
  }, []);

  // Show loading state
  if (sessionData.loading) {
    return (
      <div className="flex items-center text-gray-500">
        <span>Loading...</span>
      </div>
    );
  }

  // Show error state
  if (sessionData.error) {
    return (
      <div className="flex items-center text-red-500">
        <span>Error loading user session</span>
      </div>
    );
  }

  // No user logged in
  if (!sessionData.user) {
    return (
      <nav className="flex items-center space-x-4">
        <Link 
          to="/login" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Login
        </Link>
      </nav>
    );
  }

  // User is logged in - show navigation based on roles
  const userIsAdmin = isAdmin(sessionData.roles);

  return (
    <nav className="flex items-center space-x-4">
      {/* Always show profile link for logged in users */}
      <Link 
        to="/profile" 
        className="text-gray-600 hover:text-gray-800"
      >
        Profile
      </Link>

      {/* Show seller dashboard if user has seller or admin role */}
      {(sessionData.roles.includes('seller') || userIsAdmin) && (
        <Link
          to="/dashboard"
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Dashboard
        </Link>
      )}

      {/* CONDITIONAL RENDERING: Only show Admin Dashboard link if user has 'admin' role */}
      {userIsAdmin && (
        <Link 
          to="/admin" 
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-medium"
        >
          Admin Dashboard
        </Link>
      )}

      {/* User info display */}
      <div className="flex items-center text-sm text-gray-500">
        <span>Welcome, {sessionData.profile?.full_name || sessionData.user.email}</span>
        {sessionData.roles.length > 0 && (
          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
            {sessionData.roles.join(', ')}
          </span>
        )}
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;
