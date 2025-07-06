
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormErrors } from "@/hooks/useSignupValidation";
import { AtSign, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useRealTimeValidation } from "@/hooks/auth/useRealTimeValidation";

interface UsernameFieldProps {
  username: string;
  error?: string;
  onUsernameChange: (username: string) => void;
}

const UsernameField = ({ username, error, onUsernameChange }: UsernameFieldProps) => {
  const { currentLanguage } = useLanguage();
  const { usernameValidation, validateUsername } = useRealTimeValidation();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // السماح بالأحرف والأرقام والشرطة السفلية فقط
    const allowedRegex = /^[a-zA-Z0-9_أ-ي\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFçğıöşüÇĞIİÖŞÜ]*$/;

    if (allowedRegex.test(value)) {
      onUsernameChange(value);
      validateUsername(value);
    }
  };

  const handleUsernameBlur = () => {
    if (username) {
      validateUsername(username);
    }
  };

  // Get validation icon
  const getValidationIcon = () => {
    if (usernameValidation.isChecking) {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    if (usernameValidation.hasBeenChecked) {
      return usernameValidation.isValid
        ? <CheckCircle className="w-4 h-4 text-green-500" />
        : <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div>
      <Label htmlFor="username">
        {currentLanguage === 'ar' ? 'اسم المستخدم' :
         currentLanguage === 'tr' ? 'Kullanıcı Adı' : 'Username'} *
      </Label>
      <div className="relative">
        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
        <Input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          onBlur={handleUsernameBlur}
          className={`pl-10 pr-10 ${
            error || usernameValidation.error
              ? 'border-red-500 focus:border-red-500'
              : usernameValidation.hasBeenChecked && usernameValidation.isValid
                ? 'border-green-500 focus:border-green-500'
                : ''
          }`}
          placeholder={currentLanguage === 'ar' ? 'أحرف وأرقام وشرطة سفلية فقط' :
                      currentLanguage === 'tr' ? 'Sadece harfler, rakamlar ve alt çizgi' : 'Letters, numbers and underscore only'}
          required
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>
      {(error || usernameValidation.error) && (
        <p className="text-sm text-red-500 mt-1">
          {error || usernameValidation.error}
        </p>
      )}
      {usernameValidation.hasBeenChecked && usernameValidation.isValid && !error && (
        <p className="text-sm text-green-600 mt-1">
          {currentLanguage === 'ar' ? 'اسم المستخدم متاح' :
           currentLanguage === 'tr' ? 'Kullanıcı adı kullanılabilir' : 'Username is available'}
        </p>
      )}
    </div>
  );
};

export default UsernameField;
