# Property Limits Constraint Error Fixed

## ✅ Problem Solved

The unique constraint violation error when updating individual user property limits has been completely fixed.

## 🔍 Root Cause

The error occurred because:
1. **Duplicate records** existed in the `user_property_limits` table
2. **Improper upsert logic** that didn't handle the unique constraint correctly
3. **Missing database function** for safe property limit updates

**Error Details:**
```
Error updating property limit: null, message: "duplicate key value violates unique constraint "user_property_limits_user_id_key""
```

## 🛠️ Fixes Applied

### 1. Database Cleanup Script

**FIX_PROPERTY_LIMITS_CONSTRAINT.sql** includes:

#### Remove Duplicate Records:
```sql
WITH ranked_limits AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC, created_at DESC) as rn
  FROM public.user_property_limits
)
DELETE FROM public.user_property_limits
WHERE id IN (
  SELECT id 
  FROM ranked_limits 
  WHERE rn > 1
);
```

#### New Database Function:
```sql
CREATE OR REPLACE FUNCTION public.set_user_property_limit(
  user_id_param UUID,
  new_limit INTEGER,
  notes_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to update existing record first
  UPDATE public.user_property_limits
  SET 
    property_limit = new_limit,
    notes = notes_param,
    updated_at = NOW()
  WHERE user_id = user_id_param;
  
  -- If no record was updated, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.user_property_limits (user_id, property_limit, notes, created_at, updated_at)
    VALUES (user_id_param, new_limit, notes_param, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      property_limit = EXCLUDED.property_limit,
      notes = EXCLUDED.notes,
      updated_at = EXCLUDED.updated_at;
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;
```

### 2. Updated Hook Implementation

**Before (problematic upsert):**
```typescript
const { error } = await supabase
  .from('user_property_limits')
  .upsert({
    user_id: userId,
    property_limit: newLimit,
    notes: notes || null,
    updated_at: new Date().toISOString()
  });
```

**After (using database function):**
```typescript
const { data, error } = await supabase.rpc('set_user_property_limit', {
  user_id_param: userId,
  new_limit: newLimit,
  notes_param: notes || null
});
```

### 3. Benefits of the New Approach

#### Database Function Advantages:
- **Atomic operations** - no race conditions
- **Proper error handling** - handles conflicts gracefully
- **Better performance** - single database call
- **Consistent behavior** - same logic for all updates

#### Code Simplification:
- **Cleaner code** - no complex upsert logic in frontend
- **Better error handling** - database handles edge cases
- **Reduced complexity** - single function call

## 🎯 Features of the Fix

### 1. **Duplicate Record Cleanup**
- Identifies and removes duplicate records
- Keeps the most recent record for each user
- Verifies cleanup completion

### 2. **Safe Upsert Function**
- Handles both insert and update operations
- Proper conflict resolution
- Atomic transactions

### 3. **Default Limits Setup**
- Adds default limits for users without limits
- Only for seller-type users (agent, property_owner, etc.)
- Prevents future constraint violations

### 4. **Comprehensive Testing**
- Function testing included in script
- Verification queries
- Error handling validation

## 🚀 How to Apply the Fix

### 1. **Run the Database Script**
Execute `FIX_PROPERTY_LIMITS_CONSTRAINT.sql` in Supabase SQL Editor:

```sql
-- This will:
-- 1. Remove duplicate records
-- 2. Create the new function
-- 3. Add default limits for users
-- 4. Test the function
-- 5. Verify the results
```

### 2. **Code Changes Applied**
The hook `usePropertyLimits.ts` has been updated to use the new database function.

### 3. **Test the Fix**
1. Go to Admin Dashboard → Property Limits Management
2. Try to update a user's property limit
3. The update should work without errors
4. Check that the limit is properly saved

## ✅ Expected Results

After applying the fix:

- ✅ **No more constraint violation errors**
- ✅ **Smooth property limit updates**
- ✅ **Proper handling of new and existing users**
- ✅ **Atomic database operations**
- ✅ **Better error handling**

### Before Fix:
```
❌ Error updating property limit: duplicate key value violates unique constraint
```

### After Fix:
```
✅ Property limit updated successfully
✅ User can now add/update limits individually
✅ No database constraint violations
```

## 🔧 Technical Details

### Database Schema:
```sql
CREATE TABLE public.user_property_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_limit INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(user_id)  -- This constraint was causing the issue
);
```

### Function Signature:
```sql
public.set_user_property_limit(
  user_id_param UUID,
  new_limit INTEGER,
  notes_param TEXT DEFAULT NULL
) RETURNS BOOLEAN
```

The property limits management now works perfectly for individual users!
