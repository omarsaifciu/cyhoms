
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CityEditForm from "./CityEditForm";

interface City {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  is_active: boolean;
  created_at: string;
}

interface District {
  id: string;
  city_id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  is_active: boolean;
}

interface CityListProps {
  cities: City[];
  districts: District[];
  loading: boolean;
  onDeleteCity: (id: string) => void;
}

const CityList = ({ cities, districts, loading, onDeleteCity }: CityListProps) => {
  const { currentLanguage } = useLanguage();
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const getDistrictCount = (cityId: string) => {
    return districts.filter(district => district.city_id === cityId).length;
  };

  const handleSave = () => {
    setEditingCity(null);
    // Refresh the page to show updated data
    window.location.reload();
  };

  if (editingCity) {
    return (
      <CityEditForm
        city={editingCity}
        onSave={handleSave}
        onCancel={() => setEditingCity(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'قائمة المدن' : 'Cities List'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'جميع المدن المضافة في النظام' : 'All cities added to the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{currentLanguage === 'ar' ? 'اسم المدينة' : 'City Name'}</TableHead>
                <TableHead>{currentLanguage === 'ar' ? 'عدد الأحياء' : 'Districts Count'}</TableHead>
                <TableHead>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{currentLanguage === 'ar' ? 'تاريخ الإضافة' : 'Added Date'}</TableHead>
                <TableHead>{currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">
                    {currentLanguage === 'ar' ? city.name_ar :
                     currentLanguage === 'tr' ? city.name_tr : city.name_en}
                  </TableCell>
                  <TableCell>{getDistrictCount(city.id)}</TableCell>
                  <TableCell>
                    <Badge variant={city.is_active ? "default" : "secondary"}>
                      {city.is_active ? 
                        (currentLanguage === 'ar' ? 'نشط' : 'Active') : 
                        (currentLanguage === 'ar' ? 'غير نشط' : 'Inactive')
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(city.created_at).toLocaleDateString(
                      currentLanguage === 'ar' ? 'ar-SA' : 'en-US'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingCity(city)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => onDeleteCity(city.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {cities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {currentLanguage === 'ar' ? 'لا توجد مدن مضافة' : 'No cities added'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CityList;
