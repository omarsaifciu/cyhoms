import { Sparkles, Building2, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHeroBackgrounds } from "@/hooks/useHeroBackgrounds";
import { useHeroStats } from "@/hooks/useHeroStats";
import { SiteSettings } from "@/types/siteSettings";
import { formatCompactNumber } from "@/lib/utils";

interface HeroSectionProps {
  settings: SiteSettings;
  settingsLoading: boolean;
}

const HeroSection = ({ settings, settingsLoading }: HeroSectionProps) => {
  const { t, currentLanguage } = useLanguage();
  const { backgrounds, loading: backgroundsLoading } = useHeroBackgrounds();
  const { totalProperties, totalCities, totalViews, loading: statsLoading } = useHeroStats();
  
  const [currentBackground, setCurrentBackground] = useState<string | null>(null);

  const defaultBackground = "https://images.unsplash.com/photo-1721322800607-8c38375eef04";

  useEffect(() => {
    if (settingsLoading || backgroundsLoading) return;

    if (settings.heroSlideshowEnabled) {
      const activeSlides = backgrounds.filter(bg => bg.is_active);
      if (activeSlides.length > 0) {
        let currentIndex = 0;
        setCurrentBackground(activeSlides[currentIndex].image_url);
        const interval = setInterval(() => {
          currentIndex = (currentIndex + 1) % activeSlides.length;
          setCurrentBackground(activeSlides[currentIndex].image_url);
        }, (settings.heroSlideshowInterval || 5) * 1000);
        return () => clearInterval(interval);
      } else {
        setCurrentBackground(null);
      }
    } else {
      const activeBackground = backgrounds.find(bg => bg.is_active);
      setCurrentBackground(activeBackground ? activeBackground.image_url : null);
    }
  }, [settings, settingsLoading, backgrounds, backgroundsLoading]);

  // استخدم الحقول الجديدة فقط للعنوان والوصف
  const getTitle = () => {
    if (!settings) return "";
    return currentLanguage === "ar"
      ? settings.heroTitleAr
      : currentLanguage === "tr"
        ? settings.heroTitleTr
        : settings.heroTitleEn;
  };

  const getSubtitle = () => {
    if (!settings) return "";
    return currentLanguage === "ar"
      ? settings.heroDescriptionAr
      : currentLanguage === "tr"
        ? settings.heroDescriptionTr
        : settings.heroDescriptionEn;
  };

  const finalCurrentBackground = currentBackground || defaultBackground;

  const displayNumber = (number: number, loading: boolean) => {
    if (loading) {
      return (
        <div className="animate-pulse bg-white/20 rounded h-8 w-16"></div>
      );
    }
    return formatCompactNumber(number);
  };

  const scrollToProperties = () => {
    let targetSection = document.querySelector('[data-section="featured-properties"]');
    if (!targetSection) {
      targetSection = document.querySelector('[data-section="properties"]') || 
                     document.querySelector('.properties-section');
    }
    if (targetSection) {
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      document.documentElement.style.scrollBehavior = 'smooth';
      setTimeout(() => document.documentElement.style.scrollBehavior = 'auto', 1000);
    } else {
      window.scrollTo({
        top: window.innerHeight * 1.3,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen h-auto flex items-center justify-center overflow-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0 w-full">
        {backgroundsLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        ) : (
          <div className="absolute inset-0 w-full transition-opacity duration-1000">
            <img 
              key={finalCurrentBackground}
              src={finalCurrentBackground}
              alt="Hero background" 
              className="w-full h-full object-cover scale-105 hero-float transition-all duration-1000 ease-out animate-fade-in"
              style={{
                filter: 'brightness(0.85) contrast(1.1)',
              }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 hero-fade-in"></div>
      </div>
      
      {/* الديكورات */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full hero-pulse-soft"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400/40 rounded-full hero-bounce-subtle hero-delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-blue-400/20 rounded-full hero-pulse-soft hero-delay-500"></div>
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-yellow-400/30 rounded-full hero-twinkle hero-delay-700"></div>
      <div className="absolute bottom-1/4 right-1/5 w-2 h-2 bg-purple-400/25 rounded-full hero-drift hero-delay-300"></div>
      
      <div className="relative z-20 w-full px-3 pt-32 xs:pt-36 sm:pt-44 md:pt-52 lg:pt-48 xl:pt-52">
        <div className="text-center mb-8 sm:mb-12 space-y-4 max-w-6xl mx-auto">
          <div className="hero-scale-in">
            {/* العنوان باللون الأبيض دائماً */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-7xl font-bold text-white leading-tight transform transition-all duration-700 hover:scale-105 mt-4 md:mt-10">
              {getTitle()}
            </h1>
          </div>
          <div className="hero-fade-in hero-delay-300">
            {/* الوصف باللون الأبيض دائماً */}
            <p className="text-base xs:text-lg sm:text-2xl text-white max-w-2xl mx-auto leading-relaxed transition-all duration-500 hover:text-white">
              {getSubtitle()}
            </p>
          </div>
          <div className="hero-fade-in hero-delay-500">
            <Button 
              onClick={scrollToProperties}
              className="group bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to hover:brightness-95 text-white px-6 py-2 xs:px-7 xs:py-3 sm:px-8 sm:py-4 rounded-full text-base xs:text-lg sm:text-lg font-semibold shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 mr-1.5 sm:w-5 sm:h-5 sm:mr-2 transition-transform duration-500 group-hover:rotate-12 group-active:rotate-45" />
              {currentLanguage === 'ar' ? 'ابدأ الاستكشاف' : 
               currentLanguage === 'tr' ? 'Keşfetmeye Başla' : 
               'Start Exploring'}
            </Button>
          </div>
        </div>
        
        {/* إحصائيات مُحسنة للجوال - الكروت أصغر وتكديس عمودي عند الشاشات الضيقة */}
        <div
          className={`
            w-full flex flex-col items-center
            mt-8 xs:mt-10 sm:mt-14 md:mt-16
            mb-20 xs:mb-28 sm:mb-36 md:mb-44 lg:mb-52
          `}
        >
          <div
            className="
              flex flex-col gap-3 xs:gap-4 sm:gap-5 md:flex-row md:gap-8 lg:gap-10
              max-w-full md:max-w-5xl w-full mx-auto
            "
          >
            {/* Properties */}
            <div className="
                flex-1 flex flex-col justify-center items-center group
                backdrop-blur-lg bg-white/20 backdrop-blur-md rounded-2xl
                p-2 xs:p-3 sm:p-4 md:p-6
                border border-white/20 transition-all duration-300
                hover:bg-white/15 hover:scale-105 hover:-translate-y-2 hover:shadow-lg
                w-full min-w-0
                max-w-xs
                mx-auto
                sm:w-44 md:w-56 md:max-w-[220px]
              "
              style={{ minWidth: 0 }}
            >
              <Building2 className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white/70 mb-1.5 xs:mb-2 sm:mb-3 md:mb-4" />
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 xs:mb-1.5 md:mb-2">
                {displayNumber(totalProperties, statsLoading)}
              </div>
              <div className="text-white/80 text-xs xs:text-sm sm:text-base md:text-lg font-medium">
                {currentLanguage === 'ar' ? 'عقار متاح' : 
                 currentLanguage === 'tr' ? 'Mevcut Mülk' : 
                 'Properties'}
              </div>
            </div>
            {/* Regions */}
            <div className="
                flex-1 flex flex-col justify-center items-center group
                backdrop-blur-lg bg-white/20 backdrop-blur-md rounded-2xl
                p-2 xs:p-3 sm:p-4 md:p-6
                border border-white/20 transition-all duration-300
                hover:bg-white/15 hover:scale-105 hover:-translate-y-2 hover:shadow-lg
                w-full min-w-0
                max-w-xs
                mx-auto
                sm:w-44 md:w-56 md:max-w-[220px]
              "
              style={{ minWidth: 0 }}
            >
              <MapPin className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white/70 mb-1.5 xs:mb-2 sm:mb-3 md:mb-4" />
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 xs:mb-1.5 md:mb-2">
                {displayNumber(totalCities, statsLoading)}
              </div>
              <div className="text-white/80 text-xs xs:text-sm sm:text-base md:text-lg font-medium">
                {currentLanguage === 'ar' ? 'مناطق' : 
                 currentLanguage === 'tr' ? 'Bölgeler' : 
                 'Regions'}
              </div>
            </div>
            {/* Real Views */}
            <div className="
                flex-1 flex flex-col justify-center items-center group
                backdrop-blur-lg bg-white/20 backdrop-blur-md rounded-2xl
                p-2 xs:p-3 sm:p-4 md:p-6
                border border-white/20 transition-all duration-300
                hover:bg-white/15 hover:scale-105 hover:-translate-y-2 hover:shadow-lg
                w-full min-w-0
                max-w-xs
                mx-auto
                sm:w-44 md:w-56 md:max-w-[220px]
              "
              style={{ minWidth: 0 }}
            >
              <Eye className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white/70 mb-1.5 xs:mb-2 sm:mb-3 md:mb-4" />
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 xs:mb-1.5 md:mb-2">
                {displayNumber(totalViews, statsLoading)}
              </div>
              <div className="text-white/80 text-xs xs:text-sm sm:text-base md:text-lg font-medium">
                {currentLanguage === 'ar' ? 'مشاهدات' : 
                 currentLanguage === 'tr' ? 'Görüntüleme' : 
                 'Views'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
