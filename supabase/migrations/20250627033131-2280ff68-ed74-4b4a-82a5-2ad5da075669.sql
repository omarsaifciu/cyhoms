
-- Create a storage bucket for contact form attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('contact_attachments', 'contact_attachments', false);

-- Create RLS policies for the contact_attachments bucket
CREATE POLICY "Allow authenticated users to upload contact attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'contact_attachments' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view their contact attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'contact_attachments' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow service role full access to contact attachments"
ON storage.objects FOR ALL
USING (bucket_id = 'contact_attachments')
WITH CHECK (bucket_id = 'contact_attachments');
