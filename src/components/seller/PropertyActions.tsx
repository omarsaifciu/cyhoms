
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Edit, CheckCircle, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Property } from "@/types/property";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface PropertyActionsProps {
  property: Property;
  onView: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const PropertyActions = ({ property, onView, onEdit, onDelete }: PropertyActionsProps) => {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleSoldRented = async () => {
    setIsUpdating(true);
    try {
      const oldStatus = property.status;
      const newStatus = property.status === 'sold' || property.status === 'rented' ? 'available' : 'sold';

      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', property.id);

      if (error) throw error;

      // Log the activity
      await logActivity.propertyStatusChanged({
        title: property.title_ar || property.title_en || property.title_tr || 'Unknown Property',
        property_id: property.id,
        old_status: oldStatus,
        new_status: newStatus,
        price: property.price,
        currency: property.currency
      });

      toast({
        title: currentLanguage === 'ar' ? 'تم التحديث' : 'Updated',
        description: newStatus === 'sold'
          ? (currentLanguage === 'ar' ? 'تم تحديث حالة العقار إلى مباع/مؤجر' : 'Property marked as sold/rented')
          : (currentLanguage === 'ar' ? 'تم تحديث حالة العقار إلى متاح' : 'Property marked as available'),
      });

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error: any) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحديث الحالة' : 'Failed to update status'),
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleVisibility = async () => {
    // Check if property was hidden by admin - if so, seller cannot unhide it
    if (property.hidden_by_admin && (property.status === 'hidden' || property.status === 'pending')) {
      toast({
        title: currentLanguage === 'ar' ? 'غير مسموح' : 'Not Allowed',
        description: currentLanguage === 'ar'
          ? 'لا يمكنك إظهار هذا العقار لأنه تم إخفاؤه من قبل الإدارة'
          : 'You cannot show this property as it was hidden by admin',
        variant: 'destructive'
      });
      return;
    }

    setIsUpdating(true);
    try {
      const newStatus = (property.status === 'hidden' || property.status === 'pending') ? 'available' : 'pending';

      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', property.id);

      if (error) throw error;

      // Log the visibility change activity
      const isHiding = newStatus === 'hidden';
      await logActivity.propertyVisibilityChanged({
        title: property.title_ar || property.title_en || property.title_tr || 'Unknown Property',
        property_id: property.id,
        is_hidden: isHiding
      });

      toast({
        title: currentLanguage === 'ar' ? 'تم التحديث' : 'Updated',
        description: newStatus === 'available'
          ? (currentLanguage === 'ar' ? 'تم إظهار العقار' : 'Property is now visible')
          : (currentLanguage === 'ar' ? 'تم إخفاء العقار' : 'Property is now hidden'),
      });

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error: any) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحديث حالة العرض' : 'Failed to update visibility'),
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isSoldOrRented = property.status === 'sold' || property.status === 'rented';
  const isHidden = property.status === 'pending' || property.status === 'hidden';
  const isHiddenByAdmin = property.hidden_by_admin && isHidden;

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onView(property)}
        className="flex-1"
      >
        <Eye className="w-4 h-4 mr-2" />
        {currentLanguage === 'ar' ? 'عرض' : currentLanguage === 'tr' ? 'Görüntüle' : 'View'}
      </Button>
      
      {onEdit && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(property)}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}

      <Button
        size="sm"
        variant={isHidden ? "default" : "outline"}
        onClick={handleToggleVisibility}
        disabled={isUpdating || isHiddenByAdmin}
        className={`${isHidden ? "bg-orange-600 hover:bg-orange-700 text-white" : ""} ${
          isHiddenByAdmin ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title={
          isHiddenByAdmin 
            ? (currentLanguage === 'ar' ? 'تم إخفاء هذا العقار من قبل الإدارة' : 'This property was hidden by admin')
            : isHidden 
            ? (currentLanguage === 'ar' ? 'إظهار العقار' : 'Show property')
            : (currentLanguage === 'ar' ? 'إخفاء العقار' : 'Hide property')
        }
      >
        <EyeOff className="w-4 h-4" />
      </Button>

      <Button
        size="sm"
        variant={isSoldOrRented ? "default" : "outline"}
        onClick={handleToggleSoldRented}
        disabled={isUpdating}
        className={isSoldOrRented ? "bg-green-600 hover:bg-green-700 text-white" : ""}
        title={isSoldOrRented 
          ? (currentLanguage === 'ar' ? 'إعادة تعيين إلى متاح' : 'Mark as available')
          : (currentLanguage === 'ar' ? 'تحديد كمباع/مؤجر' : 'Mark as sold/rented')
        }
      >
        <CheckCircle className={`w-4 h-4 ${isSoldOrRented ? 'fill-current' : ''}`} />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDelete(property.id)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default PropertyActions;
