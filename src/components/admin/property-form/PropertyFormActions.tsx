
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

const PropertyFormActions = ({ onCancel, onSubmit, isSubmitting, isValid }: PropertyFormActionsProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting || !isValid}>
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            {currentLanguage === 'ar' ? 'جارٍ الحفظ...' : 'Saving...'}
          </>
        ) : (
          currentLanguage === 'ar' ? 'حفظ العقار' : 'Save Property'
        )}
      </Button>
    </div>
  );
};

export default PropertyFormActions;
