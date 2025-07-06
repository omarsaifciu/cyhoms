
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { useLogoSettings } from "@/hooks/useLogoSettings";

// fallback افتراضي
const defaultLogo = {
  light: "/logo/logo-default-light.png",
  dark: "/logo/logo-default-dark.png"
};

interface LogoProps {
  className?: string;
}

const languageFieldMap = {
  ar: { light: "logo_ar_light_url", dark: "logo_ar_dark_url" },
  en: { light: "logo_en_light_url", dark: "logo_en_dark_url" },
  tr: { light: "logo_tr_light_url", dark: "logo_tr_dark_url" }
};

const Logo = ({ className = "" }: LogoProps) => {
  const { currentLanguage } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { logoSettings } = useLogoSettings();

  const darkMode = resolvedTheme === "dark";
  let logoUrl = "";

  if (logoSettings && logoSettings.logo_type !== "text") {
    const fieldKey =
      currentLanguage in languageFieldMap
        ? languageFieldMap[currentLanguage as keyof typeof languageFieldMap][darkMode ? "dark" : "light"]
        : languageFieldMap.en[darkMode ? "dark" : "light"];
    logoUrl = logoSettings[fieldKey] || "";
  }

  // fallback محلي إذا لم يوجد شعار مرفوع أو نوعه نص
  if (!logoUrl) {
    logoUrl = darkMode ? defaultLogo.dark : defaultLogo.light;
  }

  // المعالجة في حالة الشعار نصي فقط
  if (logoSettings && logoSettings.logo_type === "text") {
    const text =
      currentLanguage === "ar"
        ? logoSettings.logo_text_ar
        : currentLanguage === "tr"
        ? logoSettings.logo_text_tr
        : logoSettings.logo_text_en;

    return (
      <div className={`flex items-center space-x-3 rtl:space-x-reverse ${className}`}>
        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent transition-all duration-300">
          {text || "Site Logo"}
        </span>
      </div>
    );
  }

  // صورة الشعار (حقيقي او افتراضي)
  return (
    <div className={`flex items-center space-x-3 rtl:space-x-reverse ${className}`}>
      <img
        src={logoUrl}
        alt="Site Logo"
        className="h-10 w-auto object-contain transition-all duration-300"
        onError={e => {
          (e.currentTarget as HTMLImageElement).src = darkMode ? defaultLogo.dark : defaultLogo.light;
        }}
      />
    </div>
  );
};

export default Logo;
