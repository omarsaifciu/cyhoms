
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";
import { NewCityForm } from "@/types/city";

interface CityFormProps {
  onAddCity: (city: NewCityForm) => Promise<boolean>;
}

const CityForm = ({ onAddCity }: CityFormProps) => {
  const { currentLanguage } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [cityForm, setCityForm] = useState<NewCityForm>({
    name_ar: '',
    name_en: '',
    name_tr: ''
  });

  const handleAddCity = async () => {
    if (!cityForm.name_ar.trim() || !cityForm.name_en.trim() || !cityForm.name_tr.trim()) {
      return;
    }

    const success = await onAddCity(cityForm);
    if (success) {
      setCityForm({ name_ar: '', name_en: '', name_tr: '' });
      setShowForm(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {currentLanguage === 'ar' ? 'المدن' : 'Cities'}
          </CardTitle>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'إضافة مدينة' : 'Add City'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              {currentLanguage === 'ar' ? 'إضافة مدينة جديدة' : 'Add New City'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city_name_ar">{currentLanguage === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}</Label>
                <Input
                  id="city_name_ar"
                  value={cityForm.name_ar}
                  onChange={(e) => setCityForm(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder={currentLanguage === 'ar' ? 'أدخل اسم المدينة بالعربية' : 'Enter city name in Arabic'}
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="city_name_en">{currentLanguage === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}</Label>
                <Input
                  id="city_name_en"
                  value={cityForm.name_en}
                  onChange={(e) => setCityForm(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder={currentLanguage === 'ar' ? 'أدخل اسم المدينة بالإنجليزية' : 'Enter city name in English'}
                />
              </div>
              <div>
                <Label htmlFor="city_name_tr">{currentLanguage === 'ar' ? 'الاسم بالتركية' : 'Turkish Name'}</Label>
                <Input
                  id="city_name_tr"
                  value={cityForm.name_tr}
                  onChange={(e) => setCityForm(prev => ({ ...prev, name_tr: e.target.value }))}
                  placeholder={currentLanguage === 'ar' ? 'أدخل اسم المدينة بالتركية' : 'Enter city name in Turkish'}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleAddCity}>
                {currentLanguage === 'ar' ? 'إضافة المدينة' : 'Add City'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CityForm;
