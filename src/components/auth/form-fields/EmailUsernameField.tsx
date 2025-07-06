
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { AtSign } from "lucide-react";

interface EmailUsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmailUsernameField = ({ value, onChange }: EmailUsernameFieldProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div>
      <Label htmlFor="emailOrUsername">
        {currentLanguage === 'ar' ? 'البريد الإلكتروني أو اسم المستخدم' : 
         currentLanguage === 'tr' ? 'E-posta veya Kullanıcı Adı' : 'Email or Username'}
      </Label>
      <div className="relative">
        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
        <Input
          id="emailOrUsername"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={currentLanguage === 'ar' ? 'أدخل البريد الإلكتروني أو اسم المستخدم' : 
                      currentLanguage === 'tr' ? 'E-posta veya kullanıcı adı girin' : 'Enter email or username'}
          className="pl-10"
          required
        />
      </div>
    </div>
  );
};
