
export const useFieldValidation = () => {
  const validateUsername = (username: string): boolean => {
    // التحقق من أن اسم المستخدم يحتوي على أحرف وأرقام وشرطة سفلية فقط
    const allowedRegex = /^[a-zA-Z0-9_]+$/;
    return allowedRegex.test(username);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFullName = (fullName: string): boolean => {
    // التحقق من أن الاسم الكامل يحتوي على أحرف ومسافات فقط بدون أرقام
    const lettersAndSpacesOnly = /^[a-zA-Zأ-ي\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFçğıöşüÇĞIİÖŞÜ\s]+$/;
    return lettersAndSpacesOnly.test(fullName);
  };

  return {
    validateUsername,
    validateEmail,
    validateFullName
  };
};
