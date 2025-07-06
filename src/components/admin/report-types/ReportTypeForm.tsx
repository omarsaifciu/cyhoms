
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { useReportTypes } from "@/hooks/useReportTypes";
import { useToast } from "@/hooks/use-toast";

interface ReportType {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  description_ar?: string;
  description_en?: string;
  description_tr?: string;
  is_active: boolean;
  display_order: number;
}

interface ReportTypeFormProps {
  reportType?: ReportType | null;
  category: 'property' | 'user';
  onClose: () => void;
}

const ReportTypeForm = ({ reportType, category, onClose }: ReportTypeFormProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { 
    createPropertyReportType, 
    createUserReportType, 
    updatePropertyReportType, 
    updateUserReportType,
    loading 
  } = useReportTypes();

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    name_tr: '',
    description_ar: '',
    description_en: '',
    description_tr: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    if (reportType) {
      setFormData({
        name_ar: reportType.name_ar || '',
        name_en: reportType.name_en || '',
        name_tr: reportType.name_tr || '',
        description_ar: reportType.description_ar || '',
        description_en: reportType.description_en || '',
        description_tr: reportType.description_tr || '',
        is_active: reportType.is_active,
        display_order: reportType.display_order
      });
    }
  }, [reportType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ar || !formData.name_en || !formData.name_tr) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    let result;
    if (reportType) {
      // Update existing
      const updateFunction = category === 'property' ? updatePropertyReportType : updateUserReportType;
      result = await updateFunction(reportType.id, formData);
    } else {
      // Create new
      const createFunction = category === 'property' ? createPropertyReportType : createUserReportType;
      result = await createFunction(formData);
    }

    if (result.success) {
      toast({
        title: currentLanguage === 'ar' ? 'تم الحفظ' : 'Saved',
        description: currentLanguage === 'ar' ? 
          (reportType ? 'تم تحديث النوع بنجاح' : 'تم إنشاء النوع بنجاح') :
          (reportType ? 'Report type updated successfully' : 'Report type created successfully'),
      });
      onClose();
    } else {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'An error occurred while saving',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle>
            {reportType ? 
              (currentLanguage === 'ar' ? 'تعديل نوع البلاغ' : 'Edit Report Type') :
              (currentLanguage === 'ar' ? 'إضافة نوع بلاغ جديد' : 'Add New Report Type')
            }
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="ar" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ar">العربية</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="tr">Türkçe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ar" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder="أدخل اسم النوع بالعربية"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ar">الوصف بالعربية</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                  placeholder="أدخل وصف النوع بالعربية"
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name_en">Name in English *</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder="Enter type name in English"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_en">Description in English</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                  placeholder="Enter type description in English"
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="tr" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name_tr">Türkçe Adı *</Label>
                <Input
                  id="name_tr"
                  value={formData.name_tr}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_tr: e.target.value }))}
                  placeholder="Türkçe tür adını girin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_tr">Türkçe Açıklama</Label>
                <Textarea
                  id="description_tr"
                  value={formData.description_tr}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_tr: e.target.value }))}
                  placeholder="Türkçe tür açıklamasını girin"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_order">
                {currentLanguage === 'ar' ? 'ترتيب العرض' : 'Display Order'}
              </Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">
                {currentLanguage === 'ar' ? 'نشط' : 'Active'}
              </Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? 
                (currentLanguage === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') :
                (currentLanguage === 'ar' ? 'حفظ' : 'Save')
              }
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportTypeForm;
