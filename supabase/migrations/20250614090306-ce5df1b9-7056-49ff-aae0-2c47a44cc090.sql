
-- حذف السياسة القديمة التي تمنع الإدراج للآخرين
DROP POLICY IF EXISTS "يمكن النظام أو المستخدم إنشاء إشعار لنفسه" ON public.notifications;

-- سياسة جديدة: السماح بإدراج إشعار لأي مستخدم مصادق
CREATE POLICY "يمكن لأي مستخدم مصادق إدراج إشعار لأي مستخدم آخر"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
