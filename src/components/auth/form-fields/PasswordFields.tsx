
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormData, FormErrors } from "@/hooks/useSignupValidation";
import { Lock } from "lucide-react";

interface PasswordFieldsProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (field: string, value: string) => void;
}

const PasswordFields = ({ formData, errors, onInputChange }: PasswordFieldsProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <>
      <div>
        <Label htmlFor="password">
          {currentLanguage === 'ar' ? 'كلمة المرور' : 
           currentLanguage === 'tr' ? 'Şifre' : 'Password'} *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            className={`pl-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder={currentLanguage === 'ar' ? 'أدخل كلمة المرور' : 
                        currentLanguage === 'tr' ? 'Şifrenizi girin' : 'Enter your password'}
            required
          />
        </div>
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">
          {currentLanguage === 'ar' ? 'تأكيد كلمة المرور' : 
           currentLanguage === 'tr' ? 'Şifre Onayı' : 'Confirm Password'} *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            className={`pl-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder={currentLanguage === 'ar' ? 'أعد إدخال كلمة المرور' : 
                        currentLanguage === 'tr' ? 'Şifrenizi tekrar girin' : 'Confirm your password'}
            required
          />
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
      </div>
    </>
  );
};

export default PasswordFields;
