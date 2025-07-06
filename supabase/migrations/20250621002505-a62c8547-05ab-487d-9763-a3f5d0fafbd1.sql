
-- Create table for property reports
CREATE TABLE public.property_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  reporter_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('inappropriate_content', 'false_information', 'spam', 'fraud', 'duplicate', 'other')),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user reports (reporting publishers/sellers)
CREATE TABLE public.user_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reporter_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('inappropriate_behavior', 'fake_listings', 'scam', 'harassment', 'fraud', 'other')),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_reports
CREATE POLICY "Users can create property reports" 
  ON public.property_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can view their own property reports" 
  ON public.property_reports 
  FOR SELECT 
  USING (auth.uid() = reporter_user_id OR public.is_admin());

CREATE POLICY "Admins can view all property reports" 
  ON public.property_reports 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update property reports" 
  ON public.property_reports 
  FOR UPDATE 
  USING (public.is_admin());

-- RLS Policies for user_reports
CREATE POLICY "Users can create user reports" 
  ON public.user_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can view their own user reports" 
  ON public.user_reports 
  FOR SELECT 
  USING (auth.uid() = reporter_user_id OR public.is_admin());

CREATE POLICY "Admins can view all user reports" 
  ON public.user_reports 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update user reports" 
  ON public.user_reports 
  FOR UPDATE 
  USING (public.is_admin());

-- Create indexes for performance
CREATE INDEX idx_property_reports_property_id ON public.property_reports(property_id);
CREATE INDEX idx_property_reports_reporter ON public.property_reports(reporter_user_id);
CREATE INDEX idx_property_reports_status ON public.property_reports(status);
CREATE INDEX idx_user_reports_reported_user ON public.user_reports(reported_user_id);
CREATE INDEX idx_user_reports_reporter ON public.user_reports(reporter_user_id);
CREATE INDEX idx_user_reports_status ON public.user_reports(status);
