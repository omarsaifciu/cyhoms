# Database Fix Instructions

## Problem
When changing user type to "agent", you get this error:
```
Error updating user type: new row for relation "profiles" violates check constraint "profiles_user_type_check"
```

## Solution
The database constraint still only allows 'seller' but not 'agent'. You need to update it.

## Steps to Fix

### Method 1: Using Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the content from `fix_user_type_database.sql` file
5. Run the SQL code

### Method 2: Using Supabase CLI (if available)
```bash
supabase db push
```

## What the Fix Does
1. Updates all existing 'seller' records to 'agent'
2. Drops the old constraint
3. Adds new constraint that allows 'agent'
4. Updates database functions
5. Verifies the changes

## After Running the Fix
- Changing user type to "agent" will work
- All existing functionality will continue to work
- Translations will display correctly

## Verification
After running the SQL, try changing a user type to "agent" in the admin panel. It should work without errors.

## Files Updated in Code
- All TypeScript interfaces now use 'agent' instead of 'seller'
- All components updated to use correct types
- Translations already support the new terminology

The only thing needed is to run the database fix SQL code.
