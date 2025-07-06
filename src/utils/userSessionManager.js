
import { supabase } from "@/integrations/supabase/client";

/**
 * TASK 1: User Session and Role Management
 * Gets the current user session including profile and roles
 * @returns {Object} Object containing user, profile, and roles array
 */
export const getUserSession = async () => {
  try {
    console.log('Getting user session...');
    
    // 1. Get the current logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return { user: null, profile: null, roles: [], error: userError };
    }

    if (!user) {
      console.log('No user logged in');
      return { user: null, profile: null, roles: [], error: null };
    }

    console.log('User found:', user.email);

    // 2. Fetch user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { user, profile: null, roles: [], error: profileError };
    }

    console.log('Profile found:', profile?.full_name);

    // 3. Fetch all user roles from user_roles table
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
      return { user, profile, roles: [], error: rolesError };
    }

    // Extract roles into a simple array
    const roles = userRoles ? userRoles.map(roleObj => roleObj.role) : [];
    console.log('User roles found:', roles);

    return {
      user,
      profile,
      roles,
      error: null
    };

  } catch (error) {
    console.error('Unexpected error in getUserSession:', error);
    return { user: null, profile: null, roles: [], error };
  }
};

/**
 * Check if user has a specific role
 * @param {Array} userRoles - Array of user roles
 * @param {string} requiredRole - Role to check for
 * @returns {boolean} True if user has the role
 */
export const hasRole = (userRoles, requiredRole) => {
  return Array.isArray(userRoles) && userRoles.includes(requiredRole);
};

/**
 * Check if user is admin
 * @param {Array} userRoles - Array of user roles
 * @returns {boolean} True if user has admin role
 */
export const isAdmin = (userRoles) => {
  return hasRole(userRoles, 'admin');
};

/**
 * Check if user is seller
 * @param {Array} userRoles - Array of user roles
 * @returns {boolean} True if user has seller role
 */
export const isSeller = (userRoles) => {
  return hasRole(userRoles, 'seller');
};

/**
 * Check if user can manage properties (admin or seller)
 * @param {Array} userRoles - Array of user roles
 * @returns {boolean} True if user can manage properties
 */
export const canManageProperties = (userRoles) => {
  return isAdmin(userRoles) || isSeller(userRoles);
};
