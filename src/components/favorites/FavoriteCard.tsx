
import { MapPin, Bed, Bath, Square, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import StudentHousingBadge from "@/components/property/StudentHousingBadge";

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
  is_student_housing?: boolean;
  student_housing_gender?: string;
  deposit?: number | null;
  commission?: number | null;
}
interface FavoriteProperty {
  id: string;
  property_id: string;
  created_at: string;
  properties: Property | null;
}

interface FavoriteCardProps {
  favorite: FavoriteProperty & { properties: Property };
  onRemove: (propertyId: string) => void;
  getCityName: (id: string) => string;
  getDistrictName: (id: string) => string;
  getPropertyTitle: (prop: Property) => string;
  getCurrencySymbol: (curr: string | null) => string;
  currentLanguage: 'ar' | 'en' | 'tr';
  animationDelay: string;
}

const FavoriteCard = ({ 
  favorite, 
  onRemove, 
  getCityName, 
  getDistrictName, 
  getPropertyTitle, 
  getCurrencySymbol,
  currentLanguage,
  animationDelay
}: FavoriteCardProps) => {
  const navigate = useNavigate();
  const property = favorite.properties;

  return (
    <Card
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 border border-white/30 dark:border-slate-700/50 shadow-xl hover:shadow-2xl animate-scale-in"
      style={{ animationDelay }}
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.cover_image || "/placeholder.svg"}
          alt={getPropertyTitle(property)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Favorite Heart Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(property.id);
          }}
          className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full h-10 w-10 shadow-lg transition-all duration-300 group/heart"
        >
          <Heart className="w-5 h-5 fill-current group-hover/heart:scale-110 transition-transform duration-200" />
        </Button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.deposit === 0 && (
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
              {currentLanguage === 'ar' ? 'بدون وديعة' : currentLanguage === 'tr' ? 'Depozitosuz' : 'No Deposit'}
            </Badge>
          )}
          {property.commission === 0 && (
            <Badge className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
              {currentLanguage === 'ar' ? 'بدون عمولة' : currentLanguage === 'tr' ? 'Komisyonsuz' : 'No Commission'}
            </Badge>
          )}
          {property.is_student_housing && (
            <StudentHousingBadge
              isStudentHousing={true}
              gender={property.student_housing_gender}
              className="text-xs shadow-lg"
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-brand-accent transition-colors duration-300 line-clamp-2 leading-tight">
            {getPropertyTitle(property)}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-brand-accent/70" />
            <span className="text-sm truncate font-medium">
              {getDistrictName(property.district || '') && `${getDistrictName(property.district || '')}, `}
              {getCityName(property.city)}
            </span>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-brand-accent" />
            <span className="font-medium">{property.bedrooms || 1}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-brand-accent" />
            <span className="font-medium">{property.bathrooms || 1}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4 text-brand-accent" />
            <span className="font-medium">{property.area || 50}م²</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-brand-accent">
              {getCurrencySymbol(property.currency)}{property.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              /{currentLanguage === 'ar' ? 'شهرياً' : 'month'}
            </span>
          </div>

          <Button
            size="sm"
            className="rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-4 py-2"
            style={{
              background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property/${property.id}`);
            }}
          >
            {currentLanguage === 'ar' ? 'عرض' : 'View'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteCard;
