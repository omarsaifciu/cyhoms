
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserTypeFieldProps {
  value: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support';
  onChange: (value: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support') => void;
  isEditing: boolean;
}

const UserTypeField = ({ value, onChange, isEditing }: UserTypeFieldProps) => {
  const { t, currentLanguage } = useLanguage();

  const getUserTypeDisplay = (type: string) => {
    switch (type) {
      case 'client': return t('client');
      case 'agent': return t('seller');
      case 'property_owner': return t('property_owner');
      case 'real_estate_office':
        // يظهر دائماً بحسب اللغة
        if (currentLanguage === 'ar') return "مكتب عقارات";
        if (currentLanguage === 'tr') return "Emlak Ofisi";
        return "Real Estate Office";
      case 'partner_and_site_owner': return t('partner_and_site_owner') || 'شريك ومالك الموقع';
      case 'support':
        if (currentLanguage === 'ar') return "دعم فني";
        if (currentLanguage === 'tr') return "Destek";
        return "Support";
      default: return type;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">{t('userType')}</Label>
      {isEditing ? (
        <Select
          value={value}
          onValueChange={onChange}
        >
          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-pink-500 border-gray-200 dark:bg-[#23263a] dark:text-gray-100 dark:border-[#23263a] dark:placeholder:text-gray-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#23263a] dark:text-gray-100">
            <SelectItem value="client">{t('client')}</SelectItem>
            <SelectItem value="agent">{t('seller')}</SelectItem>
            <SelectItem value="property_owner">{t('property_owner')}</SelectItem>
            <SelectItem value="real_estate_office">
              {/* ترجمة مكتب عقارات في كل اللغات */}
              {currentLanguage === 'ar'
                ? "مكتب عقارات"
                : currentLanguage === 'tr'
                ? "Emlak Ofisi"
                : "Real Estate Office"}
            </SelectItem>
            <SelectItem value="support">
              {currentLanguage === 'ar'
                ? "دعم فني"
                : currentLanguage === 'tr'
                ? "Destek"
                : "Support"}
            </SelectItem>
            {/* تم إخفاء خيار شريك ومالك الموقع */}
          </SelectContent>
        </Select>
      ) : (
        <div className="p-3 bg-gray-50 dark:bg-[#23263a] dark:text-gray-100 rounded-lg text-gray-900 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#23263a]">
          {getUserTypeDisplay(value)}
        </div>
      )}
    </div>
  );
};

export default UserTypeField;
