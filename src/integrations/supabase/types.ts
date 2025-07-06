export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_management: {
        Row: {
          admin_email: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          admin_email: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          admin_email?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          name_tr?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          name_tr?: string
        }
        Relationships: []
      }
      contact_settings: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          phone_number: string | null
          setting_key: string
          updated_at: string
          whatsapp_greeting: string | null
          whatsapp_greeting_ar: string | null
          whatsapp_greeting_en: string | null
          whatsapp_greeting_tr: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          phone_number?: string | null
          setting_key: string
          updated_at?: string
          whatsapp_greeting?: string | null
          whatsapp_greeting_ar?: string | null
          whatsapp_greeting_en?: string | null
          whatsapp_greeting_tr?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          phone_number?: string | null
          setting_key?: string
          updated_at?: string
          whatsapp_greeting?: string | null
          whatsapp_greeting_ar?: string | null
          whatsapp_greeting_en?: string | null
          whatsapp_greeting_tr?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      contact_subjects: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          name_tr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          name_tr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          name_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      districts: {
        Row: {
          city_id: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
        }
        Insert: {
          city_id: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
        }
        Update: {
          city_id?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          name_tr?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_backgrounds: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
        }
        Relationships: []
      }
      language_settings: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          is_enabled: boolean
          language_code: string
          language_name_ar: string
          language_name_en: string
          language_name_tr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          is_enabled?: boolean
          language_code: string
          language_name_ar: string
          language_name_en: string
          language_name_tr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          is_enabled?: boolean
          language_code?: string
          language_name_ar?: string
          language_name_en?: string
          language_name_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          category_id: string | null
          city: string | null
          contact_info: Json | null
          cover_image: string | null
          created_at: string | null
          currency: string | null
          custom_fields: Json | null
          description_ar: string | null
          description_en: string | null
          description_tr: string | null
          district: string | null
          id: string
          images: Json | null
          is_featured: boolean | null
          price: number | null
          status: string | null
          subcategory_id: string | null
          title_ar: string | null
          title_en: string | null
          title_tr: string | null
          updated_at: string | null
          user_id: string | null
          views_count: number | null
        }
        Insert: {
          category_id?: string | null
          city?: string | null
          contact_info?: Json | null
          cover_image?: string | null
          created_at?: string | null
          currency?: string | null
          custom_fields?: Json | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          district?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          price?: number | null
          status?: string | null
          subcategory_id?: string | null
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Update: {
          category_id?: string | null
          city?: string | null
          contact_info?: Json | null
          cover_image?: string | null
          created_at?: string | null
          currency?: string | null
          custom_fields?: Json | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          district?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          price?: number | null
          status?: string | null
          subcategory_id?: string | null
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      logo_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          logo_ar_dark_url: string | null
          logo_ar_light_url: string | null
          logo_en_dark_url: string | null
          logo_en_light_url: string | null
          logo_image_url: string | null
          logo_svg_code: string | null
          logo_text_ar: string | null
          logo_text_en: string | null
          logo_text_tr: string | null
          logo_tr_dark_url: string | null
          logo_tr_light_url: string | null
          logo_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_ar_dark_url?: string | null
          logo_ar_light_url?: string | null
          logo_en_dark_url?: string | null
          logo_en_light_url?: string | null
          logo_image_url?: string | null
          logo_svg_code?: string | null
          logo_text_ar?: string | null
          logo_text_en?: string | null
          logo_text_tr?: string | null
          logo_tr_dark_url?: string | null
          logo_tr_light_url?: string | null
          logo_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_ar_dark_url?: string | null
          logo_ar_light_url?: string | null
          logo_en_dark_url?: string | null
          logo_en_light_url?: string | null
          logo_image_url?: string | null
          logo_svg_code?: string | null
          logo_text_ar?: string | null
          logo_text_en?: string | null
          logo_text_tr?: string | null
          logo_tr_dark_url?: string | null
          logo_tr_light_url?: string | null
          logo_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_comment_id: string | null
          related_property_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_comment_id?: string | null
          related_property_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_comment_id?: string | null
          related_property_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_approved: boolean | null
          is_suspended: boolean
          is_trial_active: boolean | null
          is_verified: boolean | null
          language_preference: string | null
          phone: string
          suspended_by: string | null
          suspension_end_date: string | null
          suspension_reason: string | null
          suspension_reason_ar: string | null
          suspension_reason_en: string | null
          suspension_reason_tr: string | null
          theme_preference: string | null
          trial_started_at: string | null
          updated_at: string | null
          user_type: string
          username: string | null
          web_push_token: string | null
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_approved?: boolean | null
          is_suspended?: boolean
          is_trial_active?: boolean | null
          is_verified?: boolean | null
          language_preference?: string | null
          phone: string
          suspended_by?: string | null
          suspension_end_date?: string | null
          suspension_reason?: string | null
          suspension_reason_ar?: string | null
          suspension_reason_en?: string | null
          suspension_reason_tr?: string | null
          theme_preference?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          user_type: string
          username?: string | null
          web_push_token?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_approved?: boolean | null
          is_suspended?: boolean
          is_trial_active?: boolean | null
          is_verified?: boolean | null
          language_preference?: string | null
          phone?: string
          suspended_by?: string | null
          suspension_end_date?: string | null
          suspension_reason?: string | null
          suspension_reason_ar?: string | null
          suspension_reason_en?: string | null
          suspension_reason_tr?: string | null
          theme_preference?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          user_type?: string
          username?: string | null
          web_push_token?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: Json | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          commission: number | null
          commission_currency: string | null
          contact_info: Json | null
          cover_image: string | null
          created_at: string
          created_by: string
          currency: string | null
          deposit: number | null
          deposit_currency: string | null
          description: string | null
          description_ar: string | null
          description_en: string | null
          description_tr: string | null
          district: string | null
          hidden_by_admin: boolean | null
          id: string
          images: Json | null
          is_featured: boolean | null
          is_student_housing: boolean | null
          listing_type: string | null
          owner_avatar_url: string | null
          owner_email: string | null
          owner_name: string | null
          owner_whatsapp: string | null
          price: number | null
          property_layout_id: string | null
          property_type: string | null
          property_type_id: string | null
          status: string | null
          student_housing_gender: string | null
          title: string | null
          title_ar: string | null
          title_en: string | null
          title_tr: string | null
          updated_at: string
          user_id: string | null
          views_count: number | null
        }
        Insert: {
          amenities?: Json | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          commission?: number | null
          commission_currency?: string | null
          contact_info?: Json | null
          cover_image?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          deposit?: number | null
          deposit_currency?: string | null
          description?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          district?: string | null
          hidden_by_admin?: boolean | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          is_student_housing?: boolean | null
          listing_type?: string | null
          owner_avatar_url?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_whatsapp?: string | null
          price?: number | null
          property_layout_id?: string | null
          property_type?: string | null
          property_type_id?: string | null
          status?: string | null
          student_housing_gender?: string | null
          title?: string | null
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          updated_at?: string
          user_id?: string | null
          views_count?: number | null
        }
        Update: {
          amenities?: Json | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          commission?: number | null
          commission_currency?: string | null
          contact_info?: Json | null
          cover_image?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          deposit?: number | null
          deposit_currency?: string | null
          description?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          district?: string | null
          hidden_by_admin?: boolean | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          is_student_housing?: boolean | null
          listing_type?: string | null
          owner_avatar_url?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_whatsapp?: string | null
          price?: number | null
          property_layout_id?: string | null
          property_type?: string | null
          property_type_id?: string | null
          status?: string | null
          student_housing_gender?: string | null
          title?: string | null
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          updated_at?: string
          user_id?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_property_layout_id_fkey"
            columns: ["property_layout_id"]
            isOneToOne: false
            referencedRelation: "property_layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_type_id_fkey"
            columns: ["property_type_id"]
            isOneToOne: false
            referencedRelation: "property_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_activities: {
        Row: {
          action_details: Json | null
          action_type: string
          id: string
          performed_at: string
          performed_by: string
          property_id: string | null
          property_owner_id: string | null
          property_title: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          id?: string
          performed_at?: string
          performed_by: string
          property_id?: string | null
          property_owner_id?: string | null
          property_title?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          id?: string
          performed_at?: string
          performed_by?: string
          property_id?: string | null
          property_owner_id?: string | null
          property_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_activities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          is_approved: boolean
          parent_comment_id: string | null
          property_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          is_approved?: boolean
          parent_comment_id?: string | null
          property_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          parent_comment_id?: string | null
          property_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_property_comments_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "property_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_comments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_layouts: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
          property_type_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
          property_type_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          name_tr?: string
          property_type_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_layouts_property_type_id_fkey"
            columns: ["property_type_id"]
            isOneToOne: false
            referencedRelation: "property_types"
            referencedColumns: ["id"]
          },
        ]
      }
      property_report_types: {
        Row: {
          created_at: string
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          description_tr: string | null
          display_order: number
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          name_tr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          name_tr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          name_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          property_id: string
          reason: string
          report_type: string
          reporter_user_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          property_id: string
          reason: string
          report_type: string
          reporter_user_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          property_id?: string
          reason?: string
          report_type?: string
          reporter_user_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_reports_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          property_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          property_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          property_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_types: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          name_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_views: {
        Row: {
          created_at: string
          id: string
          property_id: string
          viewer_ip: string | null
          viewer_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          viewer_ip?: string | null
          viewer_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          viewer_ip?: string | null
          viewer_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      report_types: {
        Row: {
          category: string
          created_at: string
          description_ar: string | null
          description_en: string | null
          description_tr: string | null
          display_order: number
          id: string
          is_active: boolean
          key: string
          name_ar: string
          name_en: string
          name_tr: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          key: string
          name_ar: string
          name_en: string
          name_tr: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          key?: string
          name_ar?: string
          name_en?: string
          name_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          hero_description_ar: string | null
          hero_description_en: string | null
          hero_description_tr: string | null
          hero_title_ar: string | null
          hero_title_en: string | null
          hero_title_tr: string | null
          id: string
          setting_key: string
          setting_value_ar: string | null
          setting_value_en: string | null
          setting_value_tr: string | null
          suspension_message_ar: string | null
          suspension_message_en: string | null
          suspension_message_tr: string | null
          suspension_title_ar: string | null
          suspension_title_en: string | null
          suspension_title_tr: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hero_description_ar?: string | null
          hero_description_en?: string | null
          hero_description_tr?: string | null
          hero_title_ar?: string | null
          hero_title_en?: string | null
          hero_title_tr?: string | null
          id?: string
          setting_key: string
          setting_value_ar?: string | null
          setting_value_en?: string | null
          setting_value_tr?: string | null
          suspension_message_ar?: string | null
          suspension_message_en?: string | null
          suspension_message_tr?: string | null
          suspension_title_ar?: string | null
          suspension_title_en?: string | null
          suspension_title_tr?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hero_description_ar?: string | null
          hero_description_en?: string | null
          hero_description_tr?: string | null
          hero_title_ar?: string | null
          hero_title_en?: string | null
          hero_title_tr?: string | null
          id?: string
          setting_key?: string
          setting_value_ar?: string | null
          setting_value_en?: string | null
          setting_value_tr?: string | null
          suspension_message_ar?: string | null
          suspension_message_en?: string | null
          suspension_message_tr?: string | null
          suspension_title_ar?: string | null
          suspension_title_en?: string | null
          suspension_title_tr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          name_tr: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          name_tr?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      suspension_history: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          reason: string | null
          reason_ar: string | null
          reason_en: string | null
          reason_tr: string | null
          suspended_by: string
          suspension_duration: string | null
          suspension_end: string | null
          suspension_start: string | null
          suspension_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          reason_ar?: string | null
          reason_en?: string | null
          reason_tr?: string | null
          suspended_by: string
          suspension_duration?: string | null
          suspension_end?: string | null
          suspension_start?: string | null
          suspension_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          reason_ar?: string | null
          reason_en?: string | null
          reason_tr?: string | null
          suspended_by?: string
          suspension_duration?: string | null
          suspension_end?: string | null
          suspension_start?: string | null
          suspension_type?: string
          user_id?: string
        }
        Relationships: []
      }
      suspension_settings: {
        Row: {
          created_at: string | null
          id: string
          message_ar: string | null
          message_en: string | null
          message_tr: string | null
          setting_key: string
          title_ar: string | null
          title_en: string | null
          title_tr: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_ar?: string | null
          message_en?: string | null
          message_tr?: string | null
          setting_key: string
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_ar?: string | null
          message_en?: string | null
          message_tr?: string | null
          setting_key?: string
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      terms_and_conditions: {
        Row: {
          content_ar: string | null
          content_en: string | null
          content_tr: string | null
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          title_ar: string | null
          title_en: string | null
          title_tr: string | null
          updated_at: string
        }
        Insert: {
          content_ar?: string | null
          content_en?: string | null
          content_tr?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          updated_at?: string
        }
        Update: {
          content_ar?: string | null
          content_en?: string | null
          content_tr?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          title_ar?: string | null
          title_en?: string | null
          title_tr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      trial_settings: {
        Row: {
          created_at: string
          id: string
          is_trial_enabled: boolean
          trial_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_trial_enabled?: boolean
          trial_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_trial_enabled?: boolean
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_property_limits: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          property_limit: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          property_limit?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          property_limit?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_push_tokens: {
        Row: {
          created_at: string
          device_info: string | null
          id: string
          user_id: string
          web_push_token: string
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          id?: string
          user_id: string
          web_push_token: string
        }
        Update: {
          created_at?: string
          device_info?: string | null
          id?: string
          user_id?: string
          web_push_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_report_types: {
        Row: {
          created_at: string
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          description_tr: string | null
          display_order: number
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          name_tr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          name_tr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          name_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          reason: string
          report_type: string
          reported_user_id: string
          reporter_user_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          reason: string
          report_type: string
          reported_user_id: string
          reporter_user_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          reason?: string
          report_type?: string
          reported_user_id?: string
          reporter_user_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_approved: boolean
          property_id: string | null
          rating: number
          reviewed_user_id: string
          reviewer_user_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          property_id?: string | null
          rating: number
          reviewed_user_id: string
          reviewer_user_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          property_id?: string | null
          rating?: number
          reviewed_user_id?: string
          reviewer_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_add_property: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_and_update_temporary_suspensions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_my_permissions: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_unique_username: {
        Args: Record<PropertyKey, never> | { base_name: string }
        Returns: string
      }
      get_user_email_by_username: {
        Args: { username_input: string }
        Returns: string
      }
      get_user_property_count: {
        Args: { user_id_param: string }
        Returns: number
      }
      get_user_property_limit: {
        Args: { user_id_param: string }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      is_approved_seller: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_property_owner: {
        Args: { p_property_id: string }
        Returns: boolean
      }
      is_record_owner: {
        Args: { record_user_id: string }
        Returns: boolean
      }
      is_seller: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_specific_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_trial_expired: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user" | "seller"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user", "agent"],
    },
  },
} as const
