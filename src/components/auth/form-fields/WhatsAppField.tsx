
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle } from "lucide-react";

interface WhatsAppFieldProps {
  whatsappNumber: string;
  error?: string;
  onWhatsAppChange: (whatsappNumber: string) => void;
}

const WhatsAppField = ({ whatsappNumber, error, onWhatsAppChange }: WhatsAppFieldProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div>
      <Label htmlFor="whatsappNumber">
        {currentLanguage === 'ar' ? 'رقم الواتساب' : 
         currentLanguage === 'tr' ? 'WhatsApp Numarası' : 'WhatsApp Number'} *
      </Label>
      <div className="relative">
        <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
        <Input
          id="whatsappNumber"
          type="tel"
          value={whatsappNumber}
          onChange={(e) => onWhatsAppChange(e.target.value)}
          className={`pl-10 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder={currentLanguage === 'ar' ? 'أدخل رقم الواتساب' : 
                      currentLanguage === 'tr' ? 'WhatsApp numaranızı girin' : 'Enter your WhatsApp number'}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default WhatsAppField;
