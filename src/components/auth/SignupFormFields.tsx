
import { FormData, FormErrors } from "@/hooks/useSignupValidation";
import BasicInfoFields from "./form-fields/BasicInfoFields";
import UsernameField from "./form-fields/UsernameField";
import UserTypeField from "./form-fields/UserTypeField";
import WhatsAppField from "./form-fields/WhatsAppField";
import PasswordFields from "./form-fields/PasswordFields";
import TermsAcceptance from "./form-fields/TermsAcceptance";

interface SignupFormFieldsProps {
  formData: FormData;
  errors: FormErrors;
  acceptTerms: boolean;
  onInputChange: (field: string, value: string) => void;
  onTermsChange: (checked: boolean) => void;
  onTermsClick: (e: React.MouseEvent) => void;
}

const SignupFormFields = ({
  formData,
  errors,
  acceptTerms,
  onInputChange,
  onTermsChange,
  onTermsClick
}: SignupFormFieldsProps) => {
  const handleUsernameChange = (username: string) => {
    onInputChange('username', username);
  };

  const handleUserTypeChange = (userType: string) => {
    onInputChange('userType', userType);
  };

  const handleWhatsAppChange = (whatsappNumber: string) => {
    onInputChange('whatsappNumber', whatsappNumber);
  };

  // تحديث الشرط ليشمل النوع الجديد
  const shouldShowWhatsApp = formData.userType === 'seller' || 
                             formData.userType === 'property_owner' || 
                             formData.userType === 'real_estate_office' ||
                             formData.userType === 'partner_and_site_owner';

  return (
    <>
      <BasicInfoFields
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
      />

      <UsernameField
        username={formData.username}
        error={errors.username}
        onUsernameChange={handleUsernameChange}
      />

      <UserTypeField
        userType={formData.userType}
        error={errors.userType}
        onUserTypeChange={handleUserTypeChange}
      />

      {shouldShowWhatsApp && (
        <WhatsAppField
          whatsappNumber={formData.whatsappNumber}
          error={errors.whatsappNumber}
          onWhatsAppChange={handleWhatsAppChange}
        />
      )}

      <PasswordFields
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
      />

      <TermsAcceptance
        acceptTerms={acceptTerms}
        error={errors.terms}
        onTermsChange={onTermsChange}
        onTermsClick={onTermsClick}
      />
    </>
  );
};

export default SignupFormFields;
