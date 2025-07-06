import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCitiesData } from "@/hooks/useCitiesData";
import { useDistrictsData } from "@/hooks/useDistrictsData";
import StudentHousingBadge from "@/components/property/StudentHousingBadge";
import AdminPropertyActions from "@/components/admin/AdminPropertyActions";
import { PropertyForCard } from "@/types/property";
import { cn, formatCompactNumber } from "@/lib/utils";
import { usePropertyViewsCount } from "@/hooks/usePropertyViewsCount";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useEffect } from "react";
import { testSupabaseConnection, checkUserPermissions } from "@/utils/supabaseTest";

interface PropertyCardProps {
  property: PropertyForCard;
  onUpdate?: () => void;
}

const PropertyCard = ({ property, onUpdate }: PropertyCardProps) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorited } = useFavorites();
  const { t, currentLanguage } = useLanguage();
  const { cities, loading: citiesLoading } = useCitiesData();
  const { districts, loading: districtsLoading } = useDistrictsData();
  const { viewsCount, loading: viewsLoading } = usePropertyViewsCount(property.id);
  const { isAdmin } = useAdminStatus();

  // اختبار الاتصال عند التحميل
  useEffect(() => {
    const runTests = async () => {
      const connectionTest = await testSupabaseConnection();
      const permissionTest = await checkUserPermissions();
      
      console.log('Connection test result:', connectionTest);
      console.log('Permission test result:', permissionTest);
    };
    
    runTests();
  }, []);

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/property/${property.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const isPropertyFavorited = isFavorited(property.id);
  const isHidden = property.status === 'hidden' || property.status === 'pending' || property.hidden_by_admin;

  const getCityNameById = (cityId: string) => {
    console.log('Getting city name for ID:', cityId, 'Available cities:', cities);
    const city = cities.find(c => c.id === cityId);
    if (!city) {
      console.warn('City not found for ID:', cityId);
      return cityId;
    }
    if (currentLanguage === 'ar') return city.name_ar;
    if (currentLanguage === 'tr') return city.name_tr;
    return city.name_en;
  };

  const getDistrictNameById = (districtId: string) => {
    console.log('Getting district name for ID:', districtId, 'Available districts:', districts);
    const district = districts.find(d => d.id === districtId);
    if (!district) {
      console.warn('District not found for ID:', districtId);
      return districtId;
    }
    if (currentLanguage === 'ar') return district.name_ar;
    if (currentLanguage === 'tr') return district.name_tr;
    return district.name_en;
  };

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': return '$';
      default: return '€';
    }
  };

  const getDepositLabel = () => {
    if (currentLanguage === 'ar') return 'وديعة: ';
    if (currentLanguage === 'tr') return 'Depozito: ';
    return 'Deposit: ';
  };

  const getCommissionLabel = () => {
    if (currentLanguage === 'ar') return 'عمولة: ';
    if (currentLanguage === 'tr') return 'Komisyon: ';
    return 'Commission: ';
  };

  const getBedLabel = () => {
    if (currentLanguage === 'ar') return 'غرفة';
    if (currentLanguage === 'tr') return 'yatak odası';
    return 'beds';
  };
  const getBathLabel = () => {
    if (currentLanguage === 'ar') return 'حمام';
    if (currentLanguage === 'tr') return 'banyo';
    return 'baths';
  };
  const getAreaUnit = () => {
    if (currentLanguage === 'ar') return 'م²';
    if (currentLanguage === 'tr') return 'm²';
    return 'm²';
  };

  const listingTypeText = property.listing_type ? (property.listing_type === 'rent' ? t('forRent') : t('forSale')) : '';

  const forSaleText = t('forSale');
  const forRentText = t('forRent');
  let cleanTitle = property.title;

  if (property.listing_type === 'sale') {
    try {
      cleanTitle = cleanTitle.replace(new RegExp(forSaleText, 'ig'), '');
    } catch (e) {
      console.error("Error creating regex from translation", e);
    }
  } else if (property.listing_type === 'rent') {
    try {
      cleanTitle = cleanTitle.replace(new RegExp(forRentText, 'ig'), '');
    } catch (e) {
      console.error("Error creating regex from translation", e);
    }
  }
  
  cleanTitle = cleanTitle.replace(/-\s*$/, '').trim();

  return (
    <Card 
      className={cn(
        `group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border-0
        bg-card text-card-foreground
        dark:bg-[#1a2232] dark:text-[#e4e8ef]
        ${property.featured ? "shadow-brand-glow" : ""}`,
      )}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image || '/placeholder.svg'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/placeholder.svg') {
              target.src = '/placeholder.svg';
            }
          }}
        />

        {/* Admin Actions - Only visible to admins */}
        {isAdmin && onUpdate && (
          <AdminPropertyActions 
            propertyId={property.id}
            isHidden={isHidden}
            onUpdate={onUpdate}
          />
        )}

        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse-soft">
            ⭐ {t('featured')}
          </div>
        )}

        {/* No Deposit/Commission Badges and Student Housing Badge */}
        <div className="absolute top-3 right-14 flex flex-col gap-1 z-10">
          {property.deposit === 0 && (
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow">
              {currentLanguage === 'ar' ? 'بدون وديعة' : 
               currentLanguage === 'tr' ? 'Depozitosu Yok' : 'No Deposit'}
            </Badge>
          )}
          {property.commission === 0 && (
            <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow">
              {currentLanguage === 'ar' ? 'بدون عمولة' : 
               currentLanguage === 'tr' ? 'Komisyonsuz' : 'No Commission'}
            </Badge>
          )}
          {/* Student Housing Badge */}
          <StudentHousingBadge 
            isStudentHousing={property.is_student_housing || false}
            gender={property.student_housing_gender}
            className="text-xs"
          />
        </div>

        {/* Heart Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full transition-all duration-300 ${
            isPropertyFavorited 
              ? 'bg-white text-red-500 shadow-lg scale-110' 
              : 'bg-black/20 text-white hover:bg-white hover:text-red-500 hover:scale-110'
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart className={`w-5 h-5 ${isPropertyFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* Quick View Button */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            size="sm"
            className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white rounded-full font-semibold"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4 mr-1" />
            {currentLanguage === 'ar' ? 'عرض' : 
             currentLanguage === 'tr' ? 'Görüntüle' : 
             'View'}
          </Button>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Location */}
        <div className="flex items-center text-muted-foreground text-sm dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-1 text-brand-accent" />
          <span>
            {citiesLoading || districtsLoading ? (
              <span className="text-gray-400">
                {currentLanguage === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
              </span>
            ) : cities.length === 0 ? (
              <span className="text-red-400">
                {currentLanguage === 'ar' ? 'خطأ في تحميل المدن' : 'Error loading cities'}
              </span>
            ) : (
              <>
                {getCityNameById(property.city)}
                {property.district && (
                  <>
                    <span> - </span>
                    {getDistrictNameById(property.district)}
                  </>
                )}
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-foreground dark:text-white group-hover:text-brand-accent transition-colors duration-300 line-clamp-2">
          {cleanTitle}
          {property.listing_type && (
            <span className="text-gray-600 font-normal dark:text-gray-300">
              {' - '}
              {listingTypeText}
            </span>
          )}
        </h3>
        
        {/* Features */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse text-muted-foreground text-sm dark:text-gray-300">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.beds} {getBedLabel()}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.baths} {getBathLabel()}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.area}{getAreaUnit()}</span>
          </div>
        </div>

        {/* Deposit & Commission Info */}
        {(property.deposit > 0 || property.commission > 0) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {property.deposit > 0 && (
              <div className="text-muted-foreground bg-muted px-2 py-1 rounded dark:bg-[#273143] dark:text-gray-200">
                {getDepositLabel()}
                {getCurrencySymbol(property.deposit_currency || property.currency)}{property.deposit}
              </div>
            )}
            {property.commission > 0 && (
              <div className="text-muted-foreground bg-muted px-2 py-1 rounded dark:bg-[#273143] dark:text-gray-200">
                {getCommissionLabel()}
                {getCurrencySymbol(property.commission_currency || property.currency)}{property.commission}
              </div>
            )}
          </div>
        )}

        {/* Price & Views */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-brand-accent dark:text-cyan-300">
              {getCurrencySymbol(property.currency)}{property.price.toLocaleString()}
              {property.listing_type === 'rent' && (
                <span className="text-sm font-normal text-muted-foreground ml-1 dark:text-gray-400">
                  {t('perMonth')}
                </span>
              )}
            </div>
            {/* عدد المشاهدات - دائماً تظهر تحت السعر */}
            <div className="mt-2 flex items-center text-sm text-muted-foreground dark:text-gray-400">
              <Eye className="mr-1.5 h-4 w-4" />
              <span>
                {viewsLoading
                  ? (currentLanguage === 'ar' ? 'جارٍ التحميل...' : currentLanguage === 'tr' ? 'Yükleniyor...' : 'Loading...')
                  : `${formatCompactNumber(viewsCount ?? 0)} ${currentLanguage === 'ar' ? 'مشاهدات' : currentLanguage === 'tr' ? 'Görüntüleme' : 'Views'}`}
              </span>
            </div>
          </div>
          
          {/* View Details Button: أبيض بالكامل بالدارك مود */}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "self-end rounded-full transition-all duration-300 font-semibold px-6",
              "border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 hover:border-brand-accent/50",
              "dark:bg-transparent dark:text-white dark:border-white/30 dark:hover:bg-white/10 dark:hover:text-white dark:ring-1 dark:ring-white/10"
            )}
            onClick={handleViewDetails}
          >
            {t('viewDetails')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
