
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface District {
  id: string;
  city_id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  is_active: boolean;
}

interface City {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
}

interface DistrictEditFormProps {
  district: District;
  cities: City[];
  onSave: () => void;
  onCancel: () => void;
}

const DistrictEditForm = ({ district, cities, onSave, onCancel }: DistrictEditFormProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    city_id: district.city_id,
    name_ar: district.name_ar,
    name_en: district.name_en,
    name_tr: district.name_tr,
    is_active: district.is_active
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('districts')
        .update(formData)
        .eq('id', district.id);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث الحي بنجاح' : 'District updated successfully'
      });

      onSave();
    } catch (error: any) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحديث الحي' : 'Failed to update district'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {currentLanguage === 'ar' ? 'تعديل الحي' : 'Edit District'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{currentLanguage === 'ar' ? 'المدينة' : 'City'}</Label>
            <Select 
              value={formData.city_id} 
              onValueChange={(value) => setFormData({ ...formData, city_id: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {currentLanguage === 'ar' ? city.name_ar :
                     currentLanguage === 'tr' ? city.name_tr : city.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{currentLanguage === 'ar' ? 'اسم الحي بالعربية' : 'District Name (Arabic)'}</Label>
            <Input
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>{currentLanguage === 'ar' ? 'اسم الحي بالإنجليزية' : 'District Name (English)'}</Label>
            <Input
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>{currentLanguage === 'ar' ? 'اسم الحي بالتركية' : 'District Name (Turkish)'}</Label>
            <Input
              value={formData.name_tr}
              onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {currentLanguage === 'ar' ? 'جارٍ الحفظ...' : 'Saving...'}
                </>
              ) : (
                currentLanguage === 'ar' ? 'حفظ التغييرات' : 'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DistrictEditForm;
