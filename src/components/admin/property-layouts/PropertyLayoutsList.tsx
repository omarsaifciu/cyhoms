import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { PropertyLayout, getPropertyLayoutNameByLanguage } from "@/hooks/usePropertyLayouts";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { getPropertyTypeNameByLanguage } from "@/utils/propertyUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyLayoutsListProps {
  propertyLayouts: PropertyLayout[];
  loading: boolean;
  onEdit: (propertyLayout: PropertyLayout) => void;
  onRefresh: () => void;
}

const PropertyLayoutsList = ({ propertyLayouts, loading, onEdit, onRefresh }: PropertyLayoutsListProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { propertyTypes } = usePropertyTypes();

  console.log('PropertyLayoutsList received:', {
    layoutsCount: propertyLayouts.length,
    propertyTypesCount: propertyTypes.length,
    loading
  });

  const getPropertyTypeName = (typeId: string) => {
    if (!typeId) return currentLanguage === 'ar' ? 'غير محدد' : 'Not specified';
    
    const type = propertyTypes.find(t => t.id === typeId);
    console.log('Finding property type for ID:', typeId, 'Found:', type);
    return type ? getPropertyTypeNameByLanguage(type, currentLanguage) : (currentLanguage === 'ar' ? 'نوع غير معروف' : 'Unknown type');
  };

  const handleDelete = async (id: string) => {
    if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا التقسيم؟' : 'Are you sure you want to delete this layout?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('property_layouts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully',
        description: currentLanguage === 'ar' ? 'تم حذف التقسيم بنجاح' : 'Layout deleted successfully',
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error deleting layout:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في حذف التقسيم' : 'Failed to delete layout',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">
          {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </span>
      </div>
    );
  }

  if (propertyLayouts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {currentLanguage === 'ar' ? 'لا توجد تقسيمات عقارات' : 'No property layouts found'}
          </p>
          <p className="text-sm text-gray-500">
            {currentLanguage === 'ar' 
              ? 'انقر على "إضافة تقسيم جديد" لإضافة أول تقسيم' 
              : 'Click "Add New Layout" to add your first layout'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        {currentLanguage === 'ar' 
          ? `عدد التقسيمات: ${propertyLayouts.length}`
          : `Total layouts: ${propertyLayouts.length}`
        }
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {propertyLayouts.map((layout, index) => {
          console.log(`Rendering layout ${index + 1}:`, layout);
          
          return (
            <Card key={layout.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {getPropertyLayoutNameByLanguage(layout, currentLanguage)}
                  </CardTitle>
                  <Badge variant="secondary">
                    {currentLanguage === 'ar' ? 'نشط' : 'Active'}
                  </Badge>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {getPropertyTypeName(layout.property_type_id || '')}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <strong>{currentLanguage === 'ar' ? 'العربية:' : 'Arabic:'}</strong> {layout.name_ar}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>{currentLanguage === 'ar' ? 'الإنجليزية:' : 'English:'}</strong> {layout.name_en}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>{currentLanguage === 'ar' ? 'التركية:' : 'Turkish:'}</strong> {layout.name_tr}
                  </div>
                  {layout.property_type_id && (
                    <div className="text-xs text-gray-500">
                      <strong>{currentLanguage === 'ar' ? 'معرف النوع:' : 'Type ID:'}</strong> {layout.property_type_id}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(layout)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {currentLanguage === 'ar' ? 'تعديل' : 'Edit'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(layout.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {currentLanguage === 'ar' ? 'حذف' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyLayoutsList;
