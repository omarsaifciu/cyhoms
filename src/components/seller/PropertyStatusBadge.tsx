
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyStatusBadgeProps {
  status?: string | null;
}

const PropertyStatusBadge = ({ status }: PropertyStatusBadgeProps) => {
  const { currentLanguage } = useLanguage();

  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          text: currentLanguage === 'ar' ? 'متاح' : currentLanguage === 'tr' ? 'Müsait' : 'Available',
          className: 'bg-green-500 hover:bg-green-600'
        };
      case 'pending':
        return {
          text: currentLanguage === 'ar' ? 'مخفي' : currentLanguage === 'tr' ? 'Gizli' : 'Hidden',
          className: 'bg-yellow-500 hover:bg-yellow-600'
        };
      case 'sold':
        return {
          text: currentLanguage === 'ar' ? 'مباع' : currentLanguage === 'tr' ? 'Satıldı' : 'Sold',
          className: 'bg-red-500 hover:bg-red-600'
        };
      case 'rented':
        return {
          text: currentLanguage === 'ar' ? 'مؤجر' : currentLanguage === 'tr' ? 'Kiralandı' : 'Rented',
          className: 'bg-blue-500 hover:bg-blue-600'
        };
      default:
        return {
          text: status,
          className: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  };

  const { text, className } = getStatusConfig();

  return (
    <Badge className={`absolute top-2 right-2 text-white ${className}`}>
      {text}
    </Badge>
  );
};

export default PropertyStatusBadge;
