
-- تحديث حالة العقارات للمستخدمين المحظورين لإخفائها
UPDATE properties 
SET status = 'hidden' 
WHERE created_by IN (
  SELECT id FROM profiles WHERE is_suspended = true
);

-- إنشاء دالة لإخفاء عقارات المستخدم المحظور تلقائياً
CREATE OR REPLACE FUNCTION hide_suspended_user_properties()
RETURNS TRIGGER AS $$
BEGIN
  -- إذا تم حظر المستخدم، أخفِ جميع عقاراته
  IF NEW.is_suspended = true AND OLD.is_suspended = false THEN
    UPDATE properties 
    SET status = 'hidden' 
    WHERE created_by = NEW.id AND status != 'hidden';
  END IF;
  
  -- إذا تم إلغاء الحظر، أعد العقارات إلى حالة متاحة
  IF NEW.is_suspended = false AND OLD.is_suspended = true THEN
    UPDATE properties 
    SET status = 'available' 
    WHERE created_by = NEW.id AND status = 'hidden';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المشغل (trigger) لتطبيق الدالة عند تحديث حالة الحظر
DROP TRIGGER IF EXISTS on_user_suspension_change ON profiles;
CREATE TRIGGER on_user_suspension_change
  AFTER UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.is_suspended IS DISTINCT FROM NEW.is_suspended)
  EXECUTE FUNCTION hide_suspended_user_properties();
