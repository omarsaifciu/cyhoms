
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const getLangSuffix = (lang: 'ar' | 'en' | 'tr') => {
    switch(lang) {
        case 'ar': return 'Ar';
        case 'tr': return 'Tr';
        default: return 'En';
    }
}

const NotFound = () => {
  const { currentLanguage } = useLanguage();
  const { settings } = useSiteSettings();
  
  const langSuffix = getLangSuffix(currentLanguage);

  const titleKey = `notFoundTitle${langSuffix}` as keyof typeof settings;
  const descKey = `notFoundDesc${langSuffix}` as keyof typeof settings;
  const buttonKey = `notFoundButton${langSuffix}` as keyof typeof settings;
  const imageKey = `notFoundSvg${langSuffix}` as keyof typeof settings;

  const title = settings[titleKey];
  const desc = settings[descKey];
  const button = settings[buttonKey];
  const image = settings[imageKey];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#181926] transition-colors px-2">
      <div className="flex flex-col items-center text-center gap-8 w-full max-w-lg">
        {/* صورة 404 أو SVG */}
        <div className="mb-1">
          {image && typeof image === 'string' ? (
            <img
              src={image}
              alt="Not Found"
              className="w-64 h-64 md:w-96 md:h-96 object-contain mx-auto"
            />
          ) : (
            <div className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center text-7xl md:text-9xl font-black select-none text-[#9ca3af] dark:text-[#464965] mx-auto">
              404
            </div>
          )}
        </div>

        {/* العنوان */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-fade-in">
          {String(title || "")}
        </h2>
        
        {/* الوصف */}
        {desc && (
          <p className="text-gray-600 dark:text-gray-300 -mt-4">{String(desc)}</p>
        )}

        {/* زر العودة للرئيسية */}
        <Button
          asChild
          size="lg"
          variant="default"
          className={`
            w-full max-w-xs mx-auto
            bg-brand-accent text-brand-accent-foreground
            hover:brightness-95 text-base font-bold
            transition-all rounded-md
            shadow-[0_0_18px_0_rgba(54,156,164,0.18)]
            !shadow-lg
            py-4
            flex justify-center items-center
            tracking-wide
            `}
          style={{
            boxShadow: "0 4px 16px 2px rgba(54,156,164,0.20)",
          }}
        >
          <Link to="/" tabIndex={0} className="w-full text-center">
            {String(button || "")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
