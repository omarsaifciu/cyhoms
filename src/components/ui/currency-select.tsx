
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const CurrencySelect = ({ value, onValueChange, placeholder }: CurrencySelectProps) => {
  const { currentLanguage } = useLanguage();

  const currencies = [
    { value: 'EUR', label: 'EUR (€)', name_ar: 'يورو', name_tr: 'Euro' },
    { value: 'GBP', label: 'GBP (£)', name_ar: 'جنيه إسترليني', name_tr: 'İngiliz Sterlini' },
    { value: 'USD', label: 'USD ($)', name_ar: 'دولار أمريكي', name_tr: 'ABD Doları' },
  ];

  const getCurrencyLabel = (currency: any) => {
    if (currentLanguage === 'ar') {
      return `${currency.value} - ${currency.name_ar}`;
    } else if (currentLanguage === 'tr') {
      return `${currency.value} - ${currency.name_tr}`;
    }
    return currency.label;
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || (currentLanguage === 'ar' ? 'اختر العملة' : 'Select Currency')} />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            {getCurrencyLabel(currency)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelect;
