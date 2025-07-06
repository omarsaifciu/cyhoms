
import { useLanguage } from "@/contexts/LanguageContext";

export const useValidationMessages = () => {
  const { currentLanguage } = useLanguage();

  const getErrorMessage = (key: string): string => {
    const messages = {
      ar: {
        required: 'هذا الحقل مطلوب',
        invalidUsername: 'اسم المستخدم يمكن أن يحتوي فقط على أحرف وأرقام وشرطة سفلية',
        invalidFullName: 'الاسم الكامل يجب أن يحتوي على أحرف فقط بدون أرقام',
        usernameTaken: 'اسم المستخدم غير متاح، يرجى اختيار اسم مستخدم آخر',
        emailTaken: 'هذا البريد الإلكتروني مسجل بالفعل، يرجى استخدام بريد إلكتروني آخر',
        phoneTaken: 'رقم الهاتف مسجل بالفعل، يرجى استخدام رقم هاتف آخر',
        whatsappTaken: 'رقم الواتساب مسجل بالفعل، يرجى استخدام رقم واتساب آخر',
        passwordMismatch: 'كلمات المرور غير متطابقة',
        whatsappRequired: 'رقم الواتساب مطلوب للبائعين ومالكي العقارات ومكاتب العقارات',
        termsRequired: 'يجب الموافقة على سياسة الخصوصية والأحكام والشروط',
        invalidEmail: 'صيغة البريد الإلكتروني غير صحيحة',
        invalidPhone: 'صيغة رقم الهاتف غير صحيحة',
        validationError: 'حدث خطأ أثناء التحقق من البيانات'
      },
      en: {
        required: 'This field is required',
        invalidUsername: 'Username can only contain letters, numbers, and underscores',
        invalidFullName: 'Full name must contain only letters without numbers',
        usernameTaken: 'This username is not available, please choose a different username',
        emailTaken: 'This email is already registered, please use a different email address',
        phoneTaken: 'This phone number is already registered, please use a different phone number',
        whatsappTaken: 'This WhatsApp number is already registered, please use a different WhatsApp number',
        passwordMismatch: 'Passwords do not match',
        whatsappRequired: 'WhatsApp number is required for sellers, property owners and real estate offices',
        termsRequired: 'You must accept the privacy policy and terms and conditions',
        invalidEmail: 'Invalid email format',
        invalidPhone: 'Invalid phone number format',
        validationError: 'An error occurred while validating data'
      },
      tr: {
        required: 'Bu alan gereklidir',
        invalidUsername: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir',
        invalidFullName: 'Ad soyad sadece harf içermeli, rakam içermemeli',
        usernameTaken: 'Bu kullanıcı adı kullanılamıyor, lütfen farklı bir kullanıcı adı seçin',
        emailTaken: 'Bu e-posta adresi zaten kayıtlı, lütfen farklı bir e-posta adresi kullanın',
        phoneTaken: 'Bu telefon numarası zaten kayıtlı, lütfen farklı bir telefon numarası kullanın',
        whatsappTaken: 'Bu WhatsApp numarası zaten kayıtlı, lütfen farklı bir WhatsApp numarası kullanın',
        passwordMismatch: 'Şifreler eşleşmiyor',
        whatsappRequired: 'Satıcılar, mülk sahipleri ve emlak ofisleri için WhatsApp numarası gereklidir',
        termsRequired: 'Gizlilik politikasını ve şartları kabul etmelisiniz',
        invalidEmail: 'Geçersiz e-posta formatı',
        invalidPhone: 'Geçersiz telefon numarası formatı',
        validationError: 'Veri doğrulanırken bir hata oluştu'
      }
    };

    return messages[currentLanguage as keyof typeof messages]?.[key as keyof typeof messages.ar] || messages.en[key as keyof typeof messages.en] || '';
  };

  return { getErrorMessage };
};
