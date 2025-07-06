
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import PropertyCard from "@/components/PropertyCard";
import { PropertyForCard } from "@/types/property";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Home, MapPin } from "lucide-react";

const StudentHousing = () => {
  const { t, currentLanguage } = useLanguage();
  const { cities, districts } = useCitiesAndDistricts();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['student-housing-properties', selectedCity, selectedGender],
    queryFn: async () => {
      console.log('Fetching student housing properties with filters:', { selectedCity, selectedGender });
      
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_student_housing', true)
        .eq('status', 'available');

      if (selectedCity !== 'all') {
        query = query.eq('city', selectedCity);
      }

      if (selectedGender !== 'all') {
        query = query.eq('student_housing_gender', selectedGender);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching student housing properties:', error);
        throw error;
      }

      console.log('Student housing properties fetched:', data);
      return data || [];
    },
  });

  const getCityNameById = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return cityId;
    if (currentLanguage === 'ar') return city.name_ar;
    if (currentLanguage === 'tr') return city.name_tr;
    return city.name_en;
  };

  const getDistrictNameById = (districtId: string) => {
    const district = districts.find(d => d.id === districtId);
    if (!district) return districtId;
    if (currentLanguage === 'ar') return district.name_ar;
    if (currentLanguage === 'tr') return district.name_tr;
    return district.name_en;
  };

  const getGenderDisplayName = (gender: string) => {
    switch (gender) {
      case 'male':
        return currentLanguage === 'ar' ? 'ذكور' : currentLanguage === 'tr' ? 'Erkek' : 'Male';
      case 'female':
        return currentLanguage === 'ar' ? 'إناث' : currentLanguage === 'tr' ? 'Kadın' : 'Female';
      case 'mixed':
        return currentLanguage === 'ar' ? 'مختلط' : currentLanguage === 'tr' ? 'Karışık' : 'Mixed';
      default:
        return currentLanguage === 'ar' ? 'غير محدد' : currentLanguage === 'tr' ? 'Belirtilmemiş' : 'Unspecified';
    }
  };

  // Convert properties to PropertyForCard format
  const propertyCards: PropertyForCard[] = properties.map(property => ({
    id: property.id,
    title: property.title || '',
    location: `${getCityNameById(property.city || '')}${property.district ? `, ${getDistrictNameById(property.district)}` : ''}`,
    city: property.city || '',
    district: property.district || '',
    price: property.price || 0,
    currency: property.currency || 'EUR',
    deposit: property.deposit || 0,
    deposit_currency: property.deposit_currency || property.currency || 'EUR',
    commission: property.commission || 0,
    commission_currency: property.commission_currency || property.currency || 'EUR',
    beds: property.bedrooms || 0,
    baths: property.bathrooms || 0,
    area: property.area || 0,
    image: property.cover_image || '/placeholder.svg',
    images: Array.isArray(property.images) ? property.images.map(img => String(img)) : [],
    featured: property.is_featured || false,
    rating: 4.5,
    type: property.property_type || '',
    listing_type: property.listing_type || 'rent'
  }));

  if (error) {
    console.error('Error in StudentHousing component:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Users className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {currentLanguage === 'ar' ? 'سكن الطلاب' : 
             currentLanguage === 'tr' ? 'Öğrenci Konutları' : 
             'Student Housing'}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            {currentLanguage === 'ar' ? 'اعثر على السكن المثالي لفترة دراستك' : 
             currentLanguage === 'tr' ? 'Eğitim döneminiz için mükemmel konutu bulun' : 
             'Find the perfect accommodation for your studies'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {currentLanguage === 'ar' ? 'تصفية النتائج' : 
               currentLanguage === 'tr' ? 'Sonuçları Filtrele' : 
               'Filter Results'}
            </CardTitle>
            <CardDescription>
              {currentLanguage === 'ar' ? 'اختر المدينة ونوع السكن المناسب' : 
               currentLanguage === 'tr' ? 'Şehir ve konut türünü seçin' : 
               'Choose city and housing type'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {currentLanguage === 'ar' ? 'المدينة' : 
                   currentLanguage === 'tr' ? 'Şehir' : 
                   'City'}
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر المدينة' : 
                                             currentLanguage === 'tr' ? 'Şehir Seçin' : 
                                             'Select City'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {currentLanguage === 'ar' ? 'جميع المدن' : 
                       currentLanguage === 'tr' ? 'Tüm Şehirler' : 
                       'All Cities'}
                    </SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {currentLanguage === 'ar' ? city.name_ar : 
                         currentLanguage === 'tr' ? city.name_tr : 
                         city.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {currentLanguage === 'ar' ? 'نوع السكن' : 
                   currentLanguage === 'tr' ? 'Konut Türü' : 
                   'Housing Type'}
                </label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger>
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر النوع' : 
                                             currentLanguage === 'tr' ? 'Tür Seçin' : 
                                             'Select Type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {currentLanguage === 'ar' ? 'جميع الأنواع' : 
                       currentLanguage === 'tr' ? 'Tüm Türler' : 
                       'All Types'}
                    </SelectItem>
                    <SelectItem value="male">
                      {getGenderDisplayName('male')}
                    </SelectItem>
                    <SelectItem value="female">
                      {getGenderDisplayName('female')}
                    </SelectItem>
                    <SelectItem value="mixed">
                      {getGenderDisplayName('mixed')}
                    </SelectItem>
                    <SelectItem value="unspecified">
                      {getGenderDisplayName('unspecified')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Home className="w-6 h-6" />
              {currentLanguage === 'ar' ? 'السكنات المتاحة' : 
               currentLanguage === 'tr' ? 'Mevcut Konutlar' : 
               'Available Housing'}
            </h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {propertyCards.length} {currentLanguage === 'ar' ? 'سكن' : 
                                     currentLanguage === 'tr' ? 'konut' : 
                                     'properties'}
            </Badge>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : propertyCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Home className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {currentLanguage === 'ar' ? 'لا توجد سكنات متاحة' : 
               currentLanguage === 'tr' ? 'Mevcut konut yok' : 
               'No housing available'}
            </h3>
            <p className="text-gray-500">
              {currentLanguage === 'ar' ? 'جرب تغيير معايير البحث' : 
               currentLanguage === 'tr' ? 'Arama kriterlerinizi değiştirmeyi deneyin' : 
               'Try adjusting your search criteria'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyCards.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHousing;
