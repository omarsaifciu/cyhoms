
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LanguageSelector = () => {
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

  const getCurrentLanguage = () => {
    return languagesToShow.find(lang => lang.code === currentLanguage) || languagesToShow[1];
  };

  const getLanguageName = (lang: typeof languagesToShow[0]) => {
    switch (currentLanguage) {
      case 'ar': return lang.nameAr;
      case 'tr': return lang.nameTr;
      default: return lang.nameEn;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-full p-2",
            "hover:bg-gray-100 dark:hover:bg-[#23293d]"
          )}
        >
          <Globe className="w-5 h-5 mr-2" />
          <span className="text-sm">{getCurrentLanguage().flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl border-0 shadow-2xl bg-white/95 dark:bg-[#23293d] backdrop-blur-lg">
        {languagesToShow.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "rounded-lg m-1 cursor-pointer",
              currentLanguage === lang.code
                ? "bg-brand-accent-light text-brand-accent font-semibold"
                : "hover:bg-gray-50 dark:hover:bg-[#181c23]"
            )}
          >
            <span className="mr-2">{lang.flag}</span>
            {getLanguageName(lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
