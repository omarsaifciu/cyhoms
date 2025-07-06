
-- Create admin_management table for managing admin users
CREATE TABLE public.admin_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on admin_management table
ALTER TABLE public.admin_management ENABLE ROW LEVEL SECURITY;

-- Create policy that only allows admins to manage admin_management table
CREATE POLICY "Only admins can manage admin_management" 
  ON public.admin_management 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
