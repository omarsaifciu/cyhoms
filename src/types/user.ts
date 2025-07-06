
export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string;
  user_type: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support';
  is_approved: boolean;
  is_verified?: boolean;
  is_suspended?: boolean;
  suspension_end_date?: string | null;
  suspension_reason?: string | null;
  suspension_reason_ar?: string | null;
  suspension_reason_en?: string | null;
  suspension_reason_tr?: string | null;
  language_preference: 'ar' | 'en' | 'tr';
  theme_preference: 'dark' | 'light' | 'system';
  username: string;
  avatar_url: string | null;
  whatsapp_number?: string;
  trial_started_at?: string;
  is_trial_active?: boolean;
  created_at: string;
  updated_at: string;
  web_push_token?: string;
  is_admin?: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  username: string;
  phone: string;
  whatsapp_number?: string;
  user_type: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support';
  terms_accepted: boolean;
}
