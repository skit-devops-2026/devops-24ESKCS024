CREATE POLICY "complaint images read own" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'complaint-images' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "complaint images insert own" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'complaint-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "complaint images update own" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'complaint-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "complaint images delete own" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'complaint-images' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));