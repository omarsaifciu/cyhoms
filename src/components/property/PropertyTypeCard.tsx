
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { getFullPropertyTypeName } from "@/utils/propertyUtils";

interface PropertyTypeCardProps {
  property: Property;
}

const PropertyTypeCard = ({ property }: PropertyTypeCardProps) => {
  const { currentLanguage } = useLanguage();
  const { propertyTypes, loading } = usePropertyTypes();

  const propertyTypeName = getFullPropertyTypeName(property, propertyTypes, currentLanguage, loading);

  return (
    <Card className="bg-white dark:bg-[#111726] shadow-lg rounded-2xl transition-colors">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
          {currentLanguage === 'ar' ? 'نوع العقار' : 
           currentLanguage === 'tr' ? 'Emlak Tipi' : 'Property Type'}
        </h3>
        <Badge variant="outline" className="text-lg px-4 py-2 dark:bg-[#181e28] dark:text-white dark:border-white/20 rounded-full">
          {propertyTypeName}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default PropertyTypeCard;
