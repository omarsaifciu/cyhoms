-- Create user_activity_logs table
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create policies
-- Users can view their own activity logs
CREATE POLICY "Users can view own activity logs" ON user_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own activity logs
CREATE POLICY "Users can insert own activity logs" ON user_activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs" ON user_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Admins can insert activity logs for any user
CREATE POLICY "Admins can insert activity logs for any user" ON user_activity_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Add some sample data for testing
INSERT INTO user_activity_logs (user_id, action_type, action_details) VALUES
-- Get a sample user ID (replace with actual user ID)
(
  (SELECT id FROM auth.users LIMIT 1),
  'property_created',
  '{"property_title": "شقة تجريبية في نيقوسيا", "property_type": "apartment", "price": 1200, "currency": "EUR"}'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'property_updated',
  '{"property_title": "فيلا محدثة في ليماسول", "property_type": "villa"}'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'property_hidden',
  '{"property_title": "عقار مخفي للاختبار", "is_hidden": true}'
);
