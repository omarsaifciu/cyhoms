import { ArrowLeft, ArrowRight, Share2, Flag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Property } from "@/types/property";
import { useToast } from "@/hooks/use-toast";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import ReportPropertyDialog from "@/components/reports/ReportPropertyDialog";
import PropertyReportsDialog from "@/components/reports/PropertyReportsDialog";
interface PropertyDetailsHeaderProps {
  onBack: () => void;
  property?: Property;
  getPropertyTitle?: () => string;
}
const PropertyDetailsHeader = ({
  onBack,
  property,
  getPropertyTitle
}: PropertyDetailsHeaderProps) => {
  const {
    currentLanguage
  } = useLanguage();
  const {
    toast
  } = useToast();
  const {
    isAdmin
  } = useAdminStatus();
  const handleShare = async () => {
    if (!property) return;
    const currentUrl = window.location.href;
    const title = getPropertyTitle ? getPropertyTitle() : property.title;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${title} - ${currentLanguage === "ar" ? "شاهد هذا العقار المميز" : "Check out this amazing property"}`,
          url: currentUrl
        });
      } catch (error) {
        console.log("Error sharing:", error);
        fallbackShare(currentUrl, title);
      }
    } else {
      fallbackShare(currentUrl, title);
    }
  };
  const fallbackShare = (url: string, title: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: currentLanguage === "ar" ? "تم النسخ" : "Copied",
        description: currentLanguage === "ar" ? "تم نسخ رابط العقار إلى الحافظة" : "Property link copied to clipboard"
      });
    }).catch(() => {
      alert(`${currentLanguage === "ar" ? "رابط العقار:" : "Property link:"} ${url}`);
    });
  };

  // نص مخصص بناءً على اللغة (يمكن تعديله)
  const shareText = currentLanguage === "ar" ? "مشاركة" : currentLanguage === "tr" ? "Paylaş" : "Share Property";
  const reportText = currentLanguage === "ar" ? "إبلاغ" : currentLanguage === "tr" ? "Bildir" : "Report";
  return <div className="flex items-center gap-2 md:gap-4 mb-6">
      <Button variant="outline" onClick={onBack} className="rounded-full p-2 md:px-4 md:py-2 px-[16px]">
        {currentLanguage === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
      </Button>
      <h1 className="text-lg md:text-2xl font-bold flex-1 text-gray-900 dark:text-white">
        {currentLanguage === "ar" ? "تفاصيل العقار" : "Property Details"}
      </h1>
      
      {/* Report Property Button */}
      {property && <ReportPropertyDialog propertyId={property.id} />}
      
      {/* Admin View Reports Button */}
      {isAdmin && property && <PropertyReportsDialog propertyId={property.id} propertyTitle={getPropertyTitle ? getPropertyTitle() : property.title || ''}>
          <Button variant="outline" className={`
              rounded-xl px-2 lg:px-5 py-2 flex items-center gap-2 
              border border-gray-200 bg-white text-gray-700
              hover:bg-gray-50
              dark:bg-[#232535] dark:border-[#34364b] dark:text-gray-100
              dark:hover:bg-[#151624] dark:hover:text-white
              transition-colors shadow
            `} aria-label={currentLanguage === 'ar' ? 'عرض البلاغات' : 'View Reports'}>
            <Eye className="w-4 h-4" />
            <span className="font-medium select-none hidden lg:inline">
              {currentLanguage === 'ar' ? 'عرض البلاغات' : 'View Reports'}
            </span>
          </Button>
        </PropertyReportsDialog>}
      
      {/* Share Property Button */}
      <Button variant="outline" className={`
          rounded-xl px-2 lg:px-5 py-2 flex items-center gap-2 
          border border-gray-200 bg-white text-gray-700
          hover:bg-gray-50
          dark:bg-[#232535] dark:border-[#34364b] dark:text-gray-100
          dark:hover:bg-[#151624] dark:hover:text-white
          transition-colors shadow
        `} onClick={handleShare} aria-label={shareText}>
        <Share2 className="w-4 h-4" />
        <span className="font-medium select-none hidden lg:inline">{shareText}</span>
      </Button>
    </div>;
};
export default PropertyDetailsHeader;