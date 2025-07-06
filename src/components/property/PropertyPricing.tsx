
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyPricingProps {
  price: number;
  currency: string;
  deposit: number;
  deposit_currency?: string;
  commission: number;
  commission_currency?: string;
  listing_type?: string;
  onViewDetails: (e: React.MouseEvent) => void;
}

const PropertyPricing = ({
  price,
  currency,
  deposit,
  deposit_currency,
  commission,
  commission_currency,
  listing_type,
  onViewDetails
}: PropertyPricingProps) => {
  const { t, currentLanguage } = useLanguage();

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': return '$';
      default: return '€';
    }
  };

  // ترجمة المصلطحات حسب اللغة
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
    <div>
      {/* معلومات الوديعة والعمولة */}
      <div className="flex flex-wrap gap-2 mb-3">
        {deposit === 0 ? (
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow">
            {currentLanguage === 'ar' ? 'بدون وديعة' : 
             currentLanguage === 'tr' ? 'Depozitosu Yok' : 'No Deposit'}
          </Badge>
        ) : (
          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {getDepositLabel()}
            {getCurrencySymbol(deposit_currency || currency)}{deposit.toLocaleString()}
          </div>
        )}

        {commission === 0 ? (
          <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow">
            {currentLanguage === 'ar' ? 'بدون عمولة' : 
             currentLanguage === 'tr' ? 'Komisyonsuz' : 'No Commission'}
          </Badge>
        ) : (
          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {getCommissionLabel()}
            {getCurrencySymbol(commission_currency || currency)}{commission.toLocaleString()}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-pink-600">
            {getCurrencySymbol(currency)}{price.toLocaleString()}
          </span>
          {listing_type === 'rent' && (
            <span className="text-gray-500 text-sm ml-1">{t('perMonth')}</span>
          )}
        </div>
        <Button 
          size="sm" 
          className="bg-pink-500 hover:bg-pink-600 rounded-full px-6 font-semibold shadow"
          onClick={onViewDetails}
        >
          {t('viewDetails')}
        </Button>
      </div>
    </div>
  );
};

export default PropertyPricing;
