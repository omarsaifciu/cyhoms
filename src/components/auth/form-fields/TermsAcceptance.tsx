
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface TermsAcceptanceProps {
  acceptTerms: boolean;
  error?: string;
  onTermsChange: (checked: boolean) => void;
  onTermsClick: (e: React.MouseEvent) => void;
}

const TermsAcceptance = ({ acceptTerms, error, onTermsChange, onTermsClick }: TermsAcceptanceProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="flex items-start space-x-2 rtl:space-x-reverse">
      <Checkbox
        id="acceptTerms"
        checked={acceptTerms}
        onCheckedChange={(checked) => onTermsChange(checked as boolean)}
        className={`mt-1 ${error ? 'border-red-500' : ''}`}
      />
      <div className="flex-1">
        <Label htmlFor="acceptTerms" className="text-sm leading-normal">
          {currentLanguage === 'ar' ? 'أوافق على ' : 
           currentLanguage === 'tr' ? 'Kabul ediyorum ' : 'I agree to the '}
          <button 
            type="button"
            onClick={onTermsClick}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {currentLanguage === 'ar' ? 'سياسة الخصوصية والأحكام والشروط' : 
             currentLanguage === 'tr' ? 'Gizlilik Politikası ve Şartlar' : 'Privacy Policy & Terms and Conditions'}
          </button>
        </Label>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default TermsAcceptance;
