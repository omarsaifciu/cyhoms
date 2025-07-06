
-- إنشاء جدول الإشعارات
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- الشخص الذي تظهر له الإشعارات
  type TEXT NOT NULL,                    -- نوع الإشعار (مثلاً: new_comment)
  message TEXT NOT NULL,                 -- نص الإشعار
  related_property_id UUID,              -- للعقار المعني (اختياري)
  related_comment_id UUID,               -- للتعليق المعني (اختياري)
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- سياسة: فقط صاحب الإشعار يمكنه مشاهدة إشعاراته
CREATE POLICY "يمكن للمستخدم رؤية إشعاراته فقط"
  ON public.notifications
  FOR SELECT 
  USING (user_id = auth.uid());

-- سياسة: فقط صاحب الإشعار يمكنه التعديل
CREATE POLICY "يمكن للمستخدم تعديل إشعاراته فقط"
  ON public.notifications
  FOR UPDATE 
  USING (user_id = auth.uid());

-- سياسة: فقط النظام أو المستخدم المعني يمكنه إنشاء إشعار لنفسه
CREATE POLICY "يمكن النظام أو المستخدم إنشاء إشعار لنفسه"
  ON public.notifications
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

