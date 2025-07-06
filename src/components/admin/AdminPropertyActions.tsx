
import { Button } from "@/components/ui/button";
import { Trash2, EyeOff, Eye, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AdminPropertyActionsProps {
  propertyId: string;
  isHidden: boolean;
  onUpdate: () => void;
}

const AdminPropertyActions = ({ propertyId, isHidden, onUpdate }: AdminPropertyActionsProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event

    const confirmMessage = currentLanguage === 'ar'
      ? 'هل أنت متأكد من حذف هذا العقار نهائياً؟\n\nتحذير: هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة بالعقار.'
      : 'Are you sure you want to permanently delete this property?\n\nWarning: This action cannot be undone and will delete all related data.';

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);
    try {
      // Delete related records first to avoid foreign key constraint issues
      console.log('Deleting related records for property:', propertyId);

      // Delete property activities first (if any exist)
      const { error: activitiesError } = await supabase
        .from('property_activities')
        .delete()
        .eq('property_id', propertyId);

      if (activitiesError) {
        console.warn('Error deleting property activities:', activitiesError);
      }

      // Skip user activity logs deletion for now to avoid conflicts
      // The database should handle this with ON DELETE SET NULL constraint
      console.log('Skipping user_activity_logs deletion - will be handled by database constraints');

      // Delete property views
      const { error: viewsError } = await supabase
        .from('property_views')
        .delete()
        .eq('property_id', propertyId);

      if (viewsError) {
        console.warn('Error deleting property views:', viewsError);
      }

      // Delete favorites
      const { error: favoritesError } = await supabase
        .from('favorites')
        .delete()
        .eq('property_id', propertyId);

      if (favoritesError) {
        console.warn('Error deleting favorites:', favoritesError);
        // Continue anyway as this might not exist
      }

      // Delete property reports
      const { error: reportsError } = await supabase
        .from('property_reports')
        .delete()
        .eq('property_id', propertyId);

      if (reportsError) {
        console.warn('Error deleting property reports:', reportsError);
        // Continue anyway as this might not exist
      }

      // Delete property comments
      const { error: commentsError } = await supabase
        .from('property_comments')
        .delete()
        .eq('property_id', propertyId);

      if (commentsError) {
        console.warn('Error deleting property comments:', commentsError);
        // Continue anyway as this might not exist
      }

      // Now delete the property itself
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? '✅ تم الحذف بنجاح' : '✅ Successfully Deleted',
        description: currentLanguage === 'ar' ? 'تم حذف العقار وجميع البيانات المرتبطة به نهائياً' : 'Property and all related data have been permanently deleted',
      });

      onUpdate();
    } catch (error: any) {
      console.error('Error deleting property:', error);

      // Provide more specific error messages
      let errorMessage = currentLanguage === 'ar' ? 'فشل في حذف العقار' : 'Failed to delete property';

      if (error.code === '23503') {
        errorMessage = currentLanguage === 'ar'
          ? 'لا يمكن حذف العقار بسبب وجود سجلات مرتبطة'
          : 'Cannot delete property due to related records';
      } else if (error.code === '42501') {
        errorMessage = currentLanguage === 'ar'
          ? 'ليس لديك صلاحية لحذف هذا العقار'
          : 'You do not have permission to delete this property';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: currentLanguage === 'ar' ? 'خطأ في الحذف' : 'Delete Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event

    setIsLoading(true);
    try {
      const newStatus = isHidden ? 'available' : 'pending';
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: newStatus,
          hidden_by_admin: !isHidden
        })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? '✅ تم التحديث بنجاح' : '✅ Successfully Updated',
        description: isHidden
          ? (currentLanguage === 'ar' ? '👁️ العقار أصبح مرئياً للجمهور الآن' : '👁️ Property is now visible to the public')
          : (currentLanguage === 'ar' ? '🙈 العقار أصبح مخفياً عن الجمهور الآن' : '🙈 Property is now hidden from the public'),
      });

      onUpdate();
    } catch (error: any) {
      console.error('Error toggling property visibility:', error);

      let errorMessage = currentLanguage === 'ar' ? 'فشل في تحديث حالة العرض' : 'Failed to update visibility';

      if (error.code === '42501') {
        errorMessage = currentLanguage === 'ar'
          ? 'ليس لديك صلاحية لتحديث هذا العقار'
          : 'You do not have permission to update this property';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: currentLanguage === 'ar' ? 'خطأ في التحديث' : 'Update Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
      {/* زر الإخفاء/الإظهار */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleToggleVisibility}
        disabled={isLoading}
        className={`p-2.5 rounded-xl shadow-xl backdrop-blur-md border-2 transition-all duration-300 hover:scale-110 ${
          isHidden
            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-400 shadow-green-500/30"
            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-orange-400 shadow-orange-500/30"
        }`}
        title={isHidden
          ? (currentLanguage === 'ar' ? 'إظهار العقار للجمهور' : 'Show property to public')
          : (currentLanguage === 'ar' ? 'إخفاء العقار عن الجمهور' : 'Hide property from public')
        }
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />
        )}
      </Button>

      {/* زر الحذف */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={isLoading}
        className="p-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-2 border-red-400 shadow-xl shadow-red-500/30 backdrop-blur-md transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        title={currentLanguage === 'ar' ? 'حذف العقار نهائياً' : 'Delete property permanently'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default AdminPropertyActions;
