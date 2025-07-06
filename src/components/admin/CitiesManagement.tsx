
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import CityForm from "./CityForm";
import CityList from "./CityList";
import DistrictForm from "./DistrictForm";
import DistrictList from "./DistrictList";

const CitiesManagement = () => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  
  const {
    cities,
    districts,
    loading,
    isAdmin,
    addCity,
    addDistrict,
    deleteCity,
    deleteDistrict,
    fetchCities,
    fetchDistricts
  } = useCitiesAndDistricts();

  console.log('CitiesManagement debug:', { 
    userEmail: user?.email, 
    isAdmin, 
    citiesCount: cities.length, 
    districtsCount: districts.length,
    loading 
  });

  // إعادة تحميل البيانات
  const handleRefresh = async () => {
    await Promise.all([fetchCities(), fetchDistricts()]);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          {currentLanguage === 'ar' ? 'يجب تسجيل الدخول للوصول إلى الإدارة' : 'Please login to access admin panel'}
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          {currentLanguage === 'ar' ? 'لا تملك صلاحيات الإدارة' : 'You do not have admin privileges'}
        </p>
        <p className="text-sm text-gray-500">
          {currentLanguage === 'ar' ? `المستخدم الحالي: ${user.email}` : `Current user: ${user.email}`}
        </p>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="mt-4"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {currentLanguage === 'ar' ? 'إعادة تحديث' : 'Refresh'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            {currentLanguage === 'ar' ? 'إدارة المدن والأحياء' : 'Cities & Districts Management'}
          </h2>
          <p className="text-gray-600">
            {currentLanguage === 'ar' ? 'إضافة وتعديل وحذف المدن والأحياء' : 'Add, edit, and delete cities and districts'}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {currentLanguage === 'ar' ? `مسجل كمدير: ${user.email}` : `Logged in as admin: ${user.email}`}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {currentLanguage === 'ar' ? 'تحميل البيانات...' : 'Loading data...'}
          </p>
        </div>
      ) : (
        <>
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">
                {currentLanguage === 'ar' ? 'إجمالي المدن' : 'Total Cities'}
              </h3>
              <p className="text-2xl font-bold text-blue-600">{cities.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">
                {currentLanguage === 'ar' ? 'إجمالي المناطق' : 'Total Districts'}
              </h3>
              <p className="text-2xl font-bold text-green-600">{districts.length}</p>
            </div>
          </div>

          {/* Cities Section */}
          <CityForm onAddCity={addCity} />
          <CityList 
            cities={cities} 
            districts={districts} 
            loading={loading} 
            onDeleteCity={deleteCity} 
          />

          {/* Districts Section */}
          <DistrictForm cities={cities} onAddDistrict={addDistrict} />
          <DistrictList 
            districts={districts} 
            cities={cities} 
            loading={loading} 
            onDeleteDistrict={deleteDistrict} 
          />
        </>
      )}
    </div>
  );
};

export default CitiesManagement;
