import { supabase } from '@/integrations/supabase/client';

export const createUserActivityTable = async () => {
  try {
    // Create the table
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create user_activity_logs table
        CREATE TABLE IF NOT EXISTS user_activity_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          action_type TEXT NOT NULL,
          action_details JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action_type ON user_activity_logs(action_type);

        -- Enable RLS (Row Level Security)
        ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
      `
    });

    if (createTableError) {
      console.error('Error creating table:', createTableError);
      return { success: false, error: createTableError };
    }

    // Create policies
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view own activity logs" ON user_activity_logs;
        DROP POLICY IF EXISTS "Users can insert own activity logs" ON user_activity_logs;
        DROP POLICY IF EXISTS "Admins can view all activity logs" ON user_activity_logs;
        DROP POLICY IF EXISTS "Admins can insert activity logs for any user" ON user_activity_logs;
        DROP POLICY IF EXISTS "admin_select_all" ON user_activity_logs;
        DROP POLICY IF EXISTS "admin_insert_all" ON user_activity_logs;
        DROP POLICY IF EXISTS "user_select_own" ON user_activity_logs;
        DROP POLICY IF EXISTS "user_insert_own" ON user_activity_logs;

        -- Create new working policies
        -- Allow admins to view all activity logs
        CREATE POLICY "admin_select_all" ON user_activity_logs
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE profiles.id = auth.uid()
              AND profiles.user_type = 'admin'
            )
          );

        -- Allow admins to insert activity logs for any user
        CREATE POLICY "admin_insert_all" ON user_activity_logs
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE profiles.id = auth.uid()
              AND profiles.user_type = 'admin'
            )
          );

        -- Allow users to view their own activity logs
        CREATE POLICY "user_select_own" ON user_activity_logs
          FOR SELECT USING (auth.uid() = user_id);

        -- Allow users to insert their own activity logs
        CREATE POLICY "user_insert_own" ON user_activity_logs
          FOR INSERT WITH CHECK (auth.uid() = user_id);
      `
    });

    if (policiesError) {
      console.error('Error creating policies:', policiesError);
      return { success: false, error: policiesError };
    }

    console.log('User activity table created successfully');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
};

// Alternative approach: Create table using direct SQL execution
export const createTableDirectly = async () => {
  try {
    // First, let's try to create the table using a simple approach
    const { error } = await supabase
      .from('user_activity_logs')
      .select('id')
      .limit(1);

    // If the table doesn't exist, we'll get an error
    if (error && error.message.includes('does not exist')) {
      console.log('Table does not exist, need to create it manually in Supabase dashboard');
      return { 
        success: false, 
        error: 'Table needs to be created manually in Supabase dashboard',
        instructions: `
          Please go to your Supabase dashboard and run this SQL:
          
          CREATE TABLE user_activity_logs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            action_type TEXT NOT NULL,
            action_details JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
          CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC);
          CREATE INDEX idx_user_activity_logs_action_type ON user_activity_logs(action_type);

          ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

          CREATE POLICY "Users can view own activity logs" ON user_activity_logs
            FOR SELECT USING (auth.uid() = user_id);

          CREATE POLICY "Users can insert own activity logs" ON user_activity_logs
            FOR INSERT WITH CHECK (auth.uid() = user_id);

          CREATE POLICY "Admins can view all activity logs" ON user_activity_logs
            FOR SELECT USING (
              EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.user_type = 'admin'
              )
            );

          CREATE POLICY "Admins can insert activity logs for any user" ON user_activity_logs
            FOR INSERT WITH CHECK (
              EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.user_type = 'admin'
              )
            );
        `
      };
    }

    console.log('Table already exists or accessible');
    return { success: true };
  } catch (err) {
    console.error('Error checking table:', err);
    return { success: false, error: err };
  }
};
