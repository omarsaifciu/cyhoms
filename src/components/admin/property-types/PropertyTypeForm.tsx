
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { PropertyType } from "@/types/property";

interface PropertyTypeFormProps {
  propertyType?: PropertyType;
  onClose: () => void;
}

const PropertyTypeForm = ({ propertyType, onClose }: PropertyTypeFormProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    name_tr: '',
    is_active: true
  });

  useEffect(() => {
    if (propertyType) {
      setFormData({
        name_ar: propertyType.name_ar || '',
        name_en: propertyType.name_en || '',
        name_tr: propertyType.name_tr || '',
        is_active: propertyType.is_active ?? true
      });
    }
  }, [propertyType]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ar || !formData.name_en || !formData.name_tr) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      if (propertyType) {
        // Update existing property type
        const { error } = await supabase
          .from('property_types')
          .update({
            name_ar: formData.name_ar,
            name_en: formData.name_en,
            name_tr: formData.name_tr,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', propertyType.id);

        if (error) throw error;

        toast({
          title: currentLanguage === 'ar' ? 'تم التحديث بنجاح' : 'Updated Successfully',
          description: currentLanguage === 'ar' ? 'تم تحديث نوع العقار بنجاح' : 'Property type updated successfully',
        });
      } else {
        // Create new property type
        const { error } = await supabase
          .from('property_types')
          .insert({
            name_ar: formData.name_ar,
            name_en: formData.name_en,
            name_tr: formData.name_tr,
            is_active: formData.is_active,
            created_by: user?.id || '00000000-0000-0000-0000-000000000000'
          });

        if (error) throw error;

        toast({
          title: currentLanguage === 'ar' ? 'تم الإنشاء بنجاح' : 'Created Successfully',
          description: currentLanguage === 'ar' ? 'تم إنشاء نوع العقار بنجاح' : 'Property type created successfully',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving property type:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في حفظ نوع العقار' : 'Failed to save property type',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {propertyType 
            ? (currentLanguage === 'ar' ? 'تعديل نوع العقار' : 'Edit Property Type')
            : (currentLanguage === 'ar' ? 'إضافة نوع عقار جديد' : 'Add New Property Type')
          }
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' 
            ? 'أدخل أسماء نوع العقار بالثلاث لغات'
            : 'Enter the property type names in all three languages'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_ar">
                {currentLanguage === 'ar' ? 'الاسم بالعربية *' : 'Arabic Name *'}
              </Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => handleInputChange('name_ar', e.target.value)}
                placeholder={currentLanguage === 'ar' ? 'مثال: شقة' : 'Example: شقة'}
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
                placeholder="Example: Apartment"
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
                placeholder="Örnek: Daire"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">
              {currentLanguage === 'ar' ? 'نشط' : 'Active'}
            </Label>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : (propertyType 
                  ? (currentLanguage === 'ar' ? 'تحديث' : 'Update')
                  : (currentLanguage === 'ar' ? 'إضافة' : 'Add')
                )
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyTypeForm;
