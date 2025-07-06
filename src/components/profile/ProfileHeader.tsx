
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {t('profile')}
      </h1>
      <p className="text-gray-600 dark:text-gray-200">
        {t('personalInfo')}
      </p>
    </div>
  );
};

export default ProfileHeader;
