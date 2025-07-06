
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import OwnerRatingForm from './OwnerRatingForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface OwnerRatingDialogProps {
  ownerId: string;
  ownerName: string;
  children: React.ReactNode; // This will be the trigger element
  onOpenChange?: (open: boolean) => void;
}

const OwnerRatingDialog: React.FC<OwnerRatingDialogProps> = ({ ownerId, ownerName, children, onOpenChange }) => {
  const { currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };
  
  const translations = {
    ar: {
      rateTitle: `تقييم ${ownerName}`,
      rateDescription: `شاركنا تجربتك مع ${ownerName} لمساعدة الآخرين.`,
    },
    en: {
      rateTitle: `Rate ${ownerName}`,
      rateDescription: `Share your experience with ${ownerName} to help others.`,
    },
    tr: {
      rateTitle: `${ownerName} Değerlendir`,
      rateDescription: `Başkalarına yardımcı olmak için ${ownerName} ile olan deneyiminizi paylaşın.`,
    },
  };

  const t = translations[currentLanguage];

  // استخدام ألوان العلامة التجارية من متغيرات CSS الخاصة بالموقع للـ gradient
  // هذا يضمن التوافق مع لوحة تحكم الألوان وصندوق العلامة التجارية.
  const brandGradientStyle = {
    background: `linear-gradient(
      135deg, 
      var(--brand-gradient-from-color, #2ec7fa), 
      var(--brand-gradient-to-color, #007cf0)
    )`
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        showCloseButton={false}
        className="p-0 overflow-hidden rounded-2xl max-w-full w-[360px] !border-0 shadow-4xl"
        style={{ background: 'none' }}
      >
        <div className="relative">
          {/* Header Brand Gradient */}
          <div
            className="px-8 pb-6 pt-7 rounded-t-2xl text-center flex flex-col items-center relative"
            style={brandGradientStyle}
          >
            {/* زر إغلاق */}
            <DialogClose asChild>
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogClose>
            {/* العنوان والوصف */}
            <DialogTitle className="text-2xl font-extrabold text-white text-center p-0 m-0 drop-shadow-md" style={{ fontFamily: "inherit" }}>
              {t.rateTitle}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-center mt-2 text-base leading-snug font-medium drop-shadow-sm" style={{ fontFamily: "inherit" }}>
              {t.rateDescription}
            </DialogDescription>
          </div>
          {/* OwnerRatingForm */}
          <div className="p-7 bg-white dark:bg-[#222636] rounded-b-2xl shadow-2xl -mt-1">
            <OwnerRatingForm 
              ownerId={ownerId} 
              ownerName={ownerName} 
              onClose={() => handleOpenChange(false)} 
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerRatingDialog;
