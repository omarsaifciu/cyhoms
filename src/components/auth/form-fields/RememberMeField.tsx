
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface RememberMeFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const RememberMeField = ({ checked, onChange }: RememberMeFieldProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Checkbox
        id="rememberMe"
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[var(--brand-gradient-from-color,#ec489a)] data-[state=checked]:to-[var(--brand-gradient-to-color,#f43f5e)] data-[state=checked]:border-transparent"
      />
      <Label 
        htmlFor="rememberMe" 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300 cursor-pointer"
      >
        {currentLanguage === 'ar' ? 'حفظ تسجيل الدخول' : 
         currentLanguage === 'tr' ? 'Giriş bilgilerini hatırla' : 'Remember me'}
      </Label>
    </div>
  );
};
