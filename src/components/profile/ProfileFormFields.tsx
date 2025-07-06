import { useLanguage } from "@/contexts/LanguageContext";
import { UserProfile } from "@/types/user";
import { User } from "@supabase/supabase-js";
import UsernameField from "./UsernameField";
import ValidatedInputField from "./ValidatedInputField";
import ReadOnlyField from "./ReadOnlyField";
import UserTypeField from "./UserTypeField";
import LanguagePreferenceField from "./LanguagePreferenceField";
import WhatsAppField from "./WhatsAppField";
import { useState, useEffect } from "react";
import { validateFullName, validatePhone, validateWhatsApp } from "@/utils/profileValidation";

interface ProfileFormFieldsProps {
  formData: {
    full_name: string;
    username: string;
    phone: string;
    whatsapp_number: string;
    user_type: 'client' | 'seller' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner';
    language_preference: 'ar' | 'en' | 'tr';
    theme_preference: 'dark' | 'light' | 'system';
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    full_name: string;
    username: string;
    phone: string;
    whatsapp_number: string;
    user_type: 'client' | 'seller' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner';
    language_preference: 'ar' | 'en' | 'tr';
    theme_preference: 'dark' | 'light' | 'system';
  }>>;
  isEditing: boolean;
  profile: UserProfile;
  user: User;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
}

const ProfileFormFields = ({
  formData, 
  setFormData, 
  isEditing, 
  profile, 
  user, 
  onValidationChange
}: ProfileFormFieldsProps & {formData: any; setFormData: any; }) => {
  const { t, currentLanguage } = useLanguage();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // تحديد ما إذا كان يجب إظهار حقل الواتساب
  const shouldShowWhatsApp = ['seller', 'property_owner', 'real_estate_office', 'partner_and_site_owner'].includes(formData.user_type);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // التحقق من صحة البيانات
    let error: string | null = null;
    if (field === 'full_name') {
      const result = validateFullName(value, currentLanguage);
      error = result.error || null;
    } else if (field === 'phone') {
      const result = validatePhone(value, currentLanguage);
      error = result.error || null;
    } else if (field === 'whatsapp_number' && shouldShowWhatsApp) {
      const result = validateWhatsApp(value, currentLanguage);
      error = result.error || null;
    }

    const newErrors = { ...validationErrors };
    if (error) {
      newErrors[field] = error;
    } else {
      delete newErrors[field];
    }
    
    setValidationErrors(newErrors);
    
    // إبلاغ المكون الأب بحالة التحقق
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid, newErrors);
  };

  const handleUsernameValidation = (isValid: boolean, error?: string) => {
    const newErrors = { ...validationErrors };
    if (!isValid && error) {
      newErrors.username = error;
    } else {
      delete newErrors.username;
    }
    
    setValidationErrors(newErrors);
    
    // إبلاغ المكون الأب بحالة التحقق
    const isFormValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isFormValid, newErrors);
  };

  // التحقق الأولي من جميع الحقول
  useEffect(() => {
    if (isEditing) {
      const errors: Record<string, string> = {};
      
      const fullNameResult = validateFullName(formData.full_name, currentLanguage);
      if (!fullNameResult.isValid && fullNameResult.error) {
        errors.full_name = fullNameResult.error;
      }
      
      const phoneResult = validatePhone(formData.phone, currentLanguage);
      if (!phoneResult.isValid && phoneResult.error) {
        errors.phone = phoneResult.error;
      }

      if (shouldShowWhatsApp) {
        const whatsappResult = validateWhatsApp(formData.whatsapp_number, currentLanguage);
        if (!whatsappResult.isValid && whatsappResult.error) {
          errors.whatsapp_number = whatsappResult.error;
        }
      }
      
      setValidationErrors(prevErrors => ({ ...prevErrors, ...errors }));
      const allErrors = { ...validationErrors, ...errors };
      onValidationChange?.(Object.keys(allErrors).length === 0, allErrors);
    }
  }, [isEditing, formData.full_name, formData.phone, formData.user_type, formData.whatsapp_number, currentLanguage]);

  // اجعل ثيم الحقل فقط "light" أو "dark" في النموذج، ولو جاءت "system" حولها فورًا لـ "light"
  const themeValue: "light" | "dark" = formData.theme_preference === "dark" ? "dark" : "light";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Full Name */}
      <ValidatedInputField
        id="fullName"
        label={t('fullName')}
        value={formData.full_name}
        onChange={(value) => handleFieldChange('full_name', value)}
        placeholder={t('fullName')}
        isEditing={isEditing}
        error={validationErrors.full_name}
        isRequired
      />

      {/* Username */}
      <UsernameField
        value={formData.username}
        onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
        isEditing={isEditing}
        currentUsername={profile?.username}
        onValidationChange={handleUsernameValidation}
      />

      {/* Email (Read-only) */}
      <ReadOnlyField
        label={t('email')}
        value={user?.email || ''}
      />

      {/* Phone */}
      <ValidatedInputField
        id="phone"
        label={t('phone')}
        value={formData.phone}
        onChange={(value) => handleFieldChange('phone', value)}
        placeholder={t('phone')}
        isEditing={isEditing}
        error={validationErrors.phone}
        isRequired
      />

      {/* WhatsApp Number - Only for sellers, property owners, and real estate offices */}
      {shouldShowWhatsApp && (
        <WhatsAppField
          value={formData.whatsapp_number}
          onChange={(value) => handleFieldChange('whatsapp_number', value)}
          isEditing={isEditing}
          error={validationErrors.whatsapp_number}
          isRequired={true}
        />
      )}

      {/* User Type */}
      <UserTypeField
        value={formData.user_type}
        onChange={(value) => setFormData(prev => ({ ...prev, user_type: value }))}
        isEditing={isEditing}
      />

      {/* Language Preference */}
      <LanguagePreferenceField
        value={formData.language_preference}
        onChange={(value) => setFormData(prev => ({ ...prev, language_preference: value }))}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ProfileFormFields;
