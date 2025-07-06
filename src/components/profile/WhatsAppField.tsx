
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface WhatsAppFieldProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  error?: string;
  isRequired?: boolean;
}

const WhatsAppField = ({ 
  value, 
  onChange, 
  isEditing, 
  error,
  isRequired = false
}: WhatsAppFieldProps) => {
  const { currentLanguage } = useLanguage();

  const getLabel = () => {
    switch (currentLanguage) {
      case 'ar': return 'رقم الواتساب';
      case 'tr': return 'WhatsApp Numarası';
      default: return 'WhatsApp Number';
    }
  };

  const getPlaceholder = () => {
    switch (currentLanguage) {
      case 'ar': return 'رقم الواتساب';
      case 'tr': return 'WhatsApp numaranız';
      default: return 'WhatsApp number';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700 dark:text-gray-100">
        {getLabel()} {isRequired && <span className="text-red-500">*</span>}
      </Label>
      {isEditing ? (
        <div className="space-y-1">
          <Input
            id="whatsapp"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`transition-all duration-300 focus:ring-2 ${
              error 
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-pink-500'
            } 
            dark:bg-[#23263a] dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-[#23263a]
            `}
            placeholder={getPlaceholder()}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      ) : (
        <div className="p-3 bg-gray-50 dark:bg-[#23263a] dark:text-gray-100 rounded-lg text-gray-900 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#23263a]">
          {value || '-'}
        </div>
      )}
    </div>
  );
};

export default WhatsAppField;

