import { useState, useCallback, useRef } from 'react';
import { useUniquenessCheck } from './useUniquenessCheck';
import { useValidationMessages } from './useValidationMessages';

export interface ValidationState {
  isValid: boolean;
  isChecking: boolean;
  error: string | null;
  hasBeenChecked: boolean;
}

export interface RealTimeValidationHook {
  emailValidation: ValidationState;
  usernameValidation: ValidationState;
  phoneValidation: ValidationState;
  validateEmail: (email: string) => void;
  validateUsername: (username: string) => void;
  validatePhone: (phone: string) => void;
  clearValidation: (field: 'email' | 'username' | 'phone') => void;
  clearAllValidations: () => void;
}

export const useRealTimeValidation = (): RealTimeValidationHook => {
  const { checkFieldUniqueness } = useUniquenessCheck();
  const { getErrorMessage } = useValidationMessages();

  // Validation states for each field
  const [emailValidation, setEmailValidation] = useState<ValidationState>({
    isValid: true,
    isChecking: false,
    error: null,
    hasBeenChecked: false
  });

  const [usernameValidation, setUsernameValidation] = useState<ValidationState>({
    isValid: true,
    isChecking: false,
    error: null,
    hasBeenChecked: false
  });

  const [phoneValidation, setPhoneValidation] = useState<ValidationState>({
    isValid: true,
    isChecking: false,
    error: null,
    hasBeenChecked: false
  });

  // Debounce timers
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usernameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const phoneTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Basic field validation functions
  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsernameFormat = (username: string): boolean => {
    const allowedRegex = /^[a-zA-Z0-9_]+$/;
    return allowedRegex.test(username) && username.length >= 3;
  };

  const validatePhoneFormat = (phone: string): boolean => {
    // Basic phone validation - at least 8 digits
    const phoneRegex = /^\+?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone.trim());
  };

  // Generic validation function
  const performValidation = useCallback(async (
    field: 'email' | 'username' | 'phone',
    value: string,
    formatValidator: (val: string) => boolean,
    setState: React.Dispatch<React.SetStateAction<ValidationState>>,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If field is empty, reset validation state
    if (!value.trim()) {
      setState({
        isValid: true,
        isChecking: false,
        error: null,
        hasBeenChecked: false
      });
      return;
    }

    // Set checking state immediately
    setState(prev => ({
      ...prev,
      isChecking: true,
      error: null
    }));

    // Debounce the actual validation
    timeoutRef.current = setTimeout(async () => {
      try {
        // First check format
        if (!formatValidator(value)) {
          let errorKey = '';
          switch (field) {
            case 'email':
              errorKey = 'invalidEmail';
              break;
            case 'username':
              errorKey = 'invalidUsername';
              break;
            case 'phone':
              errorKey = 'invalidPhone';
              break;
          }
          
          setState({
            isValid: false,
            isChecking: false,
            error: getErrorMessage(errorKey),
            hasBeenChecked: true
          });
          return;
        }

        // Then check uniqueness
        const isDuplicate = await checkFieldUniqueness(field, value);
        
        if (isDuplicate) {
          let errorKey = '';
          switch (field) {
            case 'email':
              errorKey = 'emailTaken';
              break;
            case 'username':
              errorKey = 'usernameTaken';
              break;
            case 'phone':
              errorKey = 'phoneTaken';
              break;
          }
          
          setState({
            isValid: false,
            isChecking: false,
            error: getErrorMessage(errorKey),
            hasBeenChecked: true
          });
        } else {
          setState({
            isValid: true,
            isChecking: false,
            error: null,
            hasBeenChecked: true
          });
        }
      } catch (error) {
        console.error(`Error validating ${field}:`, error);
        setState({
          isValid: false,
          isChecking: false,
          error: getErrorMessage('validationError'),
          hasBeenChecked: true
        });
      }
    }, 500); // 500ms debounce
  }, [checkFieldUniqueness, getErrorMessage]);

  // Individual validation functions
  const validateEmail = useCallback((email: string) => {
    performValidation('email', email, validateEmailFormat, setEmailValidation, emailTimeoutRef);
  }, [performValidation]);

  const validateUsername = useCallback((username: string) => {
    performValidation('username', username, validateUsernameFormat, setUsernameValidation, usernameTimeoutRef);
  }, [performValidation]);

  const validatePhone = useCallback((phone: string) => {
    performValidation('phone', phone, validatePhoneFormat, setPhoneValidation, phoneTimeoutRef);
  }, [performValidation]);

  // Clear validation functions
  const clearValidation = useCallback((field: 'email' | 'username' | 'phone') => {
    const resetState: ValidationState = {
      isValid: true,
      isChecking: false,
      error: null,
      hasBeenChecked: false
    };

    switch (field) {
      case 'email':
        setEmailValidation(resetState);
        if (emailTimeoutRef.current) {
          clearTimeout(emailTimeoutRef.current);
          emailTimeoutRef.current = null;
        }
        break;
      case 'username':
        setUsernameValidation(resetState);
        if (usernameTimeoutRef.current) {
          clearTimeout(usernameTimeoutRef.current);
          usernameTimeoutRef.current = null;
        }
        break;
      case 'phone':
        setPhoneValidation(resetState);
        if (phoneTimeoutRef.current) {
          clearTimeout(phoneTimeoutRef.current);
          phoneTimeoutRef.current = null;
        }
        break;
    }
  }, []);

  const clearAllValidations = useCallback(() => {
    clearValidation('email');
    clearValidation('username');
    clearValidation('phone');
  }, [clearValidation]);

  return {
    emailValidation,
    usernameValidation,
    phoneValidation,
    validateEmail,
    validateUsername,
    validatePhone,
    clearValidation,
    clearAllValidations
  };
};
