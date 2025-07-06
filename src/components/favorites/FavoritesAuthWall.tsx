
import { Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FavoritesAuthWall = () => {
  const { currentLanguage } = useLanguage();

  const title = currentLanguage === 'ar' ? 'يجب تسجيل الدخول لعرض المفضلة' : currentLanguage === 'tr' ? 'Favorileri Görüntülemek İçin Giriş Yapmalısınız' : 'Login to View Favorites';
  const description = currentLanguage === 'ar' ? 'سجل دخولك لترى العقارات التي أضفتها إلى قائمة المفضلة' : currentLanguage === 'tr' ? 'Favori listenize eklediğiniz mülkleri görmek için giriş yapın' : 'Sign in to see the properties you have added to your favorites list.';
  const buttonText = currentLanguage === 'ar' ? 'تسجيل الدخول' : currentLanguage === 'tr' ? 'Giriş Yap' : 'Sign In';

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#222636] pt-20">
      <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
        <div className="text-center py-16 animate-fade-in">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {description}
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to text-white font-semibold rounded-full hover:scale-105 transition-transform">
            <Link to="/login">
              <LogIn className="w-5 h-5 mr-2" />
              {buttonText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesAuthWall;
