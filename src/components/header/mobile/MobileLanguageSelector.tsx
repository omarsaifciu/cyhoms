
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const MobileLanguageSelector = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();

  // Fallback to default languages if no database settings are loaded yet
  const fallbackLanguages = [
    { code: "ar" as const, nameAr: "العربية", nameEn: "Arabic", nameTr: "Arapça", flag: "SA" },
    { code: "en" as const, nameAr: "الإنجليزية", nameEn: "English", nameTr: "İngilizce", flag: "US" },
    { code: "tr" as const, nameAr: "التركية", nameEn: "Turkish", nameTr: "Türkçe", flag: "TR" }
  ];

  // Map available languages to include flag information
  const languagesToShow = availableLanguages.length > 0 
    ? availableLanguages.map(lang => {
        const fallback = fallbackLanguages.find(f => f.code === lang.code);
        return {
          ...lang,
          flag: fallback?.flag || "🌐"
        };
      })
    : fallbackLanguages;

  const getLanguageName = (lang: typeof languagesToShow[0]) => {
    switch (currentLanguage) {
      case 'ar': return lang.nameAr;
      case 'tr': return lang.nameTr;
      default: return lang.nameEn;
    }
  };

  return (
    <div className="px-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className={`grid gap-2 ${languagesToShow.length === 3 ? 'grid-cols-3' : `grid-cols-${Math.min(languagesToShow.length, 4)}`}`}>
        {languagesToShow.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <Button
              key={lang.code}
              variant="ghost"
              size="sm"
              className={`
                rounded-full
                border
                ${isActive
                  ? `bg-[#53b8c4] border-transparent font-bold text-white dark:text-white dark:bg-[#2ca5b5] dark:border-[#2ca5b5]`
                  : `bg-white border-gray-200 text-gray-800 font-bold dark:bg-[#0b1421] dark:text-white dark:border-[#2ca5b5]`
                }
                transition
                flex items-center
              `}
              onClick={() => setLanguage(lang.code)}
              style={{
                letterSpacing: "0.01em"
              }}
            >
              <span className={`mr-1 text-xs font-extrabold ${isActive ? "text-white dark:text-white" : "text-gray-900 dark:text-white"}`}>
                {lang.flag}
              </span>
              <span className={`text-xs ml-1 ${isActive ? "text-white dark:text-white" : "text-gray-800 dark:text-white"}`}>
                {getLanguageName(lang)}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileLanguageSelector;
