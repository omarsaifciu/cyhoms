
-- إنشاء جدول التقييمات
CREATE TABLE public.site_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.site_reviews ENABLE ROW LEVEL SECURITY;

-- سياسة للمستخدمين لرؤية التقييمات المعتمدة فقط
CREATE POLICY "Users can view approved reviews" 
  ON public.site_reviews 
  FOR SELECT 
  USING (is_approved = true);

-- سياسة للمستخدمين لإنشاء تقييماتهم الخاصة
CREATE POLICY "Users can create their own reviews" 
  ON public.site_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- سياسة للمستخدمين لتعديل تقييماتهم الخاصة (غير المعتمدة فقط)
CREATE POLICY "Users can update their own unapproved reviews" 
  ON public.site_reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id AND is_approved = false);

-- سياسة للأدمن لرؤية جميع التقييمات
CREATE POLICY "Admins can view all reviews" 
  ON public.site_reviews 
  FOR ALL 
  USING (is_admin());

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX idx_site_reviews_approved ON public.site_reviews(is_approved);
CREATE INDEX idx_site_reviews_user_id ON public.site_reviews(user_id);
