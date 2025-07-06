
export interface UsernameValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUsernameFormat = (username: string, currentLanguage: string): UsernameValidationResult => {
  // اسم المستخدم مطلوب الآن
  if (!username || username.trim() === '') {
    const error = currentLanguage === 'ar' ? 
      'اسم المستخدم مطلوب' : 
      'Username is required';
    return { isValid: false, error };
  }

  // التحقق من الأحرف المسموحة: أحرف وأرقام وشرطة سفلية فقط
  const allowedChars = /^[a-zA-Z0-9_]+$/;
  if (!allowedChars.test(username)) {
    const error = currentLanguage === 'ar' ? 
      'اسم المستخدم يمكن أن يحتوي فقط على أحرف وأرقام وشرطة سفلية' : 
      'Username can only contain letters, numbers, and underscores';
    return { isValid: false, error };
  }

  // التحقق من الحد الأدنى للطول
  if (username.length < 3) {
    const error = currentLanguage === 'ar' ? 
      'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' : 
      'Username must be at least 3 characters long';
    return { isValid: false, error };
  }

  // التحقق من الحد الأقصى للطول
  if (username.length > 20) {
    const error = currentLanguage === 'ar' ? 
      'اسم المستخدم يجب أن يكون أقل من 20 حرف' : 
      'Username must be less than 20 characters';
    return { isValid: false, error };
  }

  return { isValid: true };
};
