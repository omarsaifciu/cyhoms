import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyLayout } from "@/hooks/usePropertyLayouts";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { getPropertyTypeNameByLanguage } from "@/utils/propertyUtils";

interface PropertyLayoutFormProps {
  propertyLayout?: PropertyLayout | null;
  onClose: () => void;
}

const PropertyLayoutForm = ({ propertyLayout, onClose }: PropertyLayoutFormProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { propertyTypes } = usePropertyTypes();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    name_tr: '',
    property_type_id: ''
  });

  useEffect(() => {
    if (propertyLayout) {
      setFormData({
        name_ar: propertyLayout.name_ar || '',
        name_en: propertyLayout.name_en || '',
        name_tr: propertyLayout.name_tr || '',
        property_type_id: propertyLayout.property_type_id || ''
      });
    }
  }, [propertyLayout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // التحقق من اختيار نوع العقار
      if (!formData.property_type_id) {
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'يجب اختيار نوع العقار' : 'Property type is required',
          variant: 'destructive'
        });
        return;
      }

      if (propertyLayout) {
        // Update existing layout
        const { error } = await supabase
          .from('property_layouts')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', propertyLayout.id);

        if (error) throw error;

        toast({
          title: currentLanguage === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully',
          description: currentLanguage === 'ar' ? 'تم تحديث التقسيم بنجاح' : 'Layout updated successfully',
        });
      } else {
        // Create new layout
        const { error } = await supabase
          .from('property_layouts')
          .insert([{
            ...formData,
            created_by: user.id,
            is_active: true
          }]);

        if (error) throw error;

        toast({
          title: currentLanguage === 'ar' ? 'تم الإنشاء بنجاح' : 'Created successfully',
          description: currentLanguage === 'ar' ? 'تم إنشاء التقسيم بنجاح' : 'Layout created successfully',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving layout:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في حفظ التقسيم' : 'Failed to save layout',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {propertyLayout
            ? (currentLanguage === 'ar' ? 'تعديل التقسيم' : 'Edit Layout')
            : (currentLanguage === 'ar' ? 'إضافة تقسيم جديد' : 'Add New Layout')
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="property_type_id">
              {currentLanguage === 'ar' ? 'نوع العقار *' : 'Property Type *'}
            </Label>
            <Select value={formData.property_type_id} onValueChange={(value) => handleInputChange('property_type_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر نوع العقار' : 'Select property type'} />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {getPropertyTypeNameByLanguage(type, currentLanguage)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_ar">
                {currentLanguage === 'ar' ? 'الاسم بالعربية *' : 'Arabic Name *'}
              </Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => handleInputChange('name_ar', e.target.value)}
                placeholder={currentLanguage === 'ar' ? 'أدخل الاسم بالعربية' : 'Enter name in Arabic'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_en">
                {currentLanguage === 'ar' ? 'الاسم بالإنجليزية *' : 'English Name *'}
              </Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => handleInputChange('name_en', e.target.value)}
                placeholder="Enter name in English"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_tr">
                {currentLanguage === 'ar' ? 'الاسم بالتركية *' : 'Turkish Name *'}
              </Label>
              <Input
                id="name_tr"
                value={formData.name_tr}
                onChange={(e) => handleInputChange('name_tr', e.target.value)}
                placeholder="Türkçe isim girin"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? (currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : (currentLanguage === 'ar' ? 'حفظ' : 'Save')
              }
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyLayoutForm;
