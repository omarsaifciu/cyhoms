
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguagePreferenceFieldProps {
  value: 'ar' | 'en' | 'tr';
  onChange: (value: 'ar' | 'en' | 'tr') => void;
  isEditing: boolean;
}

const LanguagePreferenceField = ({ value, onChange, isEditing }: LanguagePreferenceFieldProps) => {
  const { t } = useLanguage();

  const getLanguageDisplay = (lang: string) => {
    switch (lang) {
      case 'ar': return t('arabic');
      case 'en': return t('english');
      case 'tr': return t('turkish');
      default: return lang;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">{t('languagePreference')}</Label>
      {isEditing ? (
        <Select
          value={value}
          onValueChange={onChange}
        >
          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-pink-500 border-gray-200 dark:bg-[#23263a] dark:text-gray-100 dark:border-[#23263a] dark:placeholder:text-gray-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#23263a] dark:text-gray-100">
            <SelectItem value="ar">{t('arabic')}</SelectItem>
            <SelectItem value="en">{t('english')}</SelectItem>
            <SelectItem value="tr">{t('turkish')}</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="p-3 bg-gray-50 dark:bg-[#23263a] dark:text-gray-100 rounded-lg text-gray-900 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#23263a]">
          {getLanguageDisplay(value)}
        </div>
      )}
    </div>
  );
};

export default LanguagePreferenceField;

