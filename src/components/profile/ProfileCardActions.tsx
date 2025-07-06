
import { Button } from "@/components/ui/button";
import { Settings, Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileCardActionsProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isSaving: boolean;
  isFormValid: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileCardActions = ({
  isEditing,
  setIsEditing,
  isSaving,
  isFormValid,
  onSave,
  onCancel
}: ProfileCardActionsProps) => {
  const { t, currentLanguage } = useLanguage();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (!isEditing) {
    return (
      <div className="flex justify-end w-full">
        <Button
          onClick={handleEditClick}
          className="bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to hover:brightness-95 text-white transition-all duration-300 transform hover:scale-105 text-sm px-3 py-2 h-auto min-w-0 whitespace-nowrap"
        >
          <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="hidden sm:inline">{t('editProfile')}</span>
          <span className="sm:hidden">تعديل</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 w-full justify-end flex-wrap">
      <Button
        variant="outline"
        onClick={onCancel}
        className="transition-all duration-300 hover:bg-gray-50 text-sm px-3 py-2 h-auto min-w-0 whitespace-nowrap order-2 sm:order-1"
      >
        <span className="hidden sm:inline">{currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}</span>
        <span className="sm:hidden">إلغاء</span>
      </Button>
      <Button
        onClick={onSave}
        disabled={isSaving || !isFormValid}
        className={`bg-gradient-to-r text-white transition-all duration-300 transform hover:scale-105 text-sm px-3 py-2 h-auto min-w-0 whitespace-nowrap order-1 sm:order-2 ${
          !isFormValid 
            ? 'from-gray-400 to-gray-500 cursor-not-allowed' 
            : 'from-brand-gradient-from to-brand-gradient-to hover:brightness-95'
        }`}
      >
        {isSaving ? (
          <div className="flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
            <span className="hidden sm:inline">{currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
            <span className="sm:hidden">حفظ...</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Save className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">{t('saveChanges')}</span>
            <span className="sm:hidden">حفظ</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default ProfileCardActions;
