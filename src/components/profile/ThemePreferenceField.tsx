
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { applyThemeAndDispatchEvent } from "@/utils/themeUtils";

interface ThemePreferenceFieldProps {
  value: "light" | "dark";
  onChange: (value: "light" | "dark") => void;
  isEditing: boolean;
}

const ThemePreferenceField = ({
  value,
  onChange,
  isEditing,
}: ThemePreferenceFieldProps) => {
  const { t } = useLanguage();
  const { setTheme } = useTheme();

  // تغيير الثيم مع بث الحدث المخصص عند التبديل
  const handleSwitchChange = (checked: boolean) => {
    if (!isEditing) return;
    const selectedTheme = checked ? "dark" : "light";
    onChange(selectedTheme);
    applyThemeAndDispatchEvent(setTheme, selectedTheme);
  };

  return (
    <div className="flex items-center gap-4">
      <label className="block text-sm font-semibold mb-1">
        {t("theme")}
      </label>
      <span className="text-xs text-gray-500">
        {value === "dark" ? t("darkMode") : t("lightMode")}
      </span>
      <Switch
        checked={value === "dark"}
        onCheckedChange={handleSwitchChange}
        disabled={!isEditing}
        aria-label={t("toggleDarkMode")}
      />
    </div>
  );
};

export default ThemePreferenceField;
