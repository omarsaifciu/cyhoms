import { PropertyForCard } from "@/types/property";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { Crown, Sparkles } from "lucide-react";

interface FeaturedPropertiesSectionProps {
  properties: PropertyForCard[];
  loading: boolean;
  onUpdate?: () => void;
}

const FeaturedPropertiesSection = ({ properties, loading, onUpdate }: FeaturedPropertiesSectionProps) => {
  const { currentLanguage } = useLanguage();

  const featuredProperties = properties.filter(property =>
    property.is_featured && property.status === 'available'
  );

  if (loading) {
    return (
      <section className="py-20 px-4 w-full" data-section="featured-properties">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (featuredProperties.length === 0) {
    return (
      <section className="py-20 px-4 w-full" data-section="featured-properties">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Crown className="w-8 h-8 text-yellow-500" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {currentLanguage === 'ar' ? 'العقارات المميزة' :
               currentLanguage === 'tr' ? 'Öne Çıkan Mülkler' :
               'Featured Properties'}
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
            {currentLanguage === 'ar' ? 'لا توجد عقارات مميزة حالياً. سيتم عرض العقارات المميزة هنا عند إضافتها.' :
             currentLanguage === 'tr' ? 'Şu anda öne çıkan mülk yok. Öne çıkan mülkler eklendiğinde burada görüntülenecek.' :
             'No featured properties at the moment. Featured properties will be displayed here when added.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 w-full" data-section="featured-properties">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <Crown className="w-8 h-8 text-yellow-500" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            {currentLanguage === 'ar' ? 'العقارات المميزة' : 
             currentLanguage === 'tr' ? 'Öne Çıkan Mülkler' : 
             'Featured Properties'}
          </h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
          {currentLanguage === 'ar' ? 'اكتشف مجموعتنا المختارة بعناية من أفضل العقارات الفاخرة' : 
           currentLanguage === 'tr' ? 'Özenle seçilmiş lüks mülklerimizi keşfedin' : 
           'Discover our carefully curated collection of premium properties'}
        </p>
      </div>
      
      <div className="relative w-full">
        {/* خلفية ديكورية أغمق في الوضع الداكن */}
        <div className="absolute inset-0 rounded-3xl blur-3xl pointer-events-none
            bg-gradient-to-r from-pink-50/50 via-purple-50/40 to-blue-50/30
            dark:bg-gradient-to-br dark:from-[#222338]/80 dark:via-[#23253a]/80 dark:to-[#21233b]/80 transition-colors duration-500"
        ></div>
        
        {/* الحاوية الأساسية أغمق للوضع الداكن */}
        <div className="relative bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 rounded-3xl p-8 backdrop-blur-sm border border-white/50 shadow-xl w-full
            dark:from-[#191c27]/95 dark:via-[#1b1e2b]/95 dark:to-[#202535]/95 dark:bg-[#191c27]/95 dark:border-[#232433]/60 transition-colors duration-500">

          {featuredProperties.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                {currentLanguage === 'ar' ? 'لا توجد عقارات مميزة في الوقت الحالي. ستظهر العقارات المميزة هنا عند إضافتها.' :
                 currentLanguage === 'tr' ? 'Şu anda öne çıkan mülk yok. Öne çıkan mülkler eklendiğinde burada görüntülenecek.' :
                 'No featured properties at the moment. Featured properties will be displayed here when added.'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-8">
              {featuredProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PropertyCard
                    property={property}
                    onUpdate={onUpdate}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
