
import { CheckCircle, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UsernameStatusIndicatorProps {
  isChecking: boolean;
  usernameError: string | null;
  isValid: boolean;
  value: string;
}

const UsernameStatusIndicator = ({ isChecking, usernameError, isValid, value }: UsernameStatusIndicatorProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="space-y-1">
      {/* تم إزالة الأيقونة التي كانت تظهر داخل حقل الإدخال */}
      
      {/* رسالة التحقق */}
      {isChecking && (
        <p className="text-sm text-blue-600 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          {currentLanguage === 'ar' ? 'جاري التحقق من توفر الاسم...' : 'Checking availability...'}
        </p>
      )}
      
      {/* رسالة الخطأ */}
      {usernameError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" />
          {usernameError}
        </p>
      )}
      
      {/* رسالة النجاح */}
      {!usernameError && !isChecking && value && value.trim() !== '' && isValid && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {currentLanguage === 'ar' ? 'اسم المستخدم متوفر!' : 'Username is available!'}
        </p>
      )}
      
      {/* معلومات إضافية */}
      <p className="text-xs text-gray-500">
        {currentLanguage === 'ar' ? 
          'يمكن استخدام الأحرف والأرقام والشرطة السفلية فقط (3-20 حرف، مطلوب)' : 
          'Only letters, numbers, and underscores allowed (3-20 characters, required)'}
      </p>
    </div>
  );
};

export default UsernameStatusIndicator;
