
-- Create table to track property actions/activities
CREATE TABLE public.property_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'deleted', 'status_changed', 'created', 'updated'
  action_details JSONB, -- Store additional details like old_status, new_status
  performed_by UUID REFERENCES auth.users(id) NOT NULL,
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  property_title TEXT, -- Store property title for reference (in case property is deleted)
  property_owner_id UUID -- Store original property owner ID
);

-- Enable RLS
ALTER TABLE public.property_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all activities
CREATE POLICY "Admins can view all property activities"
  ON public.property_activities
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Create policy for users to insert their own activities
CREATE POLICY "Users can insert their own activities"
  ON public.property_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = performed_by);

-- Create index for better performance
CREATE INDEX idx_property_activities_property_id ON public.property_activities(property_id);
CREATE INDEX idx_property_activities_performed_by ON public.property_activities(performed_by);
CREATE INDEX idx_property_activities_action_type ON public.property_activities(action_type);

-- Create function to automatically log property activities
CREATE OR REPLACE FUNCTION public.log_property_activity()
RETURNS TRIGGER AS $$
DECLARE
    action_type_val TEXT;
    action_details_val JSONB;
    performer_id UUID;
BEGIN
    -- Get the current user ID
    performer_id := auth.uid();
    
    IF TG_OP = 'DELETE' THEN
        action_type_val := 'deleted';
        action_details_val := jsonb_build_object('deleted_at', now());
        
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
        -- Check if status changed to sold/rented
        IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('sold', 'rented') THEN
            action_type_val := 'status_changed';
            action_details_val := jsonb_build_object(
                'old_status', OLD.status,
                'new_status', NEW.status,
                'changed_at', now()
            );
            
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

-- Create triggers for property activities
CREATE TRIGGER property_activity_trigger
    AFTER UPDATE OR DELETE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.log_property_activity();
