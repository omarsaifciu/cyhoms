
-- جدول جديد لتخزين جميع توكنات إشعارات الويب لكل مستخدم (يُسمح بتكرار لكل جهاز/متصفح)
CREATE TABLE public.user_push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  web_push_token text NOT NULL,
  device_info text, -- يمكن استخدامه لاختياريًا لتخزين معلومات عن الجهاز/المتصفح
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- السماح للمستخدم بقراءة وحذف وإضافة توكناته فقط
ALTER TABLE public.user_push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "كل مستخدم يمكنه قراءة توكناته فقط"
  ON public.user_push_tokens
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "يمكن لكل مستخدم إضافة توكن باسمه"
  ON public.user_push_tokens
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "كل مستخدم يمكنه حذف توكناته فقط"
  ON public.user_push_tokens
  FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "كل مستخدم يمكنه تعديل توكناته فقط"
  ON public.user_push_tokens
  FOR UPDATE
  USING (user_id = auth.uid());

