
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  termsContent: string;
  termsTitle?: string;
}

const TermsDialog = ({ open, onOpenChange, termsContent, termsTitle }: TermsDialogProps) => {
  const { currentLanguage } = useLanguage();

  const getDefaultTitle = () => {
    return currentLanguage === 'ar' ? 'سياسة الخصوصية والأحكام والشروط' : 
           currentLanguage === 'tr' ? 'Gizlilik Politikası ve Şartlar' : 
           'Privacy Policy & Terms and Conditions';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {termsTitle || getDefaultTitle()}
          </DialogTitle>
          <DialogDescription>
            {currentLanguage === 'ar' ? 'يرجى قراءة سياسة الخصوصية والأحكام والشروط بعناية' : 
             currentLanguage === 'tr' ? 'Lütfen gizlilik politikasını ve şartları dikkatle okuyun' : 
             'Please read the privacy policy and terms and conditions carefully'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] w-full">
          <div className="p-4 whitespace-pre-wrap">
            {termsContent || (
              currentLanguage === 'ar' ? 'لا توجد سياسة خصوصية أو أحكام وشروط متاحة حالياً' : 
              currentLanguage === 'tr' ? 'Şu anda kullanılabilir gizlilik politikası veya şartlar yok' : 
              'No privacy policy or terms and conditions are currently available'
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
