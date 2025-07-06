
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Property } from "@/types/property";
import { usePropertyManagement } from "@/hooks/usePropertyManagement";
import SellerPropertyCard from "./SellerPropertyCard";
import { useToast } from "@/hooks/use-toast";

interface SellerPropertiesProps {
  properties: Property[];
  loading: boolean;
  onEditProperty?: (property: Property) => void;
  onRefresh?: () => void;
}

const SellerProperties = ({ properties, loading, onEditProperty, onRefresh }: SellerPropertiesProps) => {
  const { t, currentLanguage } = useLanguage();
  const { handleDeleteProperty } = usePropertyManagement();
  const { toast } = useToast();

  const handleDeletePropertyAction = async (propertyId: string) => {
    // Find the property to get its title for confirmation
    const property = properties.find(p => p.id === propertyId);
    const propertyTitle = property?.title || (currentLanguage === 'ar' ? 'العقار' : 'Property');

    // Show confirmation dialog
    const confirmMessage = currentLanguage === 'ar'
      ? `هل أنت متأكد من حذف "${propertyTitle}"؟`
      : `Are you sure you want to delete "${propertyTitle}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const success = await handleDeleteProperty(propertyId);
      if (success) {
        toast({
          title: currentLanguage === 'ar' ? 'تم الحذف بنجاح' : 'Deleted Successfully',
          description: currentLanguage === 'ar'
            ? `تم حذف العقار "${propertyTitle}" بنجاح`
            : `Property "${propertyTitle}" has been deleted successfully`,
        });

        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast({
          title: currentLanguage === 'ar' ? 'خطأ في الحذف' : 'Delete Error',
          description: currentLanguage === 'ar'
            ? 'فشل في حذف العقار. يرجى المحاولة مرة أخرى'
            : 'Failed to delete property. Please try again',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar'
          ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى'
          : 'An unexpected error occurred. Please try again',
        variant: 'destructive'
      });
    }
  };

  const handleViewProperty = (property: Property) => {
    window.open(`/property/${property.id}`, '_blank');
  };

  if (loading) {
    return (
      <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl">
        <CardContent className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('myProperties') || (currentLanguage === 'ar' ? 'عقاراتي' : 'My Properties')}</CardTitle>
          <CardDescription>
            {t('haventAddedPropertiesYet') || (currentLanguage === 'ar' ? 'لم تقم بإضافة أي عقارات بعد' : 'You haven\'t added any properties yet')}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
          {t('myProperties') || (currentLanguage === 'ar' ? 'عقاراتي' : 'My Properties')}
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          {t('totalPropertiesLabel')
            ? `${t('totalPropertiesLabel')} ${properties.length}`
            : (currentLanguage === 'ar'
                ? `إجمالي العقارات: ${properties.length}`
                : `Total properties: ${properties.length}`)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <SellerPropertyCard
              key={property.id}
              property={property}
              onView={handleViewProperty}
              onEdit={onEditProperty}
              onDelete={handleDeletePropertyAction}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerProperties;
