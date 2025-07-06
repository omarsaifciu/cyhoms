-- Check featured properties in database
SELECT 
  'Total Properties' as check_type,
  COUNT(*) as count
FROM properties;

SELECT 
  'Featured Properties' as check_type,
  COUNT(*) as count
FROM properties 
WHERE is_featured = true;

SELECT 
  'Available Featured Properties' as check_type,
  COUNT(*) as count
FROM properties 
WHERE is_featured = true AND status = 'available';

-- Show detailed info about featured properties
SELECT 
  id,
  COALESCE(title_ar, title_en, title_tr, 'No Title') as title,
  is_featured,
  status,
  city,
  created_at
FROM properties 
WHERE is_featured = true
ORDER BY created_at DESC;

-- Show all properties with their featured status
SELECT 
  id,
  COALESCE(title_ar, title_en, title_tr, 'No Title') as title,
  is_featured,
  status,
  city
FROM properties 
ORDER BY is_featured DESC, created_at DESC
LIMIT 10;
