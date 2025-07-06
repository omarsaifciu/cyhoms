
-- إنشاء جدول contact_subjects إذا لم يكن موجودًا
CREATE TABLE IF NOT EXISTS public.contact_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- تفعيل RLS
ALTER TABLE public.contact_subjects ENABLE ROW LEVEL SECURITY;

-- سياسة قراءة
DROP POLICY IF EXISTS "Anyone can select contact subjects" ON public.contact_subjects;
CREATE POLICY "Anyone can select contact subjects"
  ON public.contact_subjects
  FOR SELECT
  USING (true);

-- سياسة إدخال
DROP POLICY IF EXISTS "Admins can insert contact subjects" ON public.contact_subjects;
CREATE POLICY "Admins can insert contact subjects"
  ON public.contact_subjects
  FOR INSERT
  WITH CHECK (is_admin());

-- سياسة تحديث
DROP POLICY IF EXISTS "Admins can update contact subjects" ON public.contact_subjects;
CREATE POLICY "Admins can update contact subjects"
  ON public.contact_subjects
  FOR UPDATE
  USING (is_admin());

-- سياسة حذف
DROP POLICY IF EXISTS "Admins can delete contact subjects" ON public.contact_subjects;
CREATE POLICY "Admins can delete contact subjects"
  ON public.contact_subjects
  FOR DELETE
  USING (is_admin());
