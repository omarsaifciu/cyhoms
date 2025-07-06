
import React from "react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const HeroSectionSettings: React.FC<Props> = ({ settings, updateSetting, currentLanguage, t }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 dark:bg-[#181c20] dark:border-gray-700 p-5 rounded-xl my-4">
      <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">
        {t("siteSettings.heroSectionTitle") || "Hero Section"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-gray-300">
            {t("arabic") || "Arabic"} {t("title") || "Title"}
          </label>
          <Input
            value={settings.heroTitleAr || ""}
            onChange={(e) => updateSetting("heroTitleAr", e.target.value)}
            placeholder="العنوان في الهيرو (بالعربية)"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-gray-300">
            {t("english") || "English"} {t("title") || "Title"}
          </label>
          <Input
            value={settings.heroTitleEn || ""}
            onChange={(e) => updateSetting("heroTitleEn", e.target.value)}
            placeholder="Hero title (English)"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-gray-300">
            {t("turkish") || "Turkish"} {t("title") || "Title"}
          </label>
          <Input
            value={settings.heroTitleTr || ""}
            onChange={(e) => updateSetting("heroTitleTr", e.target.value)}
            placeholder="Hero başlık (Türkçe)"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        <div>
          <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-gray-300">
            {t("arabic") || "Arabic"} {t("description") || "Description"}
          </label>
          <Input
            value={settings.heroDescriptionAr || ""}
            onChange={(e) => updateSetting("heroDescriptionAr", e.target.value)}
            placeholder="وصف الهيرو (بالعربية)"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-gray-300">
            {t("english") || "English"} {t("description") || "Description"}
          </label>
          <Input
            value={settings.heroDescriptionEn || ""}
            onChange={(e) => updateSetting("heroDescriptionEn", e.target.value)}
            placeholder="Hero description (English)"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-gray-300">
            {t("turkish") || "Turkish"} {t("description") || "Description"}
          </label>
          <Input
            value={settings.heroDescriptionTr || ""}
            onChange={(e) => updateSetting("heroDescriptionTr", e.target.value)}
            placeholder="Hero açıklama (Türkçe)"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSectionSettings;
