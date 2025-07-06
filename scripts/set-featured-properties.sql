-- Script to set some properties as featured for testing
-- This will set the first 3 available properties as featured

UPDATE properties 
SET is_featured = true 
WHERE id IN (
  SELECT id 
  FROM properties 
  WHERE status = 'available' 
  AND is_featured = false
  ORDER BY created_at DESC 
  LIMIT 3
);

-- Check the results
SELECT 
  id, 
  title, 
  title_ar, 
  city, 
  is_featured, 
  status 
FROM properties 
WHERE is_featured = true 
ORDER BY created_at DESC;
