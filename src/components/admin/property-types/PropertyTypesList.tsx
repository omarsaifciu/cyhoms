import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getPropertyTypeNameByLanguage } from "@/utils/propertyUtils";

interface PropertyTypesListProps {
  propertyTypes: any[];
  loading: boolean;
  onEdit: (propertyType: any) => void;
  onRefresh: () => void;
}

const PropertyTypesList = ({ propertyTypes, loading, onEdit, onRefresh }: PropertyTypesListProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('property_types')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'تم الحذف بنجاح' : 'Deleted Successfully',
        description: currentLanguage === 'ar' ? 'تم حذف نوع العقار بنجاح' : 'Property type deleted successfully',
      });

      onRefresh();
    } catch (error) {
      console.error('Error deleting property type:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في حذف نوع العقار' : 'Failed to delete property type',
        variant: 'destructive'
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] h-16 rounded"></div>
        ))}
      </div>
    );
  }

  if (propertyTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {currentLanguage === 'ar' ? 'لا توجد أنواع عقارات' : 'No Property Types'}
        </h3>
        <p className="text-gray-500">
          {currentLanguage === 'ar' ? 'ابدأ بإضافة نوع عقار جديد' : 'Start by adding a new property type'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {currentLanguage === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}
            </TableHead>
            <TableHead>
              {currentLanguage === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}
            </TableHead>
            <TableHead>
              {currentLanguage === 'ar' ? 'الاسم بالتركية' : 'Turkish Name'}
            </TableHead>
            <TableHead>
              {currentLanguage === 'ar' ? 'الحالة' : 'Status'}
            </TableHead>
            <TableHead>
              {currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {propertyTypes.map((propertyType) => (
            <TableRow key={propertyType.id}>
              <TableCell className="font-medium">
                {propertyType.name_ar}
              </TableCell>
              <TableCell>
                {propertyType.name_en}
              </TableCell>
              <TableCell>
                {propertyType.name_tr}
              </TableCell>
              <TableCell>
                <Badge variant={propertyType.is_active ? "default" : "secondary"}>
                  {propertyType.is_active 
                    ? (currentLanguage === 'ar' ? 'نشط' : 'Active')
                    : (currentLanguage === 'ar' ? 'غير نشط' : 'Inactive')
                  }
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(propertyType)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {currentLanguage === 'ar' ? 'تعديل' : 'Edit'}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingId === propertyType.id}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        {currentLanguage === 'ar' ? 'حذف' : 'Delete'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {currentLanguage === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {currentLanguage === 'ar' 
                            ? `هل أنت متأكد من حذف نوع العقار "${getPropertyTypeNameByLanguage(propertyType, currentLanguage)}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                            : `Are you sure you want to delete the property type "${getPropertyTypeNameByLanguage(propertyType, currentLanguage)}"? This action cannot be undone.`
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(propertyType.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {currentLanguage === 'ar' ? 'حذف' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyTypesList;
