
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Property } from "@/types/property";
import PropertyStatusBadge from "./PropertyStatusBadge";
import PropertyInfo from "./PropertyInfo";
import PropertyActions from "./PropertyActions";
import { cn, formatCompactNumber } from "@/lib/utils";
import { Eye, CheckCircle } from "lucide-react";

interface SellerPropertyCardProps {
  property: Property;
  onView: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const SellerPropertyCard = ({ property, onView, onEdit, onDelete }: SellerPropertyCardProps) => {
  const { t, currentLanguage } = useLanguage();
  
  const isSoldOrRented = property.status === 'sold' || property.status === 'rented';
  
  return (
    <Card className={cn(
      "overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl",
      property.is_featured && "shadow-brand-glow",
      isSoldOrRented && "opacity-80 border-2 border-green-500"
    )}>
      {property.cover_image && (
        <div className="relative h-48">
          <img 
            src={property.cover_image} 
            alt={property.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-200",
              isSoldOrRented && "filter grayscale-50"
            )}
          />
          {property.is_featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500">
              {t('featured')}
            </Badge>
          )}
          {isSoldOrRented && (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white flex items-center gap-1">
              <CheckCircle className="w-3 h-3 fill-current" />
              {property.status === 'sold' 
                ? (currentLanguage === 'ar' ? 'مباع' : currentLanguage === 'tr' ? 'Satıldı' : 'Sold')
                : (currentLanguage === 'ar' ? 'مؤجر' : currentLanguage === 'tr' ? 'Kiralandı' : 'Rented')
              }
            </Badge>
          )}
          <PropertyStatusBadge status={property.status} />
        </div>
      )}
      <CardContent className="p-4">
        <PropertyInfo property={property} />
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Eye className="mr-1.5 h-4 w-4" />
          <span>
            {formatCompactNumber(property.views_count ?? 0)}{' '}
            {currentLanguage === 'ar' ? 'مشاهدات' : currentLanguage === 'tr' ? 'Görüntüleme' : 'Views'}
          </span>
        </div>
        <PropertyActions 
          property={property}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
};

export default SellerPropertyCard;
