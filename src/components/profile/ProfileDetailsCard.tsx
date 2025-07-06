
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/user";
import { User as SupabaseUser } from "@supabase/supabase-js";
import ProfileFormFields from "./ProfileFormFields";
import ProfileCardHeader from "./ProfileCardHeader";
import ProfileCardActions from "./ProfileCardActions";
import ProfileValidationErrors from "./ProfileValidationErrors";
import { useState } from "react";

interface ProfileDetailsCardProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isSaving: boolean;
  formData: {
    full_name: string;
    username: string;
    phone: string;
    whatsapp_number: string;
    user_type: 'client' | 'seller' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner';
    language_preference: 'ar' | 'en' | 'tr';
    theme_preference: 'dark' | 'light' | 'system'; // Added
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    full_name: string;
    username: string;
    phone: string;
    whatsapp_number: string;
    user_type: 'client' | 'seller' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner';
    language_preference: 'ar' | 'en' | 'tr';
    theme_preference: 'dark' | 'light' | 'system'; // Added
  }>>;
  profile: UserProfile;
  user: SupabaseUser;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileDetailsCard = ({
  isEditing,
  setIsEditing,
  isSaving,
  formData,
  setFormData,
  profile,
  user,
  onSave,
  onCancel
}: ProfileDetailsCardProps) => {
  const [isFormValid, setIsFormValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleValidationChange = (isValid: boolean, errors: Record<string, string>) => {
    setIsFormValid(isValid);
    setValidationErrors(errors);
  };

  const handleSave = () => {
    if (!isFormValid) {
      return;
    }
    onSave();
  };

  return (
    <Card className="animate-fade-in transition-all duration-300 hover:shadow-xl border-0 bg-white dark:bg-[#181926] dark:border-none dark:backdrop-blur-0 backdrop-blur-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 pb-0 gap-4">
        <div className="flex-1 min-w-0">
          <ProfileCardHeader />
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <ProfileCardActions
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            isFormValid={isFormValid}
            onSave={handleSave}
            onCancel={onCancel}
          />
        </div>
      </div>
      
      <ProfileValidationErrors
        isEditing={isEditing}
        isFormValid={isFormValid}
        validationErrors={validationErrors}
      />
      
      <CardContent className="p-4 sm:p-6 space-y-6 dark:text-gray-100 text-gray-900">
        <ProfileFormFields
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
          profile={profile}
          user={user}
          onValidationChange={handleValidationChange}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileDetailsCard;
