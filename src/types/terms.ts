
export interface TermsAndConditions {
  id: string;
  title_ar: string | null;
  title_en: string | null;
  title_tr: string | null;
  content_ar: string | null;
  content_en: string | null;
  content_tr: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface NewTermsForm {
  title_ar: string;
  title_en: string;
  title_tr: string;
  content_ar: string;
  content_en: string;
  content_tr: string;
  is_active: boolean;
}
