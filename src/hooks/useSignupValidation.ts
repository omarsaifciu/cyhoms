
import { useState } from "react";
import { useFormValidation } from "./auth/useFormValidation";

export interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  whatsappNumber?: string;
  userType?: string;
  terms?: string;
}

export interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  whatsappNumber: string;
  userType: string;
}

export const useSignupValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const { validateForm: validateFormData } = useFormValidation();

  const validateForm = async (formData: FormData, acceptTerms: boolean): Promise<boolean> => {
    const { isValid, errors: validationErrors } = await validateFormData(formData, acceptTerms);
    setErrors(validationErrors);
    return isValid;
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    errors,
    validateForm,
    clearFieldError
  };
};
