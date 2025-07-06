
export interface Property {
  id: string;
  title?: string;
  title_ar?: string;
  title_en?: string;
  title_tr?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  description_tr?: string;
  price?: number;
  currency?: string;
  listing_type?: string;
  deposit?: number;
  deposit_currency?: string;
  commission?: number;
  commission_currency?: string;
  city?: string;
  district?: string;
  property_type?: string;
  property_type_id?: string;
  property_layout_id?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  status?: string;
  images?: string[];
  cover_image?: string;
  is_featured?: boolean;
  is_student_housing?: boolean;
  student_housing_gender?: string;
  created_by?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  views_count?: number;
  owner_name?: string;
  owner_avatar_url?: string;
  owner_whatsapp?: string;
  owner_email?: string;
  hidden_by_admin?: boolean;
  property_types?: PropertyType;
}

export interface PropertyType {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  is_active?: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
}

export interface PropertyForCard {
  id: string;
  title: string;
  location: string;
  city: string;
  district: string;
  price: number;
  currency: string;
  deposit: number;
  commission: number;
  deposit_currency?: string;
  commission_currency?: string;
  beds: number;
  baths: number;
  area: number;
  image: string;
  featured: boolean;
  is_featured?: boolean; // Keep both for compatibility
  rating: number;
  type?: string;
  listing_type?: string;
  images: string[];
  is_student_housing?: boolean;
  student_housing_gender?: string;
  status?: string;
  hidden_by_admin?: boolean;
  created_at?: string;
}

export interface NewPropertyForm {
  title_ar: string;
  title_en: string;
  title_tr: string;
  description_ar: string;
  description_en: string;
  description_tr: string;
  price: string;
  currency: string;
  listing_type: string;
  deposit: string;
  deposit_currency: string;
  commission: string;
  commission_currency: string;
  city: string;
  district: string;
  property_type: string;
  property_layout_id?: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  status: string;
  images: string[];
  cover_image: string;
  is_featured: boolean;
  is_student_housing: boolean;
  student_housing_gender: string;
}
