
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyForCard } from "@/types/property";
import { useAuth } from "@/contexts/AuthContext";

const transformPropertyToCard = (property: Property): PropertyForCard => {
  const finalImage = property.cover_image || (Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : '/placeholder.svg');

  return {
    id: property.id,
    title: property.title || property.title_en || property.title_ar || property.title_tr || '',
    location: `${property.city || ''}, ${property.district || ''}`.replace(/^, |, $/, ''),
    city: property.city || '',
    district: property.district || '',
    price: property.price || 0,
    currency: property.currency || 'EUR',
    deposit: property.deposit || 0,
    commission: property.commission || 0,
    deposit_currency: property.deposit_currency,
    commission_currency: property.commission_currency,
    beds: property.bedrooms || 0,
    baths: property.bathrooms || 0,
    area: property.area || 0,
    image: finalImage,
    featured: property.is_featured || false,
    is_featured: property.is_featured || false, // Keep both for compatibility
    rating: 0, // Default rating
    type: property.property_type,
    listing_type: property.listing_type,
    images: Array.isArray(property.images) ? property.images : [],
    is_student_housing: property.is_student_housing,
    student_housing_gender: property.student_housing_gender,
    status: property.status,
    hidden_by_admin: property.hidden_by_admin,
    created_at: property.created_at,
  };
};

export const usePropertyData = () => {
  const [properties, setProperties] = useState<PropertyForCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('Fetching properties...');
      
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_types (
            id,
            name_ar,
            name_en,
            name_tr,
            is_active,
            created_at,
            created_by,
            updated_at
          ),
          property_layouts (
            id,
            name_ar,
            name_en,
            name_tr
          ),
          profiles!inner (
            id,
            full_name,
            avatar_url,
            whatsapp_number,
            is_suspended
          )
        `)
        .eq('profiles.is_suspended', false);

      // Only exclude hidden properties for non-admin users
      if (!isAdmin) {
        query = query
          .eq('status', 'available')
          .neq('hidden_by_admin', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        // Try a simpler query if the complex one fails
        let simpleQuery = supabase
          .from('properties')
          .select('*');

        // Only exclude hidden properties for non-admin users
        if (!isAdmin) {
          simpleQuery = simpleQuery
            .eq('status', 'available')
            .neq('hidden_by_admin', true);
        }

        const { data: simpleData, error: simpleError } = await simpleQuery
          .order('created_at', { ascending: false });
        
        if (simpleError) {
          console.error('Simple query also failed:', simpleError);
          throw simpleError;
        }
        
        console.log('Simple query succeeded, using basic data:', simpleData?.length || 0);
        // Type cast to handle Json vs string[] mismatch
        const typedSimpleData = (simpleData || []).map(property => ({
          ...property,
          images: Array.isArray(property.images) ? property.images : 
                  typeof property.images === 'string' ? [property.images] : []
        })) as Property[];
        setProperties(typedSimpleData.map(transformPropertyToCard));
      } else {
        console.log('Complex query succeeded:', data?.length || 0);
        // Type cast to handle Json vs string[] mismatch and property_types structure
        const typedData = (data || []).map(property => ({
          ...property,
          images: Array.isArray(property.images) ? property.images :
                  typeof property.images === 'string' ? [property.images] : [],
          property_types: property.property_types ? {
            ...property.property_types,
            id: property.property_types.id || property.property_type_id || ''
          } : undefined
        })) as Property[];

        // Debug: Check featured properties in the data
        const featuredInData = typedData.filter(p => p.is_featured === true);
        console.log('🌟 Properties with is_featured=true in fetched data:', featuredInData.length);
        if (featuredInData.length > 0) {
          console.log('Featured properties details:', featuredInData.map(p => ({
            id: p.id,
            title: p.title_ar || p.title_en || p.title_tr || 'No title',
            is_featured: p.is_featured,
            status: p.status
          })));
        }

        setProperties(typedData.map(transformPropertyToCard));
      }
    } catch (error) {
      console.error('Error in fetchProperties:', error);
      // Final fallback - try to get any properties at all
      try {
        let fallbackQuery = supabase
          .from('properties')
          .select('*');

        // Only exclude hidden properties for non-admin users
        if (!isAdmin) {
          fallbackQuery = fallbackQuery
            .eq('status', 'available')
            .neq('hidden_by_admin', true);
        }

        const { data: fallbackData } = await fallbackQuery.limit(50);
        
        console.log('Fallback query result:', fallbackData?.length || 0);
        // Type cast to handle Json vs string[] mismatch
        const typedFallbackData = (fallbackData || []).map(property => ({
          ...property,
          images: Array.isArray(property.images) ? property.images : 
                  typeof property.images === 'string' ? [property.images] : []
        })) as Property[];
        setProperties(typedFallbackData.map(transformPropertyToCard));
      } catch (fallbackError) {
        console.error('Even fallback failed:', fallbackError);
        setProperties([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [isAdmin]);

  return {
    properties,
    loading,
    fetchProperties
  };
};
