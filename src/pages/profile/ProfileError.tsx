
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileError = ({ error }: { error: string }) => {
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
      <div className="text-center max-w-md mx-auto p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('profileLoadError') || "خطأ في تحميل الملف الشخصي"}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-brand-accent text-brand-accent-foreground hover:brightness-95">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('retry') || "إعادة المحاولة"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileError;
