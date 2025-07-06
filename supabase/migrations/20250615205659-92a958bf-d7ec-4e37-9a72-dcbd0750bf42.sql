
-- Create a new bucket for general site assets like 404 images, favicons, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-assets', 'site-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']);

-- Create policy to allow public read access to the site-assets bucket
CREATE POLICY "Site assets are publicly viewable"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'site-assets' );

-- Create policy to allow authenticated users to upload to the site-assets bucket
CREATE POLICY "Authenticated users can upload site assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'site-assets' );

-- Create policy to allow authenticated users to update their own site assets
-- Note: This is a simple policy. For more granular control, you might check owner.
CREATE POLICY "Authenticated users can update site assets"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'site-assets' );

-- Create policy to allow authenticated users to delete their own site assets
-- Note: This is a simple policy. For more granular control, you might check owner.
CREATE POLICY "Authenticated users can delete site assets"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'site-assets' );
