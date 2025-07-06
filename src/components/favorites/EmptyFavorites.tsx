
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const EmptyFavorites = () => {
  const { currentLanguage } = useLanguage();

  const title = currentLanguage === 'ar' ? 'قائمة المفضلة فارغة' : currentLanguage === 'tr' ? 'Favori Listeniz Boş' : 'Your Favorites List is Empty';
  const description = currentLanguage === 'ar' ? 'ابدأ في استكشاف العقارات وإضافتها إلى المفضلة!' : currentLanguage === 'tr' ? 'Mülkleri keşfetmeye başlayın ve favorilerinize ekleyin!' : 'Start exploring properties and add them to your favorites!';
  const buttonText = currentLanguage === 'ar' ? 'تصفح العقارات' : currentLanguage === 'tr' ? 'Mülklere Göz At' : 'Browse Properties';

  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl ring-4 ring-pink-500/10 dark:ring-pink-400/20 relative"
          style={{
            background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
          }}
        >
          <Heart className="w-12 h-12 text-white animate-pulse" />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400/20 to-rose-400/20 animate-ping" />
        </div>

        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 mb-4">
          {title}
        </h2>

        <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
          {description}
        </p>

        <Button
          asChild
          size="lg"
          className="h-14 px-8 rounded-2xl text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:brightness-95"
          style={{
            background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
          }}
        >
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyFavorites;
