
# Complete Authentication & Role-Based Access Control Guide

This implementation provides a robust, production-ready authentication system with role-based access control using Supabase, React, and TypeScript.

## 🏗️ Architecture Overview

### Core Components

1. **`useAuth` Hook** - Central authentication state management
2. **`AuthProvider`** - React context provider for auth state
3. **`ProtectedRoute`** - Route-level access control
4. **`usePropertyActions`** - Business logic with permission enforcement

### Database Schema

- **`profiles`** - User profile data (1-to-1 with auth.users)
- **`user_roles`** - Role assignments (user_id + role, multiple roles per user)
- **`properties`** - Property listings with RLS enforcement

## 🚀 Quick Start

### 1. Setup the AuthProvider

Wrap your app with the AuthProvider in your main App component:

```tsx
import { AuthProvider } from '@/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Your app routes */}
      </Router>
    </AuthProvider>
  );
}
```

### 2. Use Authentication in Components

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, profile, isAdmin, isSeller, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {profile?.full_name || 'User'}!</h1>
      {isAdmin && <AdminPanel />}
      {isSeller && <SellerDashboard />}
    </div>
  );
}
```

### 3. Protect Routes

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Require authentication
<ProtectedRoute>
  <UserDashboard />
</ProtectedRoute>

// Require admin role
<ProtectedRoute requireAdmin>
  <AdminPanel />
</ProtectedRoute>

// Require seller role (admins also have access)
<ProtectedRoute requireSeller>
  <SellerDashboard />
</ProtectedRoute>
```

## 🔒 Row Level Security (RLS) Integration

The system automatically handles permissions through Supabase RLS policies:

### Property Management Example

```tsx
import { usePropertyActions } from '@/hooks/usePropertyActions';

function PropertyManager() {
  const { handleCreateProperty, handleDeleteProperty } = usePropertyActions();

  // Create property - automatically sets user_id to current user
  const createProperty = async () => {
    const { data, error } = await handleCreateProperty({
      title: "Beautiful Apartment",
      price: 1200,
      city: "Berlin"
    });
    
    if (error) {
      console.error('Failed to create:', error.message);
    }
  };

  // Delete property - RLS enforces permissions automatically
  const deleteProperty = async (propertyId: string) => {
    const { error } = await handleDeleteProperty(propertyId);
    
    if (error) {
      // Will show permission error if user doesn't own the property
      console.error('Failed to delete:', error.message);
    }
  };
}
```

## 📋 Permission Matrix

| Action | Regular User | Seller | Admin |
|--------|-------------|---------|-------|
| View properties | ✅ All | ✅ All | ✅ All |
| Create properties | ❌ | ✅ | ✅ |
| Edit own properties | ❌ | ✅ | ✅ |
| Edit any property | ❌ | ❌ | ✅ |
| Delete own properties | ❌ | ✅ | ✅ |
| Delete any property | ❌ | ❌ | ✅ |

## 🎯 Key Features

### ✅ Complete Session Management
- Automatic session restoration on page refresh
- Real-time auth state synchronization
- Proper loading states and error handling

### ✅ Role-Based Access Control
- Multiple roles per user support
- Helper functions (isAdmin, isSeller)
- Automatic permission checking

### ✅ RLS Integration
- Backend security enforcement
- Frontend convenience methods
- Consistent permission patterns

### ✅ Production Ready
- Comprehensive error handling
- TypeScript type safety
- Performance optimizations
- Security best practices

## 🔧 Advanced Usage

### Custom Role Checks

```tsx
const { roles } = useAuth();
const hasSpecialAccess = roles.includes('moderator') || roles.includes('admin');
```

### Manual Auth Refresh

```tsx
const { refreshAuth } = useAuth();

// Refresh user data after role changes
await refreshAuth();
```

### Sign In/Out

```tsx
const { signIn, signOut } = useAuth();

const handleLogin = async () => {
  const { error } = await signIn(email, password);
  if (error) console.error('Login failed:', error.message);
};

const handleLogout = async () => {
  const { error } = await signOut();
  if (error) console.error('Logout failed:', error.message);
};
```

This system provides a solid foundation for building secure, role-based applications with Supabase and React.
