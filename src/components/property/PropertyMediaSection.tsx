import { useState, useEffect } from "react";
import { Heart, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import PropertyVideo from "@/components/property/PropertyVideo";
import { useLanguage } from "@/contexts/LanguageContext";
import StudentHousingBadge from "./StudentHousingBadge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import MediaLightbox from "./MediaLightbox";
interface PropertyMediaSectionProps {
  property: Property;
  isPropertyFavorited: boolean;
  onFavoriteClick: () => void;
  getPropertyTitle: () => string;
}
const PropertyMediaSection = ({
  property,
  isPropertyFavorited,
  onFavoriteClick,
  getPropertyTitle
}: PropertyMediaSectionProps) => {
  const {
    t,
    currentLanguage
  } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const getMediaArrays = () => {
    if (!property) return {
      images: [],
      videos: []
    };

    // Start with cover image if it exists
    const allMediaUrls = [];
    if (property.cover_image) {
      allMediaUrls.push(property.cover_image);
    }

    // Add other images from the images array
    if (property.images && Array.isArray(property.images)) {
      // Filter out the cover image to avoid duplicates
      const additionalImages = property.images.filter(img => img && img !== property.cover_image);
      allMediaUrls.push(...additionalImages);
    }

    // Filter valid media
    const validMedia = allMediaUrls.filter(media => media);
    const images = validMedia.filter(media => typeof media === 'string' && (media.includes('.jpg') || media.includes('.jpeg') || media.includes('.png') || media.includes('.webp') || !media.includes('.mp4')));
    const videos = validMedia.filter(media => typeof media === 'string' && media.includes('.mp4'));
    return {
      images,
      videos
    };
  };
  const {
    images,
    videos
  } = getMediaArrays();
  const allMedia = [...images, ...videos];
  const currentMedia = allMedia.length > 0 ? allMedia[currentMediaIndex] : null;
  const isCurrentMediaVideo = currentMedia ? videos.includes(currentMedia) : false;
  useEffect(() => {
    if (!api) {
      return;
    }
    const onSelect = () => {
      setCurrentMediaIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    // Initial sync
    setCurrentMediaIndex(api.selectedScrollSnap());
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };
  const openLightbox = (index: number) => {
    setLightboxStartIndex(index);
    setIsLightboxOpen(true);
  };
  return <Card className="overflow-hidden">
      <Carousel setApi={setApi} className="relative" opts={{
      loop: allMedia.length > 1
    }}>
        <CarouselContent>
          {allMedia.map((media, index) => <CarouselItem key={index}>
              <div className="w-full h-96 bg-black flex items-center justify-center cursor-pointer" onClick={() => openLightbox(index)}>
                {videos.includes(media) ? <PropertyVideo videoUrl={media} title={getPropertyTitle()} isActive={index === currentMediaIndex} onClick={() => {}} onOpenLightbox={() => openLightbox(index)} /> : <img src={media || '/placeholder.svg'} alt={getPropertyTitle()} className="w-full h-full object-cover" />}
              </div>
            </CarouselItem>)}
        </CarouselContent>

        {!isCurrentMediaVideo && <>
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              {property.is_featured && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  {t('featured')}
                </Badge>}
            </div>

            {/* شارات عدم وجود وديعة/عمولة وشارة السكن الطلابي */}
            <div className="absolute top-4 right-14 flex flex-col gap-1 z-10 px-[14px]">
              {property.deposit === 0 && <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  {currentLanguage === 'ar' ? 'بدون وديعة' : currentLanguage === 'tr' ? 'Depozitosu Yok' : 'No Deposit'}
                </Badge>}
              {property.commission === 0 && <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  {currentLanguage === 'ar' ? 'بدون عمولة' : currentLanguage === 'tr' ? 'Komisyonsuz' : 'No Commission'}
                </Badge>}
              {property.is_student_housing && <StudentHousingBadge isStudentHousing={property.is_student_housing} gender={property.student_housing_gender} className="text-xs" />}
            </div>

            {/* Favorite & Share */}
            <div className="
                absolute top-4 right-4 flex gap-2 z-10
                bg-white/80 dark:bg-[#232535]/90
                border border-gray-200 dark:border-[#34364b]
                rounded-full shadow-md
                p-0.5
                transition-colors
              ">
              <Button variant="ghost" size="sm" className={`
                  rounded-full
                  bg-transparent
                  hover:bg-gray-100 
                  dark:bg-transparent dark:hover:bg-[#323447]
                  ${isPropertyFavorited ? 'text-brand-accent' : 'text-gray-600 dark:text-gray-300'}
                  transition-colors
                `} onClick={e => {
            e.stopPropagation();
            onFavoriteClick();
          }}>
                <Heart className={`w-5 h-5 ${isPropertyFavorited ? 'fill-current' : ''}`} />
              </Button>
              {/* يمكنك إضافة زر "مشاركة" هنا أيضاً لو أردت أن يظهر بنفس الشكل بجانب زر القلب */}
            </div>
          </>}

        {allMedia.length > 1 && <>
            <CarouselPrevious className="absolute left-2 rtl:right-2 rtl:left-auto top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white/90 backdrop-blur-sm border-none text-gray-800" />
            <CarouselNext className="absolute right-2 rtl:left-2 rtl:right-auto top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white/90 backdrop-blur-sm border-none text-gray-800" />
          </>}
      </Carousel>

      {/* Thumbnail Images and Videos */}
      {allMedia.length > 1 && <div className="p-4 bg-gray-50 dark:bg-[#111726]">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allMedia.map((media, index) => {
          const isVideo = videos.includes(media);
          return isVideo ? <PropertyVideo key={index} videoUrl={media} title={`${getPropertyTitle()} ${index + 1}`} isActive={false} onClick={() => handleThumbnailClick(index)} isSelected={index === currentMediaIndex} /> : <img key={index} src={media} alt={`${getPropertyTitle()} ${index + 1}`} className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${index === currentMediaIndex ? 'border-brand-accent scale-105' : 'border-transparent hover:border-gray-300'}`} onClick={() => handleThumbnailClick(index)} />;
        })}
          </div>
        </div>}

      {isLightboxOpen && <MediaLightbox media={allMedia} videos={videos} startIndex={lightboxStartIndex} onClose={() => setIsLightboxOpen(false)} getPropertyTitle={getPropertyTitle} />}
    </Card>;
};
export default PropertyMediaSection;