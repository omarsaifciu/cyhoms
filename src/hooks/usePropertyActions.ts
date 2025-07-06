
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import type { NewPropertyForm } from '@/types/property';
import { useActivityLogger } from '@/hooks/useActivityLogger';

type PropertyInsert = TablesInsert<'properties'>;
type PropertyRow = Tables<'properties'>;

/**
 * Custom hook for property-related actions that demonstrates proper
 * integration with the authentication system and RLS policies.
 */
export function usePropertyActions() {
  const { user, isAdmin, isSeller } = useAuth();
  const { logActivity } = useActivityLogger();

  /**
   * Example: Creating a Property
   * This function demonstrates how to use the auth user ID to correctly
   * set the user_id field when inserting a new property.
   */
  const handleCreateProperty = async (propertyData: NewPropertyForm): Promise<boolean> => {
    if (!user) {
      return false;
    }

    if (!isAdmin && !isSeller) {
      return false;
    }

    try {
      // Convert form data to database format
      const propertyToInsert: PropertyInsert = {
        title_ar: propertyData.title_ar,
        title_en: propertyData.title_en,
        title_tr: propertyData.title_tr,
        description_ar: propertyData.description_ar,
        description_en: propertyData.description_en,
        description_tr: propertyData.description_tr,
        price: parseFloat(propertyData.price) || 0,
        currency: propertyData.currency,
        deposit: parseFloat(propertyData.deposit) || 0,
        deposit_currency: propertyData.deposit_currency,
        commission: parseFloat(propertyData.commission) || 0,
        commission_currency: propertyData.commission_currency,
        city: propertyData.city,
        district: propertyData.district,
        property_type_id: propertyData.property_type,
        property_layout_id: propertyData.property_layout_id || null,
        listing_type: propertyData.listing_type,
        bedrooms: parseInt(propertyData.bedrooms) || null,
        bathrooms: parseInt(propertyData.bathrooms) || null,
        area: parseFloat(propertyData.area) || null,
        status: propertyData.status,
        images: propertyData.images,
        cover_image: propertyData.cover_image,
        is_featured: propertyData.is_featured,
        is_student_housing: propertyData.is_student_housing,
        student_housing_gender: propertyData.student_housing_gender,
        user_id: user.id,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(propertyToInsert)
        .select()
        .single();

      if (error) {
        console.error('Error creating property:', error);
        return false;
      }

      // Log the property creation activity
      try {
        await logActivity.propertyCreated({
          title: propertyData.title_ar || propertyData.title_en || propertyData.title_tr || 'New Property',
          type: propertyData.property_type,
          price: parseFloat(propertyData.price) || undefined,
          currency: propertyData.currency,
          location: `${propertyData.city}, ${propertyData.district}`,
          bedrooms: parseInt(propertyData.bedrooms) || undefined,
          bathrooms: parseInt(propertyData.bathrooms) || undefined,
          area: parseFloat(propertyData.area) || undefined,
          property_id: data.id
        });
        console.log('Property creation activity logged successfully');
      } catch (logError) {
        console.warn('Failed to log property creation activity:', logError);
        // Continue execution - logging failure shouldn't prevent property creation
      }

      console.log('Property created successfully:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error creating property:', error);
      return false;
    }
  };

  /**
   * Example: Deleting a Property
   * This function attempts to delete a property. RLS policies will automatically
   * enforce permission checks on the backend:
   * - Admin users can delete any property
   * - Seller users can only delete properties where properties.user_id matches their own ID
   * - Other users cannot delete any properties
   */
  const handleDeleteProperty = async (propertyId: string) => {
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    try {
      // First, get the property details for logging
      const { data: propertyData } = await supabase
        .from('properties')
        .select('title_ar, title_en, title_tr, id')
        .eq('id', propertyId)
        .single();

      // Delete related records first to avoid foreign key constraint issues
      console.log('Deleting related records for property:', propertyId);

      // Delete property activities first (if any exist)
      try {
        const { error: activitiesError } = await supabase
          .from('property_activities')
          .delete()
          .eq('property_id', propertyId);

        if (activitiesError) {
          console.warn('Error deleting property activities:', activitiesError);
          // Continue anyway as this might not exist
        }
      } catch (err) {
        console.warn('Exception deleting property activities:', err);
        // Continue anyway
      }

      // Skip user activity logs deletion for now to avoid conflicts
      // The database should handle this with ON DELETE SET NULL constraint
      console.log('Skipping user_activity_logs deletion - will be handled by database constraints');

      // Delete property views
      try {
        const { error: viewsError } = await supabase
          .from('property_views')
          .delete()
          .eq('property_id', propertyId);

        if (viewsError) {
          console.warn('Error deleting property views:', viewsError);
        }
      } catch (err) {
        console.warn('Exception deleting property views:', err);
      }

      // Delete favorites
      try {
        const { error: favoritesError } = await supabase
          .from('favorites')
          .delete()
          .eq('property_id', propertyId);

        if (favoritesError) {
          console.warn('Error deleting favorites:', favoritesError);
        }
      } catch (err) {
        console.warn('Exception deleting favorites:', err);
      }

      // Delete property reports
      try {
        const { error: reportsError } = await supabase
          .from('property_reports')
          .delete()
          .eq('property_id', propertyId);

        if (reportsError) {
          console.warn('Error deleting property reports:', reportsError);
        }
      } catch (err) {
        console.warn('Exception deleting property reports:', err);
      }

      // Delete property comments
      try {
        const { error: commentsError } = await supabase
          .from('property_comments')
          .delete()
          .eq('property_id', propertyId);

        if (commentsError) {
          console.warn('Error deleting property comments:', commentsError);
        }
      } catch (err) {
        console.warn('Exception deleting property comments:', err);
      }

      // Now delete the property itself
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) {
        console.error('Error deleting property:', error);
        // RLS will return a permission error if user doesn't have rights to delete this property
        return { error };
      }

      // Log the property deletion activity (only if property was successfully deleted)
      if (propertyData) {
        try {
          await logActivity.propertyDeleted({
            title: propertyData.title_ar || propertyData.title_en || propertyData.title_tr || 'Unknown Property',
            property_id: propertyId,
            reason: 'user_request'
          });
          console.log('Property deletion activity logged successfully');
        } catch (logError) {
          console.warn('Failed to log property deletion activity:', logError);
          // Continue execution - logging failure shouldn't prevent property deletion
        }
      }

      console.log('Property and all related records deleted successfully');
      return { error: null };
    } catch (error) {
      console.error('Unexpected error deleting property:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  /**
   * Example: Updating a Property
   * Similar to delete, RLS will enforce that only admins can update any property,
   * while sellers can only update their own properties.
   */
  const handleUpdateProperty = async (propertyId: string, updates: Partial<PropertyRow>) => {
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', propertyId)
        .select()
        .single();

      if (error) {
        console.error('Error updating property:', error);
        return { error };
      }

      // Log the property update activity
      try {
        const changedFields = Object.keys(updates);
        await logActivity.propertyUpdated({
          title: data.title_ar || data.title_en || data.title_tr || 'Unknown Property',
          property_id: propertyId,
          changes: changedFields
        });
        console.log('Property update activity logged successfully');
      } catch (logError) {
        console.warn('Failed to log property update activity:', logError);
        // Continue execution - logging failure shouldn't prevent property update
      }

      console.log('Property updated successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error updating property:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  /**
   * Toggle property status between available and pending
   */
  const togglePropertyStatus = async (propertyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'pending' : 'available';
    return await handleUpdateProperty(propertyId, { status: newStatus });
  };

  /**
   * Toggle featured status
   */
  const toggleFeaturedStatus = async (propertyId: string, currentFeatured: boolean) => {
    return await handleUpdateProperty(propertyId, { is_featured: !currentFeatured });
  };

  /**
   * Fetch properties based on user permissions
   * - Admin users can see all properties
   * - Seller users can see their own properties
   * - Regular users can see all properties (read-only)
   */
  const fetchUserProperties = async (): Promise<{ data: PropertyRow[], error: any }> => {
    if (!user) {
      return { data: [], error: { message: 'User not authenticated' } };
    }

    try {
      let query = supabase.from('properties').select('*');

      // If user is a seller (but not admin), only show their properties
      if (isSeller && !isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error fetching properties:', error);
      return { data: [], error: { message: 'An unexpected error occurred' } };
    }
  };

  return {
    handleCreateProperty,
    handleDeleteProperty,
    handleUpdateProperty: async (propertyId: string, updates: Partial<PropertyRow>) => {
      if (!user) {
        return { error: { message: 'User not authenticated' } };
      }

      try {
        const { data, error } = await supabase
          .from('properties')
          .update(updates)
          .eq('id', propertyId)
          .select()
          .single();

        if (error) {
          console.error('Error updating property:', error);
          return { error };
        }

        console.log('Property updated successfully:', data);
        return { data, error: null };
      } catch (error) {
        console.error('Unexpected error updating property:', error);
        return { error: { message: 'An unexpected error occurred' } };
      }
    },
    togglePropertyStatus: async (propertyId: string, currentStatus: string) => {
      const newStatus = currentStatus === 'available' ? 'pending' : 'available';
      return await handleUpdateProperty(propertyId, { status: newStatus });
    },
    toggleFeaturedStatus: async (propertyId: string, currentFeatured: boolean) => {
      return await handleUpdateProperty(propertyId, { is_featured: !currentFeatured });
    },
    fetchUserProperties,
    canCreateProperty: isAdmin || isSeller,
    canManageAllProperties: isAdmin,
    // Legacy aliases for backward compatibility
    addProperty: handleCreateProperty,
    deleteProperty: async (propertyId: string) => {
      const result = await handleDeleteProperty(propertyId);
      return !result.error;
    },
    addingProperty: false, // Add this as a static value for now
  };
}
