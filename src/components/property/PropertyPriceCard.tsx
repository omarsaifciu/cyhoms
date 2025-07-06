
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyPriceCardProps {
  property: Property;
  getCurrencySymbol: (currency: string) => string;
}

const PropertyPriceCard = ({ property, getCurrencySymbol }: PropertyPriceCardProps) => {
  const { currentLanguage } = useLanguage();

  // ترجمة المصطلحات حسب اللغة
  const getDepositLabel = () => {
    if (currentLanguage === 'ar') return 'وديعة: ';
    if (currentLanguage === 'tr') return 'Depozito: ';
    return 'Deposit: ';
  };

  const getCommissionLabel = () => {
    if (currentLanguage === 'ar') return 'عمولة: ';
    if (currentLanguage === 'tr') return 'Komisyon: ';
    return 'Commission: ';
  };

  return (
    <Card className="bg-white dark:bg-[#111726] shadow-lg rounded-2xl transition-colors">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-brand-accent dark:text-cyan-300">
            {getCurrencySymbol(property.currency || 'EUR')}{property.price.toLocaleString()}
          </div>
          {property.listing_type === 'rent' && (
            <div className="text-gray-500 dark:text-cyan-200">{currentLanguage === 'ar' ? 'شهرياً' : currentLanguage === 'tr' ? 'aylık' : 'per month'}</div>
          )}
        </div>

        {/* Deposit & Commission */}
        <div className="space-y-2 mb-6">
          {property.deposit === 0 ? (
            <Badge className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-base font-semibold rounded-full py-2 dark:bg-gradient-to-r dark:from-green-400 dark:to-emerald-500">
              {currentLanguage === 'ar' ? 'بدون وديعة' : currentLanguage === 'tr' ? 'Depozitosu Yok' : 'No Deposit'}
            </Badge>
          ) : (
            <div className="text-base text-gray-800 dark:text-white font-medium rounded-full px-3 py-2 bg-gray-100 dark:bg-[#181e28] w-full transition-colors">
              {getDepositLabel()}
              {getCurrencySymbol(property.currency || 'EUR')}{property.deposit?.toLocaleString()}
            </div>
          )}

          {property.commission === 0 ? (
            <Badge className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white text-base font-semibold rounded-full py-2 dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-500">
              {currentLanguage === 'ar' ? 'بدون عمولة' : currentLanguage === 'tr' ? 'Komisyonsuz' : 'No Commission'}
            </Badge>
          ) : (
            <div className="text-base text-gray-800 dark:text-white font-medium rounded-full px-3 py-2 bg-gray-100 dark:bg-[#181e28] w-full transition-colors">
              {getCommissionLabel()}
              {getCurrencySymbol(property.currency || 'EUR')}{property.commission?.toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyPriceCard;
