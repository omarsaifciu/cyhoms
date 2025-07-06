import { supabase } from '@/integrations/supabase/client';

// Helper function to create sample user activities for testing
export const seedUserActivity = async (userId: string) => {
  const sampleActivities = [
    {
      user_id: userId,
      action_type: 'property_created',
      action_details: {
        property_title: 'شقة فاخرة في نيقوسيا',
        property_type: 'apartment',
        price: 1200,
        currency: 'EUR'
      }
    },
    {
      user_id: userId,
      action_type: 'property_updated',
      action_details: {
        property_title: 'فيلا مع حديقة في ليماسول',
        property_type: 'villa',
        price: 2500,
        currency: 'EUR'
      }
    },
    {
      user_id: userId,
      action_type: 'property_hidden',
      action_details: {
        property_title: 'استوديو في لارنكا',
        is_hidden: true
      }
    },
    {
      user_id: userId,
      action_type: 'property_shown',
      action_details: {
        property_title: 'شقة بغرفتين في فاماغوستا',
        is_hidden: false
      }
    },
    {
      user_id: userId,
      action_type: 'property_sold',
      action_details: {
        property_title: 'بنتهاوس في كيرينيا',
        old_status: 'available',
        new_status: 'sold',
        price: 450000,
        currency: 'EUR'
      }
    },
    {
      user_id: userId,
      action_type: 'property_rented',
      action_details: {
        property_title: 'شقة مفروشة في نيقوسيا',
        old_status: 'available',
        new_status: 'rented',
        price: 800,
        currency: 'EUR'
      }
    },
    {
      user_id: userId,
      action_type: 'status_changed',
      action_details: {
        property_title: 'مكتب تجاري في نيقوسيا',
        old_status: 'pending',
        new_status: 'available'
      }
    },
    {
      user_id: userId,
      action_type: 'property_deleted',
      action_details: {
        property_title: 'عقار قديم في ليماسول',
        reason: 'duplicate_listing'
      }
    }
  ];

  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .insert(sampleActivities);

    if (error) {
      console.error('Error seeding user activities:', error);
      return { success: false, error };
    }

    console.log('User activities seeded successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error seeding activities:', err);
    return { success: false, error: err };
  }
};

// Helper function to clear all activities for a user (for testing)
export const clearUserActivities = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing user activities:', error);
      return { success: false, error };
    }

    console.log('User activities cleared successfully');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error clearing activities:', err);
    return { success: false, error: err };
  }
};

// Helper function for admin to seed activities for any user
export const adminSeedUserActivity = async (userId: string, userName: string) => {
  const sampleActivities = [
    {
      user_id: userId,
      action_type: 'property_created',
      action_details: {
        property_title: `عقار جديد من ${userName}`,
        property_type: 'apartment',
        price: Math.floor(Math.random() * 2000) + 500,
        currency: 'EUR'
      }
    },
    {
      user_id: userId,
      action_type: 'property_updated',
      action_details: {
        property_title: `عقار محدث من ${userName}`,
        property_type: 'villa'
      }
    },
    {
      user_id: userId,
      action_type: 'property_hidden',
      action_details: {
        property_title: `عقار مخفي من ${userName}`,
        is_hidden: true
      }
    },
    {
      user_id: userId,
      action_type: 'property_sold',
      action_details: {
        property_title: `عقار مباع من ${userName}`,
        old_status: 'available',
        new_status: 'sold',
        price: Math.floor(Math.random() * 500000) + 100000,
        currency: 'EUR'
      }
    }
  ];

  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .insert(sampleActivities);

    if (error) {
      console.error('Error seeding admin user activities:', error);
      return { success: false, error };
    }

    console.log('Admin user activities seeded successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error seeding admin activities:', err);
    return { success: false, error: err };
  }
};
