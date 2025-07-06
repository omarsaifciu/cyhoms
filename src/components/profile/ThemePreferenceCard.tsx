
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";
import { useTheme } from "next-themes";
import { applyThemeAndDispatchEvent } from "@/utils/themeUtils";

interface ThemePreferenceCardProps {
  value: "light" | "dark";
  onChange: (value: "light" | "dark") => void;
  isEditing?: boolean;
}

const ThemePreferenceCard = ({
  value,
  onChange,
  isEditing = true,
}: ThemePreferenceCardProps) => {
  const { t, currentLanguage } = useLanguage();
  const { setTheme } = useTheme();

  const handleSwitchChange = (checked: boolean) => {
    if (!isEditing) return;
    const selected = checked ? "dark" : "light";
    onChange(selected);
    applyThemeAndDispatchEvent(setTheme, selected);
  };

  return (
    <Card
      className={`
        w-full max-w-md mx-auto 
        bg-white dark:bg-[#181926]
        shadow-lg border-0 rounded-lg
        animate-fade-in transition-all
        mt-8 sm:mt-14
        px-5 py-6
      `}
    >
      <div className="flex flex-col gap-1">
        {/* صف العنوان مع زر السويتش */}
        <div className={`flex items-center justify-between mb-3`}>
          {/* السويتش في اليمين بالعربية، اليسار في بقية اللغات */}
          {currentLanguage === "ar" ? (
            <>
              <Switch
                checked={value === "dark"}
                onCheckedChange={handleSwitchChange}
                disabled={!isEditing}
                aria-label={t("toggleDarkMode")}
                className="scale-110"
              />
              <span className="block font-semibold text-base text-gray-900 dark:text-white">
                {t("theme")}
              </span>
            </>
          ) : (
            <>
              <span className="block font-semibold text-base text-gray-900 dark:text-white">
                {t("theme")}
              </span>
              <Switch
                checked={value === "dark"}
                onCheckedChange={handleSwitchChange}
                disabled={!isEditing}
                aria-label={t("toggleDarkMode")}
                className="scale-110"
              />
            </>
          )}
        </div>
        {/* سطر يعرض وضع الثيم الحالي ويكون متعدد اللغات */}
        <div className="mt-3 block text-sm font-medium text-brand-accent dark:text-brand-accent text-center">
          {value === "dark" ? t("darkMode") : t("lightMode")}
        </div>
      </div>
    </Card>
  );
};

export default ThemePreferenceCard;
