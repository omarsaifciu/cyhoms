-- Create Cities and Districts Tables for Cyprus Rental Oasis
-- Run this in Supabase SQL Editor

-- 1. Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Create districts table
CREATE TABLE IF NOT EXISTS public.districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 3. Enable RLS on both tables
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for cities
CREATE POLICY "Everyone can view active cities" 
  ON public.cities 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anonymous users can view active cities" 
  ON public.cities 
  FOR SELECT 
  TO anon
  USING (is_active = true);

CREATE POLICY "Admins can manage cities" 
  ON public.cities 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- 5. Create RLS policies for districts
CREATE POLICY "Everyone can view active districts" 
  ON public.districts 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anonymous users can view active districts" 
  ON public.districts 
  FOR SELECT 
  TO anon
  USING (is_active = true);

CREATE POLICY "Admins can manage districts" 
  ON public.districts 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cities_name_en ON public.cities(name_en);
CREATE INDEX IF NOT EXISTS idx_cities_name_ar ON public.cities(name_ar);
CREATE INDEX IF NOT EXISTS idx_cities_is_active ON public.cities(is_active);
CREATE INDEX IF NOT EXISTS idx_districts_city_id ON public.districts(city_id);
CREATE INDEX IF NOT EXISTS idx_districts_name_en ON public.districts(name_en);
CREATE INDEX IF NOT EXISTS idx_districts_is_active ON public.districts(is_active);

-- 7. Insert Cyprus cities data
INSERT INTO public.cities (name_ar, name_en, name_tr, is_active) VALUES
('نيقوسيا', 'Nicosia', 'Lefkoşa', true),
('ليماسول', 'Limassol', 'Limasol', true),
('لارنكا', 'Larnaca', 'Larnaka', true),
('بافوس', 'Paphos', 'Baf', true),
('فاماغوستا', 'Famagusta', 'Mağusa', true),
('كيرينيا', 'Kyrenia', 'Girne', true),
('أيا نابا', 'Ayia Napa', 'Ayia Napa', true),
('بروتاراس', 'Protaras', 'Protaras', true),
('بولا', 'Polis', 'Polis', true),
('بلاتريس', 'Platres', 'Platres', true)
ON CONFLICT DO NOTHING;

-- 8. Insert districts for major cities
-- Get city IDs for inserting districts
DO $$
DECLARE
    nicosia_id UUID;
    limassol_id UUID;
    larnaca_id UUID;
    paphos_id UUID;
    famagusta_id UUID;
    kyrenia_id UUID;
BEGIN
    -- Get city IDs
    SELECT id INTO nicosia_id FROM public.cities WHERE name_en = 'Nicosia';
    SELECT id INTO limassol_id FROM public.cities WHERE name_en = 'Limassol';
    SELECT id INTO larnaca_id FROM public.cities WHERE name_en = 'Larnaca';
    SELECT id INTO paphos_id FROM public.cities WHERE name_en = 'Paphos';
    SELECT id INTO famagusta_id FROM public.cities WHERE name_en = 'Famagusta';
    SELECT id INTO kyrenia_id FROM public.cities WHERE name_en = 'Kyrenia';

    -- Insert districts for Nicosia
    IF nicosia_id IS NOT NULL THEN
        INSERT INTO public.districts (city_id, name_ar, name_en, name_tr, is_active) VALUES
        (nicosia_id, 'أكروبوليس', 'Acropolis', 'Akropolis', true),
        (nicosia_id, 'أيوس دوميتيوس', 'Ayios Dometios', 'Ayios Dometios', true),
        (nicosia_id, 'إنجومي', 'Engomi', 'Engomi', true),
        (nicosia_id, 'لاكاتاميا', 'Lakatamia', 'Lakatamia', true),
        (nicosia_id, 'ستروفولوس', 'Strovolos', 'Strovolos', true),
        (nicosia_id, 'أيا باراسكيفي', 'Agia Paraskevi', 'Agia Paraskevi', true),
        (nicosia_id, 'دالي', 'Dali', 'Dali', true),
        (nicosia_id, 'جيري', 'Geri', 'Geri', true),
        (nicosia_id, 'كوكينوتريميثيا', 'Kokkinotrimithia', 'Kokkinotrimithia', true),
        (nicosia_id, 'لاتسيا', 'Latsia', 'Latsia', true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insert districts for Limassol
    IF limassol_id IS NOT NULL THEN
        INSERT INTO public.districts (city_id, name_ar, name_en, name_tr, is_active) VALUES
        (limassol_id, 'وسط المدينة', 'City Center', 'Şehir Merkezi', true),
        (limassol_id, 'المارينا', 'Marina', 'Marina', true),
        (limassol_id, 'جيرماسويا', 'Germasogeia', 'Germasogeia', true),
        (limassol_id, 'أيوس تيخوناس', 'Ayios Tychonas', 'Ayios Tychonas', true),
        (limassol_id, 'ميسا جيتونيا', 'Mesa Geitonia', 'Mesa Geitonia', true),
        (limassol_id, 'أيوس أثاناسيوس', 'Ayios Athanasios', 'Ayios Athanasios', true),
        (limassol_id, 'بولميديا', 'Polemidia', 'Polemidia', true),
        (limassol_id, 'يبسوناس', 'Ypsonas', 'Ypsonas', true),
        (limassol_id, 'كولوسي', 'Kolossi', 'Kolossi', true),
        (limassol_id, 'إرمي', 'Erimi', 'Erimi', true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insert districts for Larnaca
    IF larnaca_id IS NOT NULL THEN
        INSERT INTO public.districts (city_id, name_ar, name_en, name_tr, is_active) VALUES
        (larnaca_id, 'وسط لارنكا', 'Larnaca Center', 'Larnaka Merkez', true),
        (larnaca_id, 'فينيكودس', 'Finikoudes', 'Finikoudes', true),
        (larnaca_id, 'أرادبيو', 'Aradippou', 'Aradippou', true),
        (larnaca_id, 'ليفارا', 'Livadia', 'Livadia', true),
        (larnaca_id, 'كيتي', 'Kiti', 'Kiti', true),
        (larnaca_id, 'مينيو', 'Meneou', 'Meneou', true),
        (larnaca_id, 'دروميولاكسيا', 'Dromolaxia', 'Dromolaxia', true),
        (larnaca_id, 'أورودافني', 'Oroklini', 'Oroklini', true),
        (larnaca_id, 'بيلا', 'Pyla', 'Pyla', true),
        (larnaca_id, 'كالوبسيدا', 'Kalopsida', 'Kalopsida', true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insert districts for Paphos
    IF paphos_id IS NOT NULL THEN
        INSERT INTO public.districts (city_id, name_ar, name_en, name_tr, is_active) VALUES
        (paphos_id, 'كاتو بافوس', 'Kato Paphos', 'Kato Baf', true),
        (paphos_id, 'بانو بافوس', 'Pano Paphos', 'Pano Baf', true),
        (paphos_id, 'كورال باي', 'Coral Bay', 'Coral Bay', true),
        (paphos_id, 'بيغيا', 'Pegeia', 'Pegeia', true),
        (paphos_id, 'إيميا', 'Emba', 'Emba', true),
        (paphos_id, 'كيسونيرجا', 'Kissonerga', 'Kissonerga', true),
        (paphos_id, 'تالا', 'Tala', 'Tala', true),
        (paphos_id, 'كلوروكاس', 'Chlorakas', 'Chlorakas', true),
        (paphos_id, 'ميسوجي', 'Mesogi', 'Mesogi', true),
        (paphos_id, 'أناريتا', 'Anarita', 'Anarita', true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insert districts for Famagusta
    IF famagusta_id IS NOT NULL THEN
        INSERT INTO public.districts (city_id, name_ar, name_en, name_tr, is_active) VALUES
        (famagusta_id, 'وسط فاماغوستا', 'Famagusta Center', 'Mağusa Merkez', true),
        (famagusta_id, 'فاروشا', 'Varosha', 'Maraş', true),
        (famagusta_id, 'ديريينا', 'Deryneia', 'Deryneia', true),
        (famagusta_id, 'فريناروس', 'Frenaros', 'Frenaros', true),
        (famagusta_id, 'أفجولار', 'Avgorou', 'Avgorou', true),
        (famagusta_id, 'سوتيرا', 'Sotira', 'Sotira', true),
        (famagusta_id, 'أكانثو', 'Achna', 'Achna', true),
        (famagusta_id, 'ليوبيتري', 'Liopetri', 'Liopetri', true),
        (famagusta_id, 'زيجي', 'Xylotymbou', 'Xylotymbou', true),
        (famagusta_id, 'أورميديا', 'Ormideia', 'Ormideia', true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Insert districts for Kyrenia
    IF kyrenia_id IS NOT NULL THEN
        INSERT INTO public.districts (city_id, name_ar, name_en, name_tr, is_active) VALUES
        (kyrenia_id, 'وسط كيرينيا', 'Kyrenia Center', 'Girne Merkez', true),
        (kyrenia_id, 'بلابايس', 'Bellapais', 'Bellapais', true),
        (kyrenia_id, 'كارمي', 'Karmi', 'Karmi', true),
        (kyrenia_id, 'إديكو', 'Edremit', 'Edremit', true),
        (kyrenia_id, 'لابيثوس', 'Lapithos', 'Lapta', true),
        (kyrenia_id, 'كاتالكوي', 'Catalkoy', 'Çatalköy', true),
        (kyrenia_id, 'أكانثو', 'Akanthou', 'Akanthou', true),
        (kyrenia_id, 'كارافاس', 'Karavas', 'Karavas', true),
        (kyrenia_id, 'فاسيليا', 'Vasilia', 'Vasilia', true),
        (kyrenia_id, 'تيمبلوس', 'Templos', 'Templos', true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 9. Verify the data
SELECT 'Cities created:' as info, count(*) as count FROM public.cities;
SELECT 'Districts created:' as info, count(*) as count FROM public.districts;

-- 10. Show sample data
SELECT c.name_en as city, d.name_en as district 
FROM public.cities c 
JOIN public.districts d ON c.id = d.city_id 
ORDER BY c.name_en, d.name_en 
LIMIT 10;
