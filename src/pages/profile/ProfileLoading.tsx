
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileLoading = () => {
  const { t } = useLanguage();
  return (
    <div
      className={`
        min-h-screen pt-24 flex items-center justify-center
        bg-gradient-to-br
        from-brand-gradient-from-light to-brand-gradient-to-light
        dark:bg-[#222636] dark:from-none dark:to-none
      `}
    >
      <div className="animate-fade-in text-center">
        <Loader2 
          className="w-8 h-8 animate-spin mx-auto mb-4" 
          style={{ color: 'var(--brand-gradient-from-color)' }}
        />
        <p className="text-gray-600">{t('loading')}</p>
      </div>
    </div>
  );
};

export default ProfileLoading;
