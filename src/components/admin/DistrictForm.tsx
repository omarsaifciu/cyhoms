
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";
import { NewDistrictForm, City } from "@/types/city";
import { getCityNameByLanguage } from "@/utils/cityUtils";

interface DistrictFormProps {
  cities: City[];
  onAddDistrict: (district: NewDistrictForm) => Promise<boolean>;
}

const DistrictForm = ({ cities, onAddDistrict }: DistrictFormProps) => {
  const { currentLanguage } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [districtForm, setDistrictForm] = useState<NewDistrictForm>({
    city_id: '',
    name_ar: '',
    name_en: '',
    name_tr: ''
  });

  const handleAddDistrict = async () => {
    if (!districtForm.city_id || !districtForm.name_ar.trim() || !districtForm.name_en.trim() || !districtForm.name_tr.trim()) {
      return;
    }

    const success = await onAddDistrict(districtForm);
    if (success) {
      setDistrictForm({ city_id: '', name_ar: '', name_en: '', name_tr: '' });
      setShowForm(false);
    }
  };

  // Filter out cities with empty IDs or names
  const validCities = cities.filter(city => 
    city.id && city.id.trim() !== '' && 
    getCityNameByLanguage(city, currentLanguage).trim() !== ''
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {currentLanguage === 'ar' ? 'الأحياء' : 'Districts'}
          </CardTitle>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'إضافة حي' : 'Add District'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              {currentLanguage === 'ar' ? 'إضافة حي جديد' : 'Add New District'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="district_city">{currentLanguage === 'ar' ? 'المدينة' : 'City'}</Label>
                <select
                  id="district_city"
                  value={districtForm.city_id}
                  onChange={(e) => setDistrictForm(prev => ({ ...prev, city_id: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{currentLanguage === 'ar' ? 'اختر المدينة' : 'Select City'}</option>
                  {validCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {getCityNameByLanguage(city, currentLanguage)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="district_name_ar">{currentLanguage === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}</Label>
                <Input
                  id="district_name_ar"
                  value={districtForm.name_ar}
                  onChange={(e) => setDistrictForm(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder={currentLanguage === 'ar' ? 'أدخل اسم الحي بالعربية' : 'Enter district name in Arabic'}
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="district_name_en">{currentLanguage === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}</Label>
                <Input
                  id="district_name_en"
                  value={districtForm.name_en}
                  onChange={(e) => setDistrictForm(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder={currentLanguage === 'ar' ? 'أدخل اسم الحي بالإنجليزية' : 'Enter district name in English'}
                />
              </div>
              <div>
                <Label htmlFor="district_name_tr">{currentLanguage === 'ar' ? 'الاسم بالتركية' : 'Turkish Name'}</Label>
                <Input
                  id="district_name_tr"
                  value={districtForm.name_tr}
                  onChange={(e) => setDistrictForm(prev => ({ ...prev, name_tr: e.target.value }))}
                  placeholder={currentLanguage === 'ar' ? 'أدخل اسم الحي بالتركية' : 'Enter district name in Turkish'}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleAddDistrict}>
                {currentLanguage === 'ar' ? 'إضافة الحي' : 'Add District'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DistrictForm;
