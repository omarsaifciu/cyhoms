import { useEffect } from 'react';
import { Property } from '@/types/property';

interface PropertyMetaTagsProps {
  property: Property;
  getPropertyTitle: () => string;
  getPropertyDescription: () => string;
}

const PropertyMetaTags = ({ property, getPropertyTitle, getPropertyDescription }: PropertyMetaTagsProps) => {
  useEffect(() => {
    if (!property) return;

    const title = getPropertyTitle();
    const description = getPropertyDescription() || `عقار للإيجار في ${property.city} - ${property.price}€ شهرياً`;

    // تحديث منطق الحصول على رابط صورة الغلاف ليشمل روابط supabase/storage أو غيرها ويجبرها أن تكون كاملة
    let imageUrl = '';
    if (property.cover_image) {
      imageUrl = property.cover_image;
    } else if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      imageUrl = property.images[0];
    }
    // إذا كانت الصورة تبدأ بـ / أو ليست https/http، ضف أصل الموقع
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = window.location.origin + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
    }

    const currentUrl = window.location.href;

    // Update page title
    document.title = `${title} | عقارات قبرص للإيجار`;

    // Helper function to update or create meta tag
    const updateMetaTag = (property: string, content: string, attribute: string = 'property') => {
      // Remove existing meta tag first
      const existingTag = document.querySelector(`meta[${attribute}="${property}"]`);
      if (existingTag) {
        existingTag.remove();
      }
      
      // Only create meta tag if content is not empty
      if (content) {
        const metaTag = document.createElement('meta');
        metaTag.setAttribute(attribute, property);
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', description, 'name');
    updateMetaTag('keywords', `عقار, إيجار, ${property.city}, ${property.property_type}, قبرص`, 'name');

    // Update Open Graph meta tags for Facebook and WhatsApp - ensure proper property names
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    if (imageUrl) {
      updateMetaTag('og:image', imageUrl);
      updateMetaTag('og:image:secure_url', imageUrl);
      updateMetaTag('og:image:width', '1200');
      updateMetaTag('og:image:height', '630');
      updateMetaTag('og:image:alt', title);
      updateMetaTag('og:image:type', 'image/jpeg');
    }
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:site_name', 'عقارات قبرص للإيجار');
    updateMetaTag('og:locale', 'ar_AR');

    // Update Twitter meta tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    if (imageUrl) {
      updateMetaTag('twitter:image', imageUrl, 'name');
    }
    updateMetaTag('twitter:site', '@cyprus_rentals', 'name');

    // Additional meta tags for better sharing
    updateMetaTag('article:author', 'عقارات قبرص للإيجار');
    updateMetaTag('article:publisher', 'عقارات قبرص للإيجار');

    // Force refresh of social media cache by adding a timestamp parameter
    const metaRefreshTag = document.createElement('meta');
    metaRefreshTag.setAttribute('property', 'og:updated_time');
    metaRefreshTag.content = new Date().toISOString();
    document.head.appendChild(metaRefreshTag);

    console.log('Meta tags updated:', {
      title,
      description,
      imageUrl,
      currentUrl
    });

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      const metaTags = [
        'og:title', 'og:description', 'og:image', 'og:image:secure_url', 'og:url', 'og:type', 'og:site_name',
        'og:locale', 'og:image:width', 'og:image:height', 'og:image:alt', 'og:image:type', 'og:updated_time',
        'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:site',
        'article:author', 'article:publisher'
      ];
      
      metaTags.forEach(property => {
        const metaTag = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
        if (metaTag) {
          metaTag.remove();
        }
      });
    };
  }, [property, getPropertyTitle, getPropertyDescription]);

  return null; // This component doesn't render anything
};

export default PropertyMetaTags;
