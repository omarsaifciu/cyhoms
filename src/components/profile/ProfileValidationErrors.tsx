
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileValidationErrorsProps {
  isEditing: boolean;
  isFormValid: boolean;
  validationErrors: Record<string, string>;
}

const ProfileValidationErrors = ({
  isEditing,
  isFormValid,
  validationErrors
}: ProfileValidationErrorsProps) => {
  const { currentLanguage } = useLanguage();

  if (!isEditing || isFormValid || Object.keys(validationErrors).length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <p className="text-sm font-medium text-red-700">
          {currentLanguage === 'ar' ? 'يرجى إصلاح الأخطاء التالية:' : 'Please fix the following errors:'}
        </p>
      </div>
      <ul className="text-sm text-red-600 space-y-1">
        {Object.values(validationErrors).map((error, index) => (
          <li key={index} className="flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileValidationErrors;
