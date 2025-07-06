
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string
          user_type: string
          username: string | null
          avatar_url: string | null
          whatsapp_number: string | null
          language_preference: string | null
          theme_preference: string | null
          is_approved: boolean | null
          is_verified: boolean | null
          is_suspended: boolean
          is_trial_active: boolean | null
          trial_started_at: string | null
          web_push_token: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          phone: string
          user_type: string
          username?: string | null
          avatar_url?: string | null
          whatsapp_number?: string | null
          language_preference?: string | null
          theme_preference?: string | null
          is_approved?: boolean | null
          is_verified?: boolean | null
          is_suspended?: boolean
          is_trial_active?: boolean | null
          trial_started_at?: string | null
          web_push_token?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string
          user_type?: string
          username?: string | null
          avatar_url?: string | null
          whatsapp_number?: string | null
          language_preference?: string | null
          theme_preference?: string | null
          is_approved?: boolean | null
          is_verified?: boolean | null
          is_suspended?: boolean
          is_trial_active?: boolean | null
          trial_started_at?: string | null
          web_push_token?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string | null
          description: string | null
          price: number | null
          city: string | null
          district: string | null
          property_type: string | null
          status: string | null
          listing_type: string | null
          bedrooms: number | null
          bathrooms: number | null
          area: number | null
          currency: string | null
          deposit: number | null
          deposit_currency: string | null
          commission: number | null
          commission_currency: string | null
          images: Json | null
          cover_image: string | null
          amenities: Json | null
          contact_info: Json | null
          is_featured: boolean | null
          is_student_housing: boolean | null
          student_housing_gender: string | null
          views_count: number | null
          user_id: string | null
          created_by: string
          created_at: string
          updated_at: string
          title_ar: string | null
          title_en: string | null
          title_tr: string | null
          description_ar: string | null
          description_en: string | null
          description_tr: string | null
          owner_name: string | null
          owner_avatar_url: string | null
          owner_whatsapp: string | null
          owner_email: string | null
          property_type_id: string | null
          property_layout_id: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          description?: string | null
          price?: number | null
          city?: string | null
          district?: string | null
          property_type?: string | null
          status?: string | null
          listing_type?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          area?: number | null
          currency?: string | null
          deposit?: number | null
          deposit_currency?: string | null
          commission?: number | null
          commission_currency?: string | null
          images?: Json | null
          cover_image?: string | null
          amenities?: Json | null
          contact_info?: Json | null
          is_featured?: boolean | null
          is_student_housing?: boolean | null
          student_housing_gender?: string | null
          views_count?: number | null
          user_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          owner_name?: string | null
          owner_avatar_url?: string | null
          owner_whatsapp?: string | null
          owner_email?: string | null
          property_type_id?: string | null
          property_layout_id?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          description?: string | null
          price?: number | null
          city?: string | null
          district?: string | null
          property_type?: string | null
          status?: string | null
          listing_type?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          area?: number | null
          currency?: string | null
          deposit?: number | null
          deposit_currency?: string | null
          commission?: number | null
          commission_currency?: string | null
          images?: Json | null
          cover_image?: string | null
          amenities?: Json | null
          contact_info?: Json | null
          is_featured?: boolean | null
          is_student_housing?: boolean | null
          student_housing_gender?: string | null
          views_count?: number | null
          user_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          owner_name?: string | null
          owner_avatar_url?: string | null
          owner_whatsapp?: string | null
          owner_email?: string | null
          property_type_id?: string | null
          property_layout_id?: string | null
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
