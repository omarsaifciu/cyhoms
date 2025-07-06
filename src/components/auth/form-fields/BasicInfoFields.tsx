
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormData, FormErrors } from "@/hooks/useSignupValidation";
import { User, Mail, Phone, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useRealTimeValidation } from "@/hooks/auth/useRealTimeValidation";

interface BasicInfoFieldsProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoFields = ({ formData, errors, onInputChange }: BasicInfoFieldsProps) => {
  const { currentLanguage } = useLanguage();
  const {
    emailValidation,
    phoneValidation,
    validateEmail,
    validatePhone,
    clearValidation
  } = useRealTimeValidation();

  // Handle email input change with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange('email', value);
    validateEmail(value);
  };

  // Handle phone input change with real-time validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange('phone', value);
    validatePhone(value);
  };

  // Handle email blur
  const handleEmailBlur = () => {
    if (formData.email) {
      validateEmail(formData.email);
    }
  };

  // Handle phone blur
  const handlePhoneBlur = () => {
    if (formData.phone) {
      validatePhone(formData.phone);
    }
  };

  // Get validation icon for a field
  const getValidationIcon = (validation: { isValid: boolean; isChecking: boolean; hasBeenChecked: boolean }) => {
    if (validation.isChecking) {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    if (validation.hasBeenChecked) {
      return validation.isValid
        ? <CheckCircle className="w-4 h-4 text-green-500" />
        : <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <>
      <div>
        <Label htmlFor="fullName">
          {currentLanguage === 'ar' ? 'الاسم الكامل' : 
           currentLanguage === 'tr' ? 'Ad Soyad' : 'Full Name'} *
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            className={`pl-10 ${errors.fullName ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder={currentLanguage === 'ar' ? 'أدخل اسمك الكامل' : 
                        currentLanguage === 'tr' ? 'Tam adınızı girin' : 'Enter your full name'}
            required
          />
        </div>
        {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
      </div>
      
      <div>
        <Label htmlFor="email">
          {currentLanguage === 'ar' ? 'البريد الإلكتروني' :
           currentLanguage === 'tr' ? 'E-posta' : 'Email'} *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className={`pl-10 pr-10 ${
              errors.email || emailValidation.error
                ? 'border-red-500 focus:border-red-500'
                : emailValidation.hasBeenChecked && emailValidation.isValid
                  ? 'border-green-500 focus:border-green-500'
                  : ''
            }`}
            placeholder={currentLanguage === 'ar' ? 'أدخل بريدك الإلكتروني' :
                        currentLanguage === 'tr' ? 'E-postanızı girin' : 'Enter your email'}
            required
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getValidationIcon(emailValidation)}
          </div>
        </div>
        {(errors.email || emailValidation.error) && (
          <p className="text-sm text-red-500 mt-1">
            {errors.email || emailValidation.error}
          </p>
        )}
        {emailValidation.hasBeenChecked && emailValidation.isValid && !errors.email && (
          <p className="text-sm text-green-600 mt-1">
            {currentLanguage === 'ar' ? 'البريد الإلكتروني متاح' :
             currentLanguage === 'tr' ? 'E-posta kullanılabilir' : 'Email is available'}
          </p>
        )}
      </div>
      
      <div>
        <Label htmlFor="phone">
          {currentLanguage === 'ar' ? 'رقم الهاتف' :
           currentLanguage === 'tr' ? 'Telefon Numarası' : 'Phone Number'} *
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            className={`pl-10 pr-10 ${
              errors.phone || phoneValidation.error
                ? 'border-red-500 focus:border-red-500'
                : phoneValidation.hasBeenChecked && phoneValidation.isValid
                  ? 'border-green-500 focus:border-green-500'
                  : ''
            }`}
            placeholder={currentLanguage === 'ar' ? 'أدخل رقم هاتفك' :
                        currentLanguage === 'tr' ? 'Telefon numaranızı girin' : 'Enter your phone number'}
            required
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getValidationIcon(phoneValidation)}
          </div>
        </div>
        {(errors.phone || phoneValidation.error) && (
          <p className="text-sm text-red-500 mt-1">
            {errors.phone || phoneValidation.error}
          </p>
        )}
        {phoneValidation.hasBeenChecked && phoneValidation.isValid && !errors.phone && (
          <p className="text-sm text-green-600 mt-1">
            {currentLanguage === 'ar' ? 'رقم الهاتف متاح' :
             currentLanguage === 'tr' ? 'Telefon numarası kullanılabilir' : 'Phone number is available'}
          </p>
        )}
      </div>
    </>
  );
};

export default BasicInfoFields;
