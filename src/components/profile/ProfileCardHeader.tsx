
import { User } from "lucide-react";
import { CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileCardHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      <User className="w-6 h-6 text-brand-accent flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <CardTitle className="text-xl sm:text-2xl truncate">{t('personalInfo')}</CardTitle>
        <CardDescription className="text-sm truncate">{t('editProfile')}</CardDescription>
      </div>
    </div>
  );
};

export default ProfileCardHeader;
