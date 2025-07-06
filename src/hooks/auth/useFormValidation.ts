
import { FormData, FormErrors } from "@/hooks/useSignupValidation";
import { useValidationMessages } from "./useValidationMessages";
import { useFieldValidation } from "./useFieldValidation";
import { useUniquenessCheck } from "./useUniquenessCheck";

export const useFormValidation = () => {
  const { getErrorMessage } = useValidationMessages();
  const { validateUsername, validateEmail, validateFullName } = useFieldValidation();
  const { checkUniqueData } = useUniquenessCheck();

  const validateForm = async (formData: FormData, acceptTerms: boolean): Promise<{ isValid: boolean; errors: FormErrors }> => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = getErrorMessage('required');
    } else if (!validateFullName(formData.fullName)) {
      newErrors.fullName = getErrorMessage('invalidFullName');
    }

    if (!formData.username.trim()) {
      newErrors.username = getErrorMessage('required');
    } else if (!validateUsername(formData.username)) {
      newErrors.username = getErrorMessage('invalidUsername');
    }

    if (!formData.email.trim()) {
      newErrors.email = getErrorMessage('required');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = getErrorMessage('invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = getErrorMessage('required');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = getErrorMessage('required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = getErrorMessage('passwordMismatch');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = getErrorMessage('required');
    }

    if ((formData.userType === 'seller' || formData.userType === 'property_owner' || formData.userType === 'real_estate_office') && !formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = getErrorMessage('whatsappRequired');
    }

    if (!acceptTerms) {
      newErrors.terms = getErrorMessage('termsRequired');
    }

    // Check for uniqueness if basic validation passes
    if (!newErrors.username && !newErrors.email && !newErrors.phone && !newErrors.whatsappNumber) {
      const uniqueErrors = await checkUniqueData(
        formData.username, 
        formData.email, 
        formData.phone,
        formData.whatsappNumber
      );
      
      if (uniqueErrors.username) {
        newErrors.username = getErrorMessage('usernameTaken');
      }
      if (uniqueErrors.email) {
        newErrors.email = getErrorMessage('emailTaken');
      }
      if (uniqueErrors.phone) {
        newErrors.phone = getErrorMessage('phoneTaken');
      }
      if (uniqueErrors.whatsappNumber) {
        newErrors.whatsappNumber = getErrorMessage('whatsappTaken');
      }
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  return { validateForm };
};
