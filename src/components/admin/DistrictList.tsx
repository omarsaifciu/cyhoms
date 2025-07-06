
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Building } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import DistrictEditForm from "./DistrictEditForm";

interface District {
  id: string;
  city_id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  is_active: boolean;
  created_at: string;
}

interface City {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  is_active: boolean;
}

interface DistrictListProps {
  districts: District[];
  cities: City[];
  loading: boolean;
  onDeleteDistrict: (id: string) => void;
}

const DistrictList = ({ districts, cities, loading, onDeleteDistrict }: DistrictListProps) => {
  const { currentLanguage } = useLanguage();
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return cityId;
    
    if (currentLanguage === 'ar') return city.name_ar;
    if (currentLanguage === 'tr') return city.name_tr;
    return city.name_en;
  };

  const handleSave = () => {
    setEditingDistrict(null);
    // Refresh the page to show updated data
    window.location.reload();
  };

  if (editingDistrict) {
    return (
      <DistrictEditForm
        district={editingDistrict}
        cities={cities}
        onSave={handleSave}
        onCancel={() => setEditingDistrict(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'قائمة الأحياء' : 'Districts List'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'جميع الأحياء المضافة في النظام' : 'All districts added to the system'}
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
                <TableHead>{currentLanguage === 'ar' ? 'اسم الحي' : 'District Name'}</TableHead>
                <TableHead>{currentLanguage === 'ar' ? 'المدينة' : 'City'}</TableHead>
                <TableHead>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{currentLanguage === 'ar' ? 'تاريخ الإضافة' : 'Added Date'}</TableHead>
                <TableHead>{currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {districts.map((district) => (
                <TableRow key={district.id}>
                  <TableCell className="font-medium">
                    {currentLanguage === 'ar' ? district.name_ar :
                     currentLanguage === 'tr' ? district.name_tr : district.name_en}
                  </TableCell>
                  <TableCell>{getCityName(district.city_id)}</TableCell>
                  <TableCell>
                    <Badge variant={district.is_active ? "default" : "secondary"}>
                      {district.is_active ? 
                        (currentLanguage === 'ar' ? 'نشط' : 'Active') : 
                        (currentLanguage === 'ar' ? 'غير نشط' : 'Inactive')
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(district.created_at).toLocaleDateString(
                      currentLanguage === 'ar' ? 'ar-SA' : 'en-US'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingDistrict(district)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => onDeleteDistrict(district.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {districts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {currentLanguage === 'ar' ? 'لا توجد أحياء مضافة' : 'No districts added'}
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

export default DistrictList;
