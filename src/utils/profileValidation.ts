export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFullName = (name: string, currentLanguage: string): ValidationResult => {
  if (!name || name.trim() === '') {
    const error = currentLanguage === 'ar' ? 'الاسم الكامل مطلوب' : 'Full name is required';
    return { isValid: false, error };
  }
  if (name.trim().length < 2) {
    const error = currentLanguage === 'ar' ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters';
    return { isValid: false, error };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string, currentLanguage: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    const error = currentLanguage === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    return { isValid: false, error };
  }
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    const error = currentLanguage === 'ar' ? 'رقم الهاتف غير صحيح' : 'Invalid phone number';
    return { isValid: false, error };
  }
  return { isValid: true };
};

export const validateWhatsApp = (whatsapp: string, currentLanguage: string): ValidationResult => {
  if (!whatsapp || whatsapp.trim() === '') {
    const error = currentLanguage === 'ar' ? 'رقم الواتساب مطلوب' : 'WhatsApp number is required';
    return { isValid: false, error };
  }
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(whatsapp.replace(/\s/g, ''))) {
    const error = currentLanguage === 'ar' ? 'رقم واتساب غير صحيح' : 'Invalid WhatsApp number';
    return { isValid: false, error };
  }
  return { isValid: true };
};
