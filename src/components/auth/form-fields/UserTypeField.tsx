
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users } from "lucide-react";

interface UserTypeFieldProps {
  userType: string;
  error?: string;
  onUserTypeChange: (userType: string) => void;
}

const UserTypeField = ({ userType, error, onUserTypeChange }: UserTypeFieldProps) => {
  const { currentLanguage } = useLanguage();

  // Helper function for label translation of "real_estate_office"
  const getRealEstateOfficeLabel = () => {
    if (currentLanguage === 'ar') return 'مكتب عقارات';
    if (currentLanguage === 'tr') return 'Emlak Ofisi';
    return 'Real Estate Office';
  };

  return (
    <div>
      <Label htmlFor="userType">
        {currentLanguage === 'ar' ? 'نوع الحساب' : 
         currentLanguage === 'tr' ? 'Hesap Türü' : 'Account Type'} *
      </Label>
      <div className="relative">
        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 z-10" />
        <Select value={userType} onValueChange={onUserTypeChange}>
          <SelectTrigger className={`pl-10 ${error ? 'border-red-500 focus:border-red-500' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">
              {currentLanguage === 'ar' ? 'عميل' : currentLanguage === 'tr' ? 'Müşteri' : 'Client'}
            </SelectItem>
            <SelectItem value="agent">
              {currentLanguage === 'ar' ? 'وسيط' : currentLanguage === 'tr' ? 'Acente' : 'Agent'}
            </SelectItem>
            <SelectItem value="support">
              {currentLanguage === 'ar' ? 'دعم فني' : currentLanguage === 'tr' ? 'Destek' : 'Support'}
            </SelectItem>
            <SelectItem value="property_owner">
              {currentLanguage === 'ar' ? 'مالك عقار' : currentLanguage === 'tr' ? 'Mülk Sahibi' : 'Property Owner'}
            </SelectItem>
            <SelectItem value="real_estate_office">
              {getRealEstateOfficeLabel()}
            </SelectItem>
            {/* خيار شريك ومالك الموقع مخفي الآن */}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default UserTypeField;
