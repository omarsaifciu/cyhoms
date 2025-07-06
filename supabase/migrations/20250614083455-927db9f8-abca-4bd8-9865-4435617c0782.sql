
-- أضف عمود دعم التعليق على التعليق (الردود)
ALTER TABLE public.property_comments 
ADD COLUMN parent_comment_id uuid NULL REFERENCES public.property_comments(id) ON DELETE CASCADE;

-- السماح لأي مستخدم بإضافة تعليق (وسيط، مالك، مستخدم عادي)
ALTER TABLE public.property_comments ENABLE ROW LEVEL SECURITY;

-- سياسة عرض التعليقات: يمكن للجميع رؤية تعليقات كل منشور
CREATE POLICY "Anyone can view property comments"
  ON public.property_comments
  FOR SELECT
  USING (true);

-- سياسة إضافة تعليق: أي مستخدم مسجل يمكن أن يضيف تعليق
CREATE POLICY "Anyone can insert property comment"
  ON public.property_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- سياسة التعديل: صاحب التعليق أو صاحب المنشور فقط يمكنه التعديل
CREATE POLICY "Comment owner or property owner can update comment"
  ON public.property_comments
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR property_id IN (
        SELECT id FROM public.properties WHERE created_by = auth.uid()
    )
  );

-- سياسة الحذف: صاحب التعليق أو صاحب المنشور فقط يمكنه الحذف
CREATE POLICY "Comment owner or property owner can delete comment"
  ON public.property_comments
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR property_id IN (
        SELECT id FROM public.properties WHERE created_by = auth.uid()
    )
  );
