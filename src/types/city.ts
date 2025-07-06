
export interface City {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  created_at: string;
  created_by: string;
  is_active: boolean;
}

export interface District {
  id: string;
  city_id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  created_at: string;
  created_by: string;
  is_active: boolean;
}

export interface NewCityForm {
  name_ar: string;
  name_en: string;
  name_tr: string;
}

export interface NewDistrictForm {
  city_id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
}
