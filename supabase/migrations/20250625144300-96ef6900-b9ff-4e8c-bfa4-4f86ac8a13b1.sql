
-- إضافة عمود لتتبع من قام بإخفاء العقار
ALTER TABLE public.properties 
ADD COLUMN hidden_by_admin boolean DEFAULT false;

-- تحديث دالة تسجيل الأنشطة لتتبع تغييرات الحالة بشكل أفضل
CREATE OR REPLACE FUNCTION public.log_property_activity()
RETURNS TRIGGER AS $$
DECLARE
    action_type_val TEXT;
    action_details_val JSONB;
    performer_id UUID;
    is_admin_user boolean;
BEGIN
    -- Get the current user ID
    performer_id := auth.uid();
    
    -- Check if the current user is admin
    is_admin_user := public.is_admin();
    
    IF TG_OP = 'DELETE' THEN
        action_type_val := 'deleted';
        action_details_val := jsonb_build_object(
            'deleted_at', now(),
            'performed_by_admin', is_admin_user
        );
        
        INSERT INTO public.property_activities (
            property_id,
            action_type,
            action_details,
            performed_by,
            property_title,
            property_owner_id
        ) VALUES (
            OLD.id,
            action_type_val,
            action_details_val,
            performer_id,
            COALESCE(OLD.title_ar, OLD.title_en, OLD.title_tr, OLD.title),
            OLD.created_by
        );
        
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Check if status changed
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            action_type_val := 'status_changed';
            action_details_val := jsonb_build_object(
                'old_status', OLD.status,
                'new_status', NEW.status,
                'changed_at', now(),
                'performed_by_admin', is_admin_user
            );
            
            -- If admin is hiding the property, mark it as hidden by admin
            IF is_admin_user AND NEW.status IN ('pending', 'hidden') THEN
                NEW.hidden_by_admin := true;
            -- If seller is changing status and it's not hidden by admin, allow it
            ELSIF NOT is_admin_user AND NOT OLD.hidden_by_admin THEN
                NEW.hidden_by_admin := false;
            -- If seller tries to change status but it was hidden by admin, prevent it
            ELSIF NOT is_admin_user AND OLD.hidden_by_admin AND NEW.status = 'available' THEN
                -- Revert the status change
                NEW.status := OLD.status;
                NEW.hidden_by_admin := OLD.hidden_by_admin;
                -- Don't log this as it's not allowed
                RETURN NEW;
            END IF;
            
            INSERT INTO public.property_activities (
                property_id,
                action_type,
                action_details,
                performed_by,
                property_title,
                property_owner_id
            ) VALUES (
                NEW.id,
                action_type_val,
                action_details_val,
                performer_id,
                COALESCE(NEW.title_ar, NEW.title_en, NEW.title_tr, NEW.title),
                NEW.created_by
            );
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
