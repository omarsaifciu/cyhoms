
import { Crown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import StudentHousingBadge from "./StudentHousingBadge";

interface PropertyImageProps {
  image: string;
  title: string;
  featured: boolean;
  images?: string[];
  deposit: number;
  commission: number;
  isPropertyFavorited: boolean;
  onCardClick: () => void;
  onFavoriteClick: (e: React.MouseEvent) => void;
  isStudentHousing?: boolean;
  studentHousingGender?: string;
}

const PropertyImage = ({
  image,
  title,
  featured,
  images,
  deposit,
  commission,
  isPropertyFavorited,
  onCardClick,
  onFavoriteClick,
  isStudentHousing,
  studentHousingGender
}: PropertyImageProps) => {
  const { t, currentLanguage } = useLanguage();

  return (
    <div className="relative" onClick={onCardClick}>
      <img
        src={image}
        alt={title}
        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300 rounded-3xl"
      />
      
      {/* شارات */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {featured && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full shadow flex items-center gap-1">
            <Crown className="w-3 h-3" />
            {t('featured')}
          </Badge>
        )}
        {images && images.length > 1 && (
          <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
            +{images.length - 1}
          </Badge>
        )}
      </div>

      {/* شارات عدم وجود وديعة/عمولة وشارة السكن الطلابي */}
      <div className="absolute top-4 right-14 flex flex-col gap-1 z-10">
        {deposit === 0 && (
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow">
            {currentLanguage === 'ar' ? 'بدون وديعة' : 
             currentLanguage === 'tr' ? 'Depozitosu Yok' : 'No Deposit'}
          </Badge>
        )}
        {commission === 0 && (
          <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow">
            {currentLanguage === 'ar' ? 'بدون عمولة' : 
             currentLanguage === 'tr' ? 'Komisyonsuz' : 'No Commission'}
          </Badge>
        )}
        {/* شارة السكن الطلابي */}
        {isStudentHousing && (
          <StudentHousingBadge 
            isStudentHousing={isStudentHousing}
            gender={studentHousingGender}
            className="text-xs"
          />
        )}
      </div>

      {/* زر المفضلة */}
      <Button
        variant="ghost"
        size="sm"
        className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow ${
          isPropertyFavorited ? 'text-brand-accent' : 'text-gray-600'
        }`}
        onClick={onFavoriteClick}
      >
        <Heart className={`w-5 h-5 ${isPropertyFavorited ? 'fill-current' : ''}`} />
      </Button>

    </div>
  );
};

export default PropertyImage;
