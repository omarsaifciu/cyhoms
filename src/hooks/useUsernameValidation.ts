
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { validateUsernameFormat } from "@/utils/usernameValidation";

export const useUsernameValidation = (currentUsername?: string) => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    // إذا كان نفس الاسم الحالي، فلا حاجة للتحقق (مع تجاهل حالة الأحرف)
    if (username.toLowerCase() === currentUsername?.toLowerCase()) {
      setUsernameError(null);
      setIsValid(true);
      return true;
    }
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', username) // استخدام ilike للتحقق غير الحساس لحالة الأحرف
        .neq('id', user?.id);

      if (error) {
        console.error('Error checking username availability:', error);
        const errorMsg = currentLanguage === 'ar' ? 
          'خطأ في التحقق من توفر اسم المستخدم' : 
          'Error checking username availability';
        setUsernameError(errorMsg);
        setIsValid(false);
        return false;
      }

      if (data && data.length > 0) {
        const errorMsg = currentLanguage === 'ar' ? 
          'اسم المستخدم مستخدم من قبل مستخدم آخر' : 
          'Username is already taken';
        setUsernameError(errorMsg);
        setIsValid(false);
        return false;
      }

      setUsernameError(null);
      setIsValid(true);
      return true;
    } catch (error) {
      console.error('Error checking username availability:', error);
      const errorMsg = currentLanguage === 'ar' ? 
        'خطأ في التحقق من توفر اسم المستخدم' : 
        'Error checking username availability';
      setUsernameError(errorMsg);
      setIsValid(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const validateUsername = (username: string, onValidationChange?: (isValid: boolean, error?: string) => void): boolean => {
    const result = validateUsernameFormat(username, currentLanguage);
    
    if (!result.isValid) {
      setUsernameError(result.error || null);
      setIsValid(false);
      onValidationChange?.(false, result.error);
      return false;
    }

    setUsernameError(null);
    setIsValid(true);
    onValidationChange?.(true);
    return true;
  };

  return {
    usernameError,
    isChecking,
    isValid,
    validateUsername,
    checkUsernameAvailability,
    setUsernameError,
    setIsValid
  };
};
