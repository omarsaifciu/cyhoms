import { useAuth } from '@/contexts/AuthContext';
import { 
  logPropertyCreated,
  logPropertyUpdated,
  logPropertyDeleted,
  logPropertyVisibilityChanged,
  logPropertyStatusChanged,
  logPriceChanged,
  logImagesUpdated,
  logProfileUpdated,
  logUserLogin,
  logUserLogout,
  ActivityDetails
} from '@/utils/activityLogger';

export const useActivityLogger = () => {
  const { user } = useAuth();

  const logActivity = {
    propertyCreated: async (propertyData: {
      title: string;
      type: string;
      price?: number;
      currency?: string;
      location?: string;
      bedrooms?: number;
      bathrooms?: number;
      area?: number;
      property_id?: string;
    }) => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logPropertyCreated(user.id, propertyData);
    },

    propertyUpdated: async (propertyData: {
      title: string;
      property_id?: string;
      changes?: string[];
    }) => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logPropertyUpdated(user.id, propertyData);
    },

    propertyDeleted: async (propertyData: {
      title: string;
      property_id?: string;
      reason?: string;
    }) => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logPropertyDeleted(user.id, propertyData);
    },

    propertyVisibilityChanged: async (propertyData: {
      title: string;
      property_id?: string;
      is_hidden: boolean;
    }) => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logPropertyVisibilityChanged(user.id, propertyData);
    },

    propertyStatusChanged: async (propertyData: {
      title: string;
      property_id?: string;
      old_status: string;
      new_status: string;
      price?: number;
      currency?: string;
    }) => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logPropertyStatusChanged(user.id, propertyData);
    },

    priceChanged: async (propertyData: {
      title: string;
      property_id?: string;
      old_price: number;
      new_price: number;
      currency?: string;
    }) => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logPriceChanged(user.id, propertyData);
    },

    imagesUpdated: async (propertyData: {
      title: string;
      property_id?: string;
      images_added?: number;
      images_removed?: number;
    }) => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logImagesUpdated(user.id, propertyData);
    },

    profileUpdated: async (changes: string[]) => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logProfileUpdated(user.id, changes);
    },

    userLogin: async () => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logUserLogin(user.id);
    },

    userLogout: async () => {
      if (!user?.id) return { success: false, error: 'User not authenticated' };
      return await logUserLogout(user.id);
    }
  };

  return { logActivity, isAuthenticated: !!user?.id };
};

// Example usage:
/*
const { logActivity } = useActivityLogger();

// When creating a property
await logActivity.propertyCreated({
  title: "شقة فاخرة في نيقوسيا",
  type: "apartment",
  price: 1200,
  currency: "EUR",
  location: "نيقوسيا",
  bedrooms: 2,
  bathrooms: 1,
  area: 85,
  property_id: "prop_123"
});

// When updating a property
await logActivity.propertyUpdated({
  title: "شقة فاخرة في نيقوسيا",
  property_id: "prop_123",
  changes: ["price", "description"]
});

// When hiding/showing a property
await logActivity.propertyVisibilityChanged({
  title: "شقة فاخرة في نيقوسيا",
  property_id: "prop_123",
  is_hidden: true
});

// When changing property status
await logActivity.propertyStatusChanged({
  title: "شقة فاخرة في نيقوسيا",
  property_id: "prop_123",
  old_status: "available",
  new_status: "sold",
  price: 1200,
  currency: "EUR"
});
*/
