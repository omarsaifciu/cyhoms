
import { supabase } from "@/integrations/supabase/client";

export const useUniquenessCheck = () => {
  // Check individual field uniqueness with case-insensitive validation
  const checkFieldUniqueness = async (field: 'username' | 'email' | 'phone' | 'whatsapp_number', value: string): Promise<boolean> => {
    if (!value.trim()) return false;

    try {
      switch (field) {
        case 'username':
          const { data: usernameData } = await supabase
            .from('profiles')
            .select('username')
            .ilike('username', value.trim()) // Case-insensitive check
            .limit(1);
          return usernameData && usernameData.length > 0;

        case 'email':
          // Check profiles table for email uniqueness (case-insensitive)
          const { data: emailData } = await supabase
            .from('profiles')
            .select('email')
            .ilike('email', value.trim()) // Case-insensitive check
            .limit(1);

          // For a more comprehensive check, we can also try to use the existing
          // get_user_email_by_username function in reverse by checking if any username
          // maps to this email, but for now we'll rely on profiles table
          return emailData && emailData.length > 0;

        case 'phone':
          const { data: phoneData } = await supabase
            .from('profiles')
            .select('phone')
            .eq('phone', value.trim())
            .limit(1);
          return phoneData && phoneData.length > 0;

        case 'whatsapp_number':
          const { data: whatsappData } = await supabase
            .from('profiles')
            .select('whatsapp_number')
            .eq('whatsapp_number', value.trim())
            .limit(1);
          return whatsappData && whatsappData.length > 0;

        default:
          return false;
      }
    } catch (error) {
      console.error(`Error checking ${field} uniqueness:`, error);
      return false;
    }
  };

  // Batch check for multiple fields (used in form submission)
  const checkUniqueData = async (username: string, email: string, phone: string, whatsappNumber?: string) => {
    const uniqueErrors: { username?: boolean; email?: boolean; phone?: boolean; whatsappNumber?: boolean } = {};

    try {
      // Check all fields in parallel for better performance
      const [usernameExists, emailExists, phoneExists, whatsappExists] = await Promise.all([
        checkFieldUniqueness('username', username),
        checkFieldUniqueness('email', email),
        checkFieldUniqueness('phone', phone),
        whatsappNumber ? checkFieldUniqueness('whatsapp_number', whatsappNumber) : Promise.resolve(false)
      ]);

      if (usernameExists) uniqueErrors.username = true;
      if (emailExists) uniqueErrors.email = true;
      if (phoneExists) uniqueErrors.phone = true;
      if (whatsappExists) uniqueErrors.whatsappNumber = true;

    } catch (error) {
      console.error('Error checking unique data:', error);
    }

    return uniqueErrors;
  };

  return {
    checkUniqueData,
    checkFieldUniqueness
  };
};
