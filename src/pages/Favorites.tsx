
import { Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import { useUserProfile } from "@/hooks/useUserProfile";
import FavoritesHeader from "@/components/favorites/FavoritesHeader";
import FavoritesLoading from "@/components/favorites/FavoritesLoading";
import FavoritesAuthWall from "@/components/favorites/FavoritesAuthWall";
import EmptyFavorites from "@/components/favorites/EmptyFavorites";
import FavoriteCard from "@/components/favorites/FavoriteCard";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  title: string;
  title_ar: string | null;
  title_en: string | null;
  title_tr: string | null;
  price: number;
  currency: string | null;
  city: string;
  district: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  cover_image: string | null;
  deposit: number | null;
  commission: number | null;
  is_student_housing?: boolean;
  student_housing_gender?: string;
}

interface FavoriteProperty {
  id: string;
  property_id: string;
  created_at: string;
  properties: Property | null; 
}

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const { cities, districts } = useCitiesAndDistricts();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else if (!authLoading) {
      setLoadingFavorites(false);
    }
  }, [user, authLoading]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoadingFavorites(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id, property_id, created_at,
          properties (
            id, title, title_ar, title_en, title_tr, price,
            currency, city, district, bedrooms, bathrooms,
            area, cover_image, deposit, commission, 
            is_student_housing, student_housing_gender
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const validFavorites = data?.filter(fav => fav.properties) || [];
      setFavorites(validFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحميل المفضلة' : 'Failed to load favorites',
        variant: 'destructive'
      });
    } finally {
      setLoadingFavorites(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) return;
    const originalFavorites = [...favorites];
    setFavorites(favorites.filter(fav => fav.property_id !== propertyId));

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId);

    if (error) {
      setFavorites(originalFavorites);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في إزالة العقار من المفضلة' : 'Failed to remove property from favorites',
        variant: 'destructive'
      });
    } else {
      toast({
        title: currentLanguage === 'ar' ? 'تم بنجاح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم إزالة العقار من المفضلة' : 'Property removed from favorites',
      });
    }
  };

  const clearAllFavorites = async () => {
    if (!user || favorites.length === 0) return;

    try {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id);
      if (error) throw error;
      setFavorites([]);
      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم حذف جميع المفضلة' : 'All favorites have been cleared',
      });
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في حذف جميع المفضلة' : 'Failed to clear all favorites',
        variant: 'destructive'
      });
    }
  };
  
  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return cityId;
    return currentLanguage === 'ar' ? city.name_ar : currentLanguage === 'tr' ? city.name_tr : city.name_en;
  };

  const getDistrictName = (districtId: string) => {
    if (!districtId) return '';
    const district = districts.find(d => d.id === districtId);
    if (!district) return districtId;
    return currentLanguage === 'ar' ? district.name_ar : currentLanguage === 'tr' ? district.name_tr : district.name_en;
  };

  const getPropertyTitle = (property: Property) => {
    if (currentLanguage === 'ar' && property.title_ar) return property.title_ar;
    if (currentLanguage === 'tr' && property.title_tr) return property.title_tr;
    return property.title_en || property.title;
  };

  const getCurrencySymbol = (currency: string | null) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': return '$';
      default: return 'TRY';
    }
  };

  if (authLoading || loadingFavorites) {
    return <FavoritesLoading />;
  }

  if (!user) {
    return <FavoritesAuthWall />;
  }

  return (
    <div
      className="min-h-screen flex flex-col p-4 py-24 relative overflow-hidden transition-all duration-500"
      style={{
        background: `
          linear-gradient(135deg,
            color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent),
            color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 2%, transparent)
          ),
          linear-gradient(to bottom right,
            #fafbff 0%,
            #f1f5f9 50%,
            #e2e8f0 100%
          )
        `,
        // Dark mode background
        ...(typeof window !== 'undefined' && document.documentElement.classList.contains('dark') && {
          background: `
            linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent),
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent)
            ),
            linear-gradient(to bottom right,
              #0f172a 0%,
              #1e293b 50%,
              #334155 100%
            )
          `
        })
      }}
    >
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient overlays */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent) 0%,
              transparent 50%,
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent) 100%
            )`
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-10 dark:opacity-15"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent),
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 6%, transparent)
            )`
          }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 opacity-8 dark:opacity-12"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 6%, transparent),
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 5%, transparent)
            )`
          }}
        />

        {/* Subtle floating particles */}
        <div
          className="absolute top-32 right-1/4 w-3 h-3 rounded-full animate-bounce opacity-20 dark:opacity-30"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 25%, transparent)' }}
        />
        <div
          className="absolute bottom-40 left-1/3 w-2 h-2 rounded-full animate-bounce delay-300 opacity-15 dark:opacity-25"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 20%, transparent)' }}
        />
        <div
          className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full animate-ping delay-700 opacity-25 dark:opacity-35"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 30%, transparent)' }}
        />

        {/* Additional atmospheric elements */}
        <div
          className="absolute top-10 right-10 w-32 h-32 rounded-full blur-2xl animate-pulse delay-200 opacity-5 dark:opacity-8"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 5%, transparent),
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent)
            )`
          }}
        />
        <div
          className="absolute bottom-32 left-10 w-40 h-40 rounded-full blur-3xl animate-pulse delay-800 opacity-4 dark:opacity-6"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent),
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent)
            )`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        {/* Header with back button */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 pt-4 sm:pt-6 md:pt-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full p-2 md:p-3 shrink-0 px-[16px] py-[8px]">
            {currentLanguage === 'ar' ? (
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex-1 text-gray-900 dark:text-white truncate">
            {currentLanguage === 'ar' ? 'المفضلة' : currentLanguage === 'tr' ? 'Favoriler' : 'My Favorites'}
          </h1>
        </div>
        <FavoritesHeader user={user} profile={profile} />

        {favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '300ms' }}>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                {currentLanguage === 'ar' ? `لديك ${favorites.length} عقارات في المفضلة` : `You have ${favorites.length} properties in your favorites`}
              </p>
              <Button
                variant="outline"
                onClick={clearAllFavorites}
                className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {currentLanguage === 'ar' ? 'حذف الكل' : 'Clear All'}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite, index) => (
                 favorite.properties && (
                  <FavoriteCard
                    key={favorite.id}
                    favorite={favorite as FavoriteProperty & { properties: Property }}
                    onRemove={removeFavorite}
                    getCityName={getCityName}
                    getDistrictName={getDistrictName}
                    getPropertyTitle={getPropertyTitle}
                    getCurrencySymbol={getCurrencySymbol}
                    currentLanguage={currentLanguage}
                    animationDelay={`${400 + index * 100}ms`}
                  />
                 )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
