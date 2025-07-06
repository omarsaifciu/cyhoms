
import { Property, PropertyForCard, PropertyType } from "@/types/property";

export const transformPropertyForCard = (property: Property, language: 'ar' | 'en' | 'tr' = 'en'): PropertyForCard => {
  let title = property.title;
  
  // Use language-specific title if available
  if (language === 'ar' && property.title_ar) {
    title = property.title_ar;
  } else if (language === 'tr' && property.title_tr) {
    title = property.title_tr;
  } else if (language === 'en' && property.title_en) {
    title = property.title_en;
  }

  // Use cover_image if available, otherwise use first image from images array, then fallback to placeholder
  let image = '/placeholder.svg';
  if (property.cover_image) {
    image = property.cover_image;
  } else if (property.images && Array.isArray(property.images) && property.images.length > 0) {
    image = property.images[0];
  }

  return {
    id: property.id,
    title: title,
    location: `${property.city}${property.district ? `, ${property.district}` : ''}`,
    city: property.city,
    district: property.district || '',
    price: property.price,
    currency: property.currency || 'EUR',
    deposit: property.deposit || 0,
    commission: property.commission || 0,
    beds: property.bedrooms || 0,
    baths: property.bathrooms || 0,
    area: property.area || 0,
    image: image,
    featured: property.is_featured || false,
    is_featured: property.is_featured || false, // Keep both for compatibility
    rating: 4.5, // Mock rating for now
    type: property.property_type,
    listing_type: property.listing_type,
    images: Array.isArray(property.images) ? property.images : [],
    is_student_housing: property.is_student_housing || false,
    student_housing_gender: property.student_housing_gender,
    status: property.status,
    hidden_by_admin: property.hidden_by_admin,
    created_at: property.created_at
  };
};

export const getPropertyTypeNameByLanguage = (propertyType: PropertyType | null, language: string): string => {
  if (!propertyType) return '';
  switch (language) {
    case 'ar':
      return propertyType.name_ar;
    case 'tr':
      return propertyType.name_tr;
    default:
      return propertyType.name_en;
  }
};

export const getFullPropertyTypeName = (
  property: Property | null,
  propertyTypes: PropertyType[],
  currentLanguage: string,
  loadingTypes: boolean
): string => {
  if (!property) {
    return "";
  }
  
  // Priority 1: Use pre-joined property_types data
  if (property.property_types) {
    return getPropertyTypeNameByLanguage(property.property_types, currentLanguage);
  }
  
  // If types are loading, and we don't have pre-joined data, show loading.
  if (loadingTypes) {
    return currentLanguage === 'ar' ? 'جار التحميل...' : currentLanguage === 'tr' ? 'Yükleniyor...' : 'Loading...';
  }

  // Priority 2: Find from the list of all types using property_type_id
  if (property.property_type_id && propertyTypes.length > 0) {
    const type = propertyTypes.find(t => t.id === property.property_type_id);
    if (type) {
      return getPropertyTypeNameByLanguage(type, currentLanguage);
    }
  }

  // Fallback to hardcoded translations (for old data)
  switch ((property.property_type || "").toLowerCase()) {
    case 'apartment':
      return currentLanguage === 'ar' ? 'شقة' : (currentLanguage === 'tr' ? 'Daire' : 'Apartment');
    case 'villa':
      return currentLanguage === 'ar' ? 'فيلا' : (currentLanguage === 'tr' ? 'Villa' : 'Villa');
    case 'studio':
      return currentLanguage === 'ar' ? 'استوديو' : (currentLanguage === 'tr' ? 'Stüdyo' : 'Studio');
    case 'house':
      return currentLanguage === 'ar' ? 'بيت' : (currentLanguage === 'tr' ? 'Ev' : 'House');
    default:
      if (property.property_type) {
        return property.property_type;
      }
      return currentLanguage === 'ar' ? 'غير محدد' : currentLanguage === 'tr' ? 'Belirtilmemiş' : 'Not Specified';
  }
};

export const getPropertyTitle = (property: Property, language: 'ar' | 'en' | 'tr' = 'en'): string => {
  if (language === 'ar' && property.title_ar) {
    return property.title_ar;
  } else if (language === 'tr' && property.title_tr) {
    return property.title_tr;
  } else if (language === 'en' && property.title_en) {
    return property.title_en;
  }
  return property.title;
};

export const getPropertyDescription = (property: Property, language: 'ar' | 'en' | 'tr' = 'en'): string => {
  if (language === 'ar' && property.description_ar) {
    return property.description_ar;
  } else if (language === 'tr' && property.description_tr) {
    return property.description_tr;
  } else if (language === 'en' && property.description_en) {
    return property.description_en;
  }
  return property.description || '';
};

// Get the proper cover image URL for sharing
export const getPropertyCoverImage = (property: Property): string => {
  let imageUrl = '';
  
  // Prioritize cover_image, then first image from array
  if (property.cover_image) {
    imageUrl = property.cover_image;
  } else if (property.images && Array.isArray(property.images) && property.images.length > 0) {
    imageUrl = property.images[0];
  }
  
  // Make sure we have a full URL for the image if it's a relative path
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = window.location.origin + imageUrl;
  }
  
  return imageUrl;
};

// Helper function to refresh social media sharing cache
export const refreshSocialShareCache = (url: string) => {
  // Facebook sharing debugger
  const facebookRefreshUrl = `https://developers.facebook.com/tools/debug/sharing/?q=${encodeURIComponent(url)}`;
  
  // LinkedIn sharing inspector  
  const linkedinRefreshUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  
  console.log('لتحديث معاينة الرابط في المنصات الاجتماعية:');
  console.log('Facebook:', facebookRefreshUrl);
  console.log('LinkedIn:', linkedinRefreshUrl);
  
  return {
    facebook: facebookRefreshUrl,
    linkedin: linkedinRefreshUrl
  };
};
