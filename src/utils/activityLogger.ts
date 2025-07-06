import { supabase } from '@/integrations/supabase/client';

export interface ActivityDetails {
  property_title?: string;
  property_type?: string;
  property_id?: string;
  price?: number;
  currency?: string;
  old_status?: string;
  new_status?: string;
  is_hidden?: boolean;
  reason?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  [key: string]: any;
}

export type ActivityType = 
  | 'property_created'
  | 'property_updated' 
  | 'property_deleted'
  | 'property_hidden'
  | 'property_shown'
  | 'property_sold'
  | 'property_rented'
  | 'status_changed'
  | 'price_changed'
  | 'images_updated'
  | 'profile_updated'
  | 'login'
  | 'logout';

export const logUserActivity = async (
  userId: string,
  actionType: ActivityType,
  actionDetails: ActivityDetails = {}
) => {
  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action_type: actionType,
        action_details: actionDetails
      });

    if (error) {
      console.error('Error logging user activity:', error);
      return { success: false, error };
    }

    console.log('User activity logged successfully:', actionType);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error logging activity:', err);
    return { success: false, error: err };
  }
};

// Helper functions for specific activities
export const logPropertyCreated = async (
  userId: string, 
  propertyData: {
    title: string;
    type: string;
    price?: number;
    currency?: string;
    location?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    property_id?: string;
  }
) => {
  return await logUserActivity(userId, 'property_created', {
    property_title: propertyData.title,
    property_type: propertyData.type,
    property_id: propertyData.property_id,
    price: propertyData.price,
    currency: propertyData.currency || 'EUR',
    location: propertyData.location,
    bedrooms: propertyData.bedrooms,
    bathrooms: propertyData.bathrooms,
    area: propertyData.area
  });
};

export const logPropertyUpdated = async (
  userId: string,
  propertyData: {
    title: string;
    property_id?: string;
    changes?: string[];
  }
) => {
  return await logUserActivity(userId, 'property_updated', {
    property_title: propertyData.title,
    property_id: propertyData.property_id,
    changes: propertyData.changes
  });
};

export const logPropertyDeleted = async (
  userId: string,
  propertyData: {
    title: string;
    property_id?: string;
    reason?: string;
  }
) => {
  return await logUserActivity(userId, 'property_deleted', {
    property_title: propertyData.title,
    property_id: propertyData.property_id,
    reason: propertyData.reason || 'user_request'
  });
};

export const logPropertyVisibilityChanged = async (
  userId: string,
  propertyData: {
    title: string;
    property_id?: string;
    is_hidden: boolean;
  }
) => {
  const actionType = propertyData.is_hidden ? 'property_hidden' : 'property_shown';
  return await logUserActivity(userId, actionType, {
    property_title: propertyData.title,
    property_id: propertyData.property_id,
    is_hidden: propertyData.is_hidden
  });
};

export const logPropertyStatusChanged = async (
  userId: string,
  propertyData: {
    title: string;
    property_id?: string;
    old_status: string;
    new_status: string;
    price?: number;
    currency?: string;
  }
) => {
  let actionType: ActivityType = 'status_changed';
  
  // Use specific action types for common status changes
  if (propertyData.new_status === 'sold') {
    actionType = 'property_sold';
  } else if (propertyData.new_status === 'rented') {
    actionType = 'property_rented';
  }

  return await logUserActivity(userId, actionType, {
    property_title: propertyData.title,
    property_id: propertyData.property_id,
    old_status: propertyData.old_status,
    new_status: propertyData.new_status,
    price: propertyData.price,
    currency: propertyData.currency || 'EUR'
  });
};

export const logPriceChanged = async (
  userId: string,
  propertyData: {
    title: string;
    property_id?: string;
    old_price: number;
    new_price: number;
    currency?: string;
  }
) => {
  return await logUserActivity(userId, 'price_changed', {
    property_title: propertyData.title,
    property_id: propertyData.property_id,
    old_price: propertyData.old_price,
    new_price: propertyData.new_price,
    currency: propertyData.currency || 'EUR'
  });
};

export const logImagesUpdated = async (
  userId: string,
  propertyData: {
    title: string;
    property_id?: string;
    images_added?: number;
    images_removed?: number;
  }
) => {
  return await logUserActivity(userId, 'images_updated', {
    property_title: propertyData.title,
    property_id: propertyData.property_id,
    images_added: propertyData.images_added || 0,
    images_removed: propertyData.images_removed || 0
  });
};

export const logProfileUpdated = async (
  userId: string,
  changes: string[]
) => {
  return await logUserActivity(userId, 'profile_updated', {
    changes: changes
  });
};

export const logUserLogin = async (userId: string) => {
  return await logUserActivity(userId, 'login', {
    timestamp: new Date().toISOString()
  });
};

export const logUserLogout = async (userId: string) => {
  return await logUserActivity(userId, 'logout', {
    timestamp: new Date().toISOString()
  });
};
