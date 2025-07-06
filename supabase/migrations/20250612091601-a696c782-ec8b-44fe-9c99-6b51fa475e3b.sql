
-- Add property_type_id column to property_layouts table to link layouts to specific property types
ALTER TABLE property_layouts 
ADD COLUMN IF NOT EXISTS property_type_id UUID REFERENCES property_types(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_property_layouts_property_type_id 
ON property_layouts(property_type_id);

-- Update existing layouts to have a property type (optional - you may want to do this manually)
-- This is just an example, you might want to assign specific layouts to specific types manually
UPDATE property_layouts 
SET property_type_id = (SELECT id FROM property_types LIMIT 1) 
WHERE property_type_id IS NULL;
