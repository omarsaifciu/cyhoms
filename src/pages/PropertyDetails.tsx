
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import { useFavorites } from "@/hooks/useFavorites";
import { usePropertyViews } from "@/hooks/usePropertyViews";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/property";
import { getCityNameByLanguage, getDistrictNameByLanguage } from "@/utils/cityUtils";
import PropertyDetailsHeader from "@/components/property/PropertyDetailsHeader";
import PropertyMediaSection from "@/components/property/PropertyMediaSection";
import PropertyInfoSection from "@/components/property/PropertyInfoSection";
import PropertySidebar from "@/components/property/PropertySidebar";
import PropertyMetaTags from "@/components/property/PropertyMetaTags";
import SuggestedProperties from "@/components/property/SuggestedProperties";
import ModernCommentSystem from "@/components/property/ModernCommentSystem";
import { Home, Bed, Bath, Square } from 'lucide-react';
import React from 'react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLanguage, t } = useLanguage();
  const { cities, districts, loading: locationsLoading } = useCitiesAndDistricts();
  const { toggleFavorite, isFavorited } = useFavorites();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // تسجيل مشاهدة العقار
  usePropertyViews(id || '');

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_types(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Type cast to handle Json vs string[] mismatch
      const typedProperty = {
        ...data,
        images: Array.isArray(data.images) ? data.images : 
                typeof data.images === 'string' ? [data.images] : []
      } as Property;
      
      setProperty(typedProperty);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'USD':
        return '$';
      default:
        return '€';
    }
  };

  const getCityName = (cityId: string) => {
    if (locationsLoading) return cityId;
    const city = cities.find(c => c.id === cityId);
    return city ? getCityNameByLanguage(city, currentLanguage) : cityId;
  };

  const getDistrictName = (districtId: string) => {
    if (locationsLoading) return districtId;
    const district = districts.find(d => d.id === districtId);
    return district ? getDistrictNameByLanguage(district, currentLanguage) : districtId;
  };

  const getPropertyTitle = () => {
    if (!property) return '';
    let title;
    if (currentLanguage === 'ar' && property.title_ar) {
      title = property.title_ar;
    } else if (currentLanguage === 'tr' && property.title_tr) {
      title = property.title_tr;
    } else {
      title = property.title_en || property.title;
    }
    const forSaleText = t('forSale');
    const forRentText = t('forRent');
    let cleanTitle = title;
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
    if (property.listing_type) {
      const listingTypeText = property.listing_type === 'rent' ? t('forRent') : t('forSale');
      return cleanTitle ? `${cleanTitle} - ${listingTypeText}` : listingTypeText;
    }
    return cleanTitle;
  };

  const getPropertyDescription = () => {
    if (!property) return '';
    if (currentLanguage === 'ar' && property.description_ar) return property.description_ar;
    if (currentLanguage === 'tr' && property.description_tr) return property.description_tr;
    return property.description_en || property.description;
  };

  const handleFavoriteClick = () => {
    if (property) {
      toggleFavorite(property.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-brand-accent/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-accent/10 to-brand-accent/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-brand-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 7v13h18V7z" />
              <path d="M16 3h-8l-2 4h12z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLanguage === 'ar' ? 'العقار غير موجود' : 'Property not found'}
          </h2>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-brand-accent to-brand-accent/80 hover:from-brand-accent/90 hover:to-brand-accent text-white shadow-lg hover:shadow-brand-glow transition-all duration-300"
          >
            {currentLanguage === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </div>
      </div>
    );
  }

  const isPropertyFavorited = isFavorited(property.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 pt-8 lg:pt-10" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background decoration elements with house icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-brand-accent/20 animate-float">
          <Home className="w-8 h-8" />
        </div>
        <div className="absolute top-1/4 right-20 text-brand-accent/15 animate-bounce-subtle animation-delay-500">
          <Home className="w-6 h-6" />
        </div>
        <div className="absolute top-1/3 left-1/4 text-brand-accent/10 animate-pulse-soft animation-delay-300">
          <Home className="w-10 h-10" />
        </div>
        <div className="absolute bottom-32 right-1/3 text-brand-accent/20 animate-float animation-delay-700">
          <Home className="w-7 h-7" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-brand-accent/15 animate-bounce-subtle animation-delay-1000">
          <Home className="w-9 h-9" />
        </div>
        <div className="absolute top-2/3 right-10 text-brand-accent/10 animate-pulse-soft animation-delay-800">
          <Home className="w-5 h-5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 bg-transparent py-[13px] rounded-2xl relative z-10 animate-fade-in">
        <PropertyMetaTags 
          property={property} 
          getPropertyTitle={getPropertyTitle} 
          getPropertyDescription={getPropertyDescription} 
        />
        
        <div className="animate-scale-in">
          <PropertyDetailsHeader 
            onBack={() => navigate(-1)} 
            property={property} 
            getPropertyTitle={getPropertyTitle} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-slide-up animation-delay-200">
          <div className="lg:col-span-2">
            <div className="animate-fade-in animation-delay-300">
              <PropertyMediaSection 
                property={property} 
                isPropertyFavorited={isPropertyFavorited} 
                onFavoriteClick={handleFavoriteClick} 
                getPropertyTitle={getPropertyTitle} 
              />
            </div>

            <div className="mt-6 animate-fade-in animation-delay-500">
              <div className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl border-0">
                <h2 className="text-2xl font-bold text-brand-accent dark:text-white mb-4" style={{ lineHeight: "1.25" }}>
                  {getPropertyTitle()}
                </h2>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                  <span className="mr-2">
                    <svg className="inline-block w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M12 2C8 2 5 5.33 5 9v1a7 7 0 0 0 2 5.2C10 19 12 22 12 22s2-3 5-6.8A7 7 0 0 0 19 10V9c0-3.67-3-7-7-7Z" />
                    </svg>
                  </span>
                  <span>{getCityName(property.city)}</span>
                  {property.district && (
                    <>
                      <span> - </span>
                      <span>{getDistrictName(property.district)}</span>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-600 dark:text-gray-300 mb-6">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 h-12 min-w-0">
                      <Bed className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{property.bedrooms} {currentLanguage === 'ar' ? 'غرفة' : currentLanguage === 'tr' ? 'yatak odası' : 'beds'}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl px-3 py-2 h-12 min-w-0">
                      <Bath className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{property.bathrooms} {currentLanguage === 'ar' ? 'حمام' : currentLanguage === 'tr' ? 'banyo' : 'baths'}</span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2 h-12 min-w-0">
                      <Square className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{property.area}{currentLanguage === 'ar' ? 'م²' : 'm²'}</span>
                    </div>
                  )}
                </div>
                {getPropertyDescription() && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      {currentLanguage === 'ar' ? 'الوصف' : currentLanguage === 'tr' ? "Açıklama" : 'Description'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-100 leading-relaxed">
                      {getPropertyDescription()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 hidden lg:block animate-fade-in animation-delay-700">
              {property?.id && (
                <React.Suspense fallback={<div>...تحميل التعليقات</div>}>
                  <ModernCommentSystem propertyId={property.id} propertyOwnerId={property.created_by} />
                </React.Suspense>
              )}
            </div>
          </div>

          <div className="animate-fade-in animation-delay-400">
            <PropertySidebar 
              property={property} 
              getCurrencySymbol={getCurrencySymbol} 
            />
          </div>
        </div>

        <div className="block lg:hidden mt-10 mb-12 animate-fade-in animation-delay-700">
          {property?.id && (
            <React.Suspense fallback={<div>...تحميل التعليقات</div>}>
              <ModernCommentSystem propertyId={property.id} propertyOwnerId={property.created_by} />
            </React.Suspense>
          )}
        </div>
        
        <div className="animate-slide-up animation-delay-1000">
          <SuggestedProperties currentProperty={property} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
