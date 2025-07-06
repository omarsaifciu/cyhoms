
import { supabase } from "@/integrations/supabase/client";

/**
 * TASK 3: Property Management Functions
 * Functions for creating, updating, and deleting properties
 */

/**
 * Create a new property
 * @param {Object} propertyData - Property data to insert
 * @returns {Object} Result with success/error status and data
 */
export const createProperty = async (propertyData) => {
  try {
    console.log('Creating new property...');

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return { success: false, error: userError, data: null };
    }

    if (!user) {
      const error = new Error('User must be logged in to create properties');
      console.error(error.message);
      return { success: false, error, data: null };
    }

    // Prepare property data with user_id
    const propertyToInsert = {
      ...propertyData,
      user_id: user.id, // Automatically include current user's ID
      created_by: user.id // Also set created_by if your schema uses it
    };

    console.log('Inserting property with user_id:', user.id);

    // Insert the property - RLS will check if user has 'admin' or 'seller' role
    const { data, error } = await supabase
      .from('properties')
      .insert(propertyToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      
      // Check if it's a permission error
      if (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy')) {
        const permissionError = new Error('You do not have permission to create properties. Admin or Seller role required.');
        return { success: false, error: permissionError, data: null };
      }
      
      return { success: false, error, data: null };
    }

    console.log('Property created successfully:', data.id);
    return { success: true, error: null, data };

  } catch (error) {
    console.error('Unexpected error creating property:', error);
    return { success: false, error, data: null };
  }
};

/**
 * Update an existing property
 * @param {string} propertyId - ID of property to update
 * @param {Object} updatedData - Data to update
 * @returns {Object} Result with success/error status and data
 */
export const updateProperty = async (propertyId, updatedData) => {
  try {
    console.log('Updating property:', propertyId);

    if (!propertyId) {
      const error = new Error('Property ID is required');
      return { success: false, error, data: null };
    }

    // Update the property - RLS will check permissions automatically
    // User can update if they are admin OR (seller AND own the property)
    const { data, error } = await supabase
      .from('properties')
      .update(updatedData)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      
      // Check if it's a permission error
      if (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy')) {
        const permissionError = new Error('You do not have permission to update this property.');
        return { success: false, error: permissionError, data: null };
      }

      // Check if property not found
      if (error.code === 'PGRST116') {
        const notFoundError = new Error('Property not found or you do not have permission to update it.');
        return { success: false, error: notFoundError, data: null };
      }
      
      return { success: false, error, data: null };
    }

    console.log('Property updated successfully:', data.id);
    return { success: true, error: null, data };

  } catch (error) {
    console.error('Unexpected error updating property:', error);
    return { success: false, error, data: null };
  }
};

/**
 * Delete a property
 * @param {string} propertyId - ID of property to delete
 * @returns {Object} Result with success/error status
 */
export const deleteProperty = async (propertyId) => {
  try {
    console.log('Deleting property:', propertyId);

    if (!propertyId) {
      const error = new Error('Property ID is required');
      return { success: false, error };
    }

    // Delete the property - RLS will check permissions automatically
    // User can delete if they are admin OR (seller AND own the property)
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Error deleting property:', error);
      
      // Check if it's a permission error
      if (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy')) {
        const permissionError = new Error('You do not have permission to delete this property.');
        return { success: false, error: permissionError };
      }
      
      return { success: false, error };
    }

    console.log('Property deleted successfully');
    return { success: true, error: null };

  } catch (error) {
    console.error('Unexpected error deleting property:', error);
    return { success: false, error };
  }
};

/**
 * Get properties for current user (seller) or all properties (admin)
 * @returns {Object} Result with success/error status and data
 */
export const getUserProperties = async () => {
  try {
    console.log('Fetching user properties...');

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      const error = new Error('User must be logged in');
      return { success: false, error, data: [] };
    }

    // Fetch properties - RLS will automatically filter based on user permissions
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return { success: false, error, data: [] };
    }

    console.log('Properties fetched:', data.length);
    return { success: true, error: null, data: data || [] };

  } catch (error) {
    console.error('Unexpected error fetching properties:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Example usage function demonstrating how to use the property functions
 */
export const exampleUsage = async () => {
  // Example property data
  const newPropertyData = {
    title: 'Beautiful Apartment',
    description: 'A lovely 2-bedroom apartment in the city center',
    price: 1200,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    city: 'city-id-here',
    district: 'district-id-here',
    property_type: 'apartment',
    listing_type: 'rent',
    currency: 'EUR'
  };

  // Create property
  const createResult = await createProperty(newPropertyData);
  if (createResult.success) {
    console.log('Property created:', createResult.data);
    
    // Update property
    const updateResult = await updateProperty(createResult.data.id, {
      price: 1300,
      description: 'Updated description'
    });
    
    if (updateResult.success) {
      console.log('Property updated:', updateResult.data);
    }
    
    // Delete property (uncomment to test)
    // const deleteResult = await deleteProperty(createResult.data.id);
    // if (deleteResult.success) {
    //   console.log('Property deleted');
    // }
  } else {
    console.error('Failed to create property:', createResult.error);
  }
};
