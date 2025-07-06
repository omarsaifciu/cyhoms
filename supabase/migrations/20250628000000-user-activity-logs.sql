-- Create table to track user activities
CREATE TABLE public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'property_created', 'property_updated', 'property_hidden', 'property_shown', 'property_deleted', 'property_sold'
  action_details JSONB DEFAULT '{}', -- Store additional details about the action
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own activities
CREATE POLICY "Users can view their own activities"
  ON public.user_activity_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for admins to view all activities
CREATE POLICY "Admins can view all activities"
  ON public.user_activity_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Create policy for users to insert their own activities
CREATE POLICY "Users can insert their own activities"
  ON public.user_activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_property_id ON public.user_activity_logs(property_id);
CREATE INDEX idx_user_activity_logs_action_type ON public.user_activity_logs(action_type);
CREATE INDEX idx_user_activity_logs_created_at ON public.user_activity_logs(created_at);

-- Create function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_property_id UUID DEFAULT NULL,
  p_action_type TEXT,
  p_action_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.user_activity_logs (
    user_id,
    property_id,
    action_type,
    action_details
  ) VALUES (
    p_user_id,
    p_property_id,
    p_action_type,
    p_action_details
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Create trigger function to automatically log property activities
CREATE OR REPLACE FUNCTION public.auto_log_property_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_type_val TEXT;
  action_details_val JSONB;
  user_id_val UUID;
BEGIN
  -- Get the current user ID
  user_id_val := auth.uid();
  
  -- Skip if no user (system operations)
  IF user_id_val IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  IF TG_OP = 'INSERT' THEN
    action_type_val := 'property_created';
    action_details_val := jsonb_build_object(
      'property_title', COALESCE(NEW.title_ar, NEW.title_en, NEW.title_tr, NEW.title),
      'property_type', NEW.property_type,
      'price', NEW.price,
      'currency', NEW.currency,
      'created_at', now()
    );
    
    PERFORM public.log_user_activity(
      user_id_val,
      NEW.id,
      action_type_val,
      action_details_val
    );
    
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check if property was hidden/shown
    IF OLD.is_hidden IS DISTINCT FROM NEW.is_hidden THEN
      IF NEW.is_hidden THEN
        action_type_val := 'property_hidden';
      ELSE
        action_type_val := 'property_shown';
      END IF;
      
      action_details_val := jsonb_build_object(
        'property_title', COALESCE(NEW.title_ar, NEW.title_en, NEW.title_tr, NEW.title),
        'is_hidden', NEW.is_hidden,
        'changed_at', now()
      );
      
      PERFORM public.log_user_activity(
        user_id_val,
        NEW.id,
        action_type_val,
        action_details_val
      );
    END IF;
    
    -- Check if property status changed to sold/rented
    IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('sold', 'rented') THEN
      action_type_val := 'property_sold';
      action_details_val := jsonb_build_object(
        'property_title', COALESCE(NEW.title_ar, NEW.title_en, NEW.title_tr, NEW.title),
        'old_status', OLD.status,
        'new_status', NEW.status,
        'changed_at', now()
      );
      
      PERFORM public.log_user_activity(
        user_id_val,
        NEW.id,
        action_type_val,
        action_details_val
      );
    END IF;
    
    -- Check if property was updated (excluding status and hidden changes)
    IF (OLD.title_ar IS DISTINCT FROM NEW.title_ar OR
        OLD.title_en IS DISTINCT FROM NEW.title_en OR
        OLD.title_tr IS DISTINCT FROM NEW.title_tr OR
        OLD.price IS DISTINCT FROM NEW.price OR
        OLD.description_ar IS DISTINCT FROM NEW.description_ar OR
        OLD.description_en IS DISTINCT FROM NEW.description_en OR
        OLD.description_tr IS DISTINCT FROM NEW.description_tr) THEN
      
      action_type_val := 'property_updated';
      action_details_val := jsonb_build_object(
        'property_title', COALESCE(NEW.title_ar, NEW.title_en, NEW.title_tr, NEW.title),
        'updated_at', now()
      );
      
      PERFORM public.log_user_activity(
        user_id_val,
        NEW.id,
        action_type_val,
        action_details_val
      );
    END IF;
    
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    action_type_val := 'property_deleted';
    action_details_val := jsonb_build_object(
      'property_title', COALESCE(OLD.title_ar, OLD.title_en, OLD.title_tr, OLD.title),
      'deleted_at', now()
    );
    
    PERFORM public.log_user_activity(
      user_id_val,
      OLD.id,
      action_type_val,
      action_details_val
    );
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic activity logging
DROP TRIGGER IF EXISTS user_activity_trigger ON public.properties;
CREATE TRIGGER user_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_log_property_activity();
