
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/property";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usePropertyActions } from "@/hooks/usePropertyActions";

export const usePropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, isSeller } = useAuth();
  const { toast } = useToast();
  const { 
    handleCreateProperty, 
    handleDeleteProperty, 
    handleUpdateProperty,
    addingProperty 
  } = usePropertyActions();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('Fetching properties for user:', user?.email, 'isAdmin:', isAdmin, 'isSeller:', isSeller);
      
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_types(name_ar, name_en, name_tr),
          property_layouts(name_ar, name_en, name_tr)
        `);

      // If user is admin, they can see all properties
      if (isAdmin) {
        console.log('Admin user - fetching all properties');
        // No additional filters for admin
      } else if (isSeller) {
        // If user is seller, they can only see their own properties
        console.log('Seller user - fetching own properties');
        query = query.or(`created_by.eq.${user?.id},user_id.eq.${user?.id}`);
      } else {
        // Regular users can only see available properties that are not hidden by admin
        console.log('Regular user - fetching available properties');
        query = query
          .eq('status', 'available')
          .neq('hidden_by_admin', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        
        // Fallback to simpler query if complex query fails
        let fallbackQuery = supabase
          .from('properties')
          .select('*');

        if (isAdmin) {
          // Admin can see all properties
        } else if (isSeller) {
          fallbackQuery = fallbackQuery.or(`created_by.eq.${user?.id},user_id.eq.${user?.id}`);
        } else {
          fallbackQuery = fallbackQuery
            .eq('status', 'available')
            .neq('hidden_by_admin', true);
        }

        const { data: simpleData, error: simpleError } = await fallbackQuery
          .order('created_at', { ascending: false });
        
        if (simpleError) {
          console.error('Fallback query also failed:', simpleError);
          toast({
            title: "خطأ",
            description: "فشل في تحميل العقارات",
            variant: "destructive"
          });
          return;
        }
        
        console.log('Using fallback query result:', simpleData?.length || 0);
        const typedSimpleData = (simpleData || []).map(property => ({
          ...property,
          images: Array.isArray(property.images) ? property.images : 
                  typeof property.images === 'string' ? [property.images] : []
        })) as Property[];
        setProperties(typedSimpleData);
        return;
      }

      console.log('Properties fetched successfully:', data?.length || 0);
      // Type cast to handle Json vs string[] mismatch and property_types structure
      const typedProperties = (data || []).map(property => ({
        ...property,
        images: Array.isArray(property.images) ? property.images : 
                typeof property.images === 'string' ? [property.images] : [],
        property_types: property.property_types ? {
          ...property.property_types,
          id: property.property_type_id || '',
          is_active: true,
          created_at: new Date().toISOString(),
          created_by: property.created_by,
          updated_at: new Date().toISOString()
        } : undefined
      })) as Property[];

      setProperties(typedProperties);
    } catch (error) {
      console.error('Error in fetchProperties:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل العقارات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData: any) => {
    const success = await handleCreateProperty(propertyData);
    if (success) {
      await fetchProperties();
    }
    return success;
  };

  const deleteProperty = async (propertyId: string) => {
    const result = await handleDeleteProperty(propertyId);
    if (!result.error) {
      await fetchProperties();
      return true;
    }
    return false;
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: string) => {
    // Determine the new status based on current status
    let newStatus: string;

    if (currentStatus === 'available') {
      newStatus = 'hidden'; // Hide the property
    } else if (currentStatus === 'hidden') {
      newStatus = 'available'; // Show the property
    } else if (currentStatus === 'sold' || currentStatus === 'rented') {
      newStatus = 'available'; // Mark as available again
    } else {
      newStatus = 'sold'; // Mark as sold
    }

    console.log(`Toggling property ${propertyId} from ${currentStatus} to ${newStatus}`);

    const result = await handleUpdateProperty(propertyId, { status: newStatus });
    if (!result.error) {
      await fetchProperties();
    }
    return result;
  };

  const toggleFeaturedStatus = async (propertyId: string, currentFeatured: boolean) => {
    console.log(`Toggling featured status for property ${propertyId} from ${currentFeatured} to ${!currentFeatured}`);

    const result = await handleUpdateProperty(propertyId, { is_featured: !currentFeatured });
    if (!result.error) {
      await fetchProperties();
    }
    return result;
  };

  // Separate functions for specific actions
  const toggleHideStatus = async (propertyId: string, currentStatus: string) => {
    // Use 'pending' for hidden status to match AdminPropertyActions.tsx
    const isCurrentlyHidden = currentStatus === 'pending' || currentStatus === 'hidden';
    const newStatus = isCurrentlyHidden ? 'available' : 'pending';
    const isHiding = newStatus === 'pending';

    console.log(`Admin toggling hide status for property ${propertyId} from ${currentStatus} to ${newStatus}`);

    // When admin hides a property, set hidden_by_admin to true
    // When admin shows a property, set hidden_by_admin to false
    const updateData = {
      status: newStatus,
      hidden_by_admin: isHiding
    };

    const result = await handleUpdateProperty(propertyId, updateData);
    if (!result.error) {
      await fetchProperties();
    }
    return result;
  };

  const toggleSoldStatus = async (propertyId: string, currentStatus: string) => {
    const newStatus = (currentStatus === 'sold' || currentStatus === 'rented') ? 'available' : 'sold';
    console.log(`Toggling sold status for property ${propertyId} from ${currentStatus} to ${newStatus}`);

    const result = await handleUpdateProperty(propertyId, { status: newStatus });
    if (!result.error) {
      await fetchProperties();
    }
    return result;
  };

  useEffect(() => {
    if (user) {
      console.log('User detected, fetching properties...');
      fetchProperties();
    }
  }, [user, isAdmin, isSeller]);

  return {
    properties,
    loading,
    refetch: fetchProperties,
    // Admin panel compatibility
    isAdmin,
    addingProperty,
    user,
    addProperty,
    deleteProperty,
    togglePropertyStatus,
    toggleFeaturedStatus,
    toggleHideStatus,
    toggleSoldStatus,
    fetchProperties,
    // Seller compatibility
    handleDeleteProperty: deleteProperty,
  };
};
