
-- Create property types table for managing property types (apartment, villa, etc.)
CREATE TABLE public.property_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property layouts table for managing layouts (Studio, 1+1, 2+1, etc.)
CREATE TABLE public.property_layouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  description_tr TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default property types
INSERT INTO public.property_types (name_ar, name_en, name_tr, created_by) VALUES
('شقة', 'Apartment', 'Daire', '00000000-0000-0000-0000-000000000000'),
('فيلا', 'Villa', 'Villa', '00000000-0000-0000-0000-000000000000'),
('استوديو', 'Studio', 'Stüdyo', '00000000-0000-0000-0000-000000000000'),
('منزل', 'House', 'Ev', '00000000-0000-0000-0000-000000000000'),
('مكتب', 'Office', 'Ofis', '00000000-0000-0000-0000-000000000000'),
('محل تجاري', 'Shop', 'Dükkan', '00000000-0000-0000-0000-000000000000');

-- Insert default property layouts
INSERT INTO public.property_layouts (name_ar, name_en, name_tr, description_ar, description_en, description_tr, created_by) VALUES
('استوديو', 'Studio', 'Stüdyo', 'مساحة واحدة مفتوحة تستخدم كغرفة معيشة ونوم ومطبخ', 'Open space used as living room, bedroom and kitchen', 'Oturma odası, yatak odası ve mutfak olarak kullanılan açık alan', '00000000-0000-0000-0000-000000000000'),
('1+1', '1+1', '1+1', 'غرفة نوم واحدة + صالة معيشة', 'One bedroom + living room', 'Bir yatak odası + oturma odası', '00000000-0000-0000-0000-000000000000'),
('2+1', '2+1', '2+1', 'غرفتا نوم + صالة معيشة', 'Two bedrooms + living room', 'İki yatak odası + oturma odası', '00000000-0000-0000-0000-000000000000'),
('3+1', '3+1', '3+1', 'ثلاث غرف نوم + صالة معيشة', 'Three bedrooms + living room', 'Üç yatak odası + oturma odası', '00000000-0000-0000-0000-000000000000'),
('4+1', '4+1', '4+1', 'أربع غرف نوم + صالة معيشة', 'Four bedrooms + living room', 'Dört yatak odası + oturma odası', '00000000-0000-0000-0000-000000000000'),
('5+1', '5+1', '5+1', 'خمس غرف نوم + صالة معيشة', 'Five bedrooms + living room', 'Beş yatak odası + oturma odası', '00000000-0000-0000-0000-000000000000'),
('دوبلكس', 'Duplex', 'Dubleks', 'شقة مكونة من طابقين', 'Apartment consisting of two floors', 'İki kattan oluşan daire', '00000000-0000-0000-0000-000000000000'),
('بنتهاوس', 'Penthouse', 'Çatı Katı', 'شقة في أعلى طابق من المبنى بمواصفات فاخرة', 'Apartment on the top floor of the building with luxury specifications', 'Lüks özelliklerle binanın en üst katındaki daire', '00000000-0000-0000-0000-000000000000');

-- Add new columns to properties table
ALTER TABLE public.properties 
ADD COLUMN property_type_id UUID REFERENCES public.property_types(id),
ADD COLUMN property_layout_id UUID REFERENCES public.property_layouts(id),
ADD COLUMN is_student_housing BOOLEAN DEFAULT false,
ADD COLUMN student_housing_gender TEXT CHECK (student_housing_gender IN ('male', 'female', 'mixed', 'unspecified')) DEFAULT 'unspecified';

-- Create index for better performance
CREATE INDEX idx_properties_type_layout ON public.properties(property_type_id, property_layout_id);
CREATE INDEX idx_properties_student_housing ON public.properties(is_student_housing, student_housing_gender);

-- Enable RLS on new tables
ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_layouts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for property_types
CREATE POLICY "Everyone can view active property types" ON public.property_types
FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage property types" ON public.property_types
FOR ALL USING (is_admin());

-- Create RLS policies for property_layouts  
CREATE POLICY "Everyone can view active property layouts" ON public.property_layouts
FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage property layouts" ON public.property_layouts
FOR ALL USING (is_admin());
