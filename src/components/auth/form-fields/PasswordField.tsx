
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export const PasswordField = ({ value, onChange, showPassword, onTogglePassword }: PasswordFieldProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div>
      <Label htmlFor="password">
        {currentLanguage === 'ar' ? 'كلمة المرور' : 
         currentLanguage === 'tr' ? 'Şifre' : 'Password'}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={currentLanguage === 'ar' ? 'أدخل كلمة المرور' : 
                      currentLanguage === 'tr' ? 'Şifre girin' : 'Enter password'}
          required
          className="pl-10 pr-10"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground focus:outline-none"
          onClick={onTogglePassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
