
-- Create a table for language settings
CREATE TABLE public.language_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code TEXT NOT NULL UNIQUE,
  language_name_ar TEXT NOT NULL,
  language_name_en TEXT NOT NULL,
  language_name_tr TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default language settings
INSERT INTO public.language_settings (language_code, language_name_ar, language_name_en, language_name_tr, is_enabled, is_default) VALUES
('ar', 'العربية', 'Arabic', 'Arapça', true, false),
('en', 'الإنجليزية', 'English', 'İngilizce', true, true),
('tr', 'التركية', 'Turkish', 'Türkçe', true, false);

-- Add Row Level Security (RLS)
ALTER TABLE public.language_settings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows reading language settings for everyone
CREATE POLICY "Anyone can view language settings" 
  ON public.language_settings 
  FOR SELECT 
  USING (true);

-- Create policy that allows only admins to modify language settings
CREATE POLICY "Only admins can modify language settings" 
  ON public.language_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
