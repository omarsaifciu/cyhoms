
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsernameValidation } from "@/hooks/useUsernameValidation";
import UsernameStatusIndicator from "./UsernameStatusIndicator";

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  currentUsername?: string;
  onValidationChange?: (isValid: boolean, error?: string) => void;
}

const UsernameField = ({ value, onChange, isEditing, currentUsername, onValidationChange }: UsernameFieldProps) => {
  const { currentLanguage } = useLanguage();
  const { usernameError, isChecking, isValid, validateUsername, checkUsernameAvailability } = useUsernameValidation(currentUsername);

  const handleUsernameChange = async (newUsername: string) => {
    onChange(newUsername);
    
    // التحقق من صحة التنسيق أولاً
    if (!validateUsername(newUsername, onValidationChange)) {
      return;
    }

    // التحقق من التوفر مع تأخير للحد من طلبات الشبكة
    const timeoutId = setTimeout(async () => {
      const isAvailable = await checkUsernameAvailability(newUsername);
      onValidationChange?.(isAvailable, isAvailable ? undefined : usernameError || undefined);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // التحقق من الحالة الأولية
  useEffect(() => {
    if (value) {
      validateUsername(value, onValidationChange);
    } else {
      // إذا كان فارغاً، فهو غير صحيح
      const error = currentLanguage === 'ar' ? 'اسم المستخدم مطلوب' : 'Username is required';
      onValidationChange?.(false, error);
    }
  }, [value, currentLanguage]);

  return (
    <div className="space-y-2">
      <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-100">
        {currentLanguage === 'ar' ? 'اسم المستخدم' : 'Username'} <span className="text-red-500">*</span>
      </Label>
      {isEditing ? (
        <div className="space-y-1">
          <div className="relative">
            <Input
              id="username"
              value={value}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={`transition-all duration-300 focus:ring-2 ${
                usernameError 
                  ? 'border-red-500 focus:ring-red-500' 
                  : isValid && value && !isChecking
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-200 focus:ring-pink-500'
              } 
              dark:bg-[#23263a] dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-[#23263a]
              `}
              placeholder={currentLanguage === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
            />
            
            <UsernameStatusIndicator
              isChecking={isChecking}
              usernameError={usernameError}
              isValid={isValid}
              value={value}
            />
          </div>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 dark:bg-[#23263a] dark:text-gray-100 rounded-lg text-gray-900 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#23263a]">
          {value ? `@${value}` : '-'}
        </div>
      )}
    </div>
  );
};

export default UsernameField;

