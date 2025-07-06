
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import { getCityNameByLanguage, getDistrictNameByLanguage, getDistrictsByCity } from "@/utils/cityUtils";
import PropertyTypeSelector from "@/components/property/PropertyTypeSelector";
import { NewPropertyForm } from "@/types/property";
import CurrencySelect from "@/components/ui/currency-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import PropertyLayoutSelector from "@/components/property/PropertyLayoutSelector";
import { useUserProfile } from "@/hooks/useUserProfile";

type ExtendedNewPropertyForm = NewPropertyForm & {
  is_student_housing: boolean;
  student_housing_gender: string;
};

interface BasicInfoTabProps {
  formData: ExtendedNewPropertyForm;
  setFormData: React.Dispatch<React.SetStateAction<ExtendedNewPropertyForm>>;
  handlePropertyTypeChange: (propertyTypeId: string) => void;
}

const BasicInfoTab = ({ formData, setFormData, handlePropertyTypeChange }: BasicInfoTabProps) => {
  const { t, currentLanguage } = useLanguage();
  const { cities, districts, loading: citiesLoading } = useCitiesAndDistricts();
  const { profile } = useUserProfile();

  const availableDistricts = formData.city ? getDistrictsByCity(formData.city, districts) : [];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStudentHousingChange = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      is_student_housing: checked,
      student_housing_gender: checked ? 'unspecified' : 'unspecified'
    }));
  };

  // يظهر خيار العقار المميز فقط إذا:
  // ١- كان المدير is_admin=true
  // ٢- أو كان user_type === 'partner_and_site_owner' فقط
  // إخفاء هذا الخيار عن جميع الأنواع الأخرى (وسيط، مالك، مكتب عقاري، ...).
  const canSetFeatured = !!(
    profile?.is_admin === true ||
    (profile?.user_type === 'partner_and_site_owner' && profile?.is_admin !== false)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('basicPropertyInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <PropertyTypeSelector
                value={formData.property_type}
                onChange={handlePropertyTypeChange}
                required
              />
              <PropertyLayoutSelector
                value={formData.property_layout_id}
                onChange={(value) => handleInputChange('property_layout_id', value)}
                propertyTypeId={formData.property_type}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  {t('cityRequired')}
                </Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)} required>
                  <SelectTrigger id="city">
                    <SelectValue placeholder={t('selectCity')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {getCityNameByLanguage(city, currentLanguage)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">
                  {t('district')}
                </Label>
                <Select 
                  value={formData.district} 
                  onValueChange={(value) => handleInputChange('district', value)}
                  disabled={!formData.city}
                >
                  <SelectTrigger id="district">
                    <SelectValue 
                      placeholder={
                        !formData.city 
                          ? t('selectCityFirst')
                          : t('selectDistrict')
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {getDistrictNameByLanguage(district, currentLanguage)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">
                {t('bedrooms')}
              </Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">
                {t('bathrooms')}
              </Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">
                {t('areaSqM')}
              </Label>
              <Input
                id="area"
                type="number"
                min="0"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('pricingInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listing_type">
                {t('listingTypeRequired')}
              </Label>
              <Select value={formData.listing_type} onValueChange={(value) => handleInputChange('listing_type', value)} required>
                <SelectTrigger id="listing_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">{t('forRent')}</SelectItem>
                  <SelectItem value="sale">{t('forSale')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t('status')}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">{t('available')}</SelectItem>
                  <SelectItem value="pending">{t('hidden')}</SelectItem>
                  <SelectItem value="rented">{t('rented')}</SelectItem>
                  <SelectItem value="sold">{t('sold')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('priceRequired')}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className="col-span-2"
                  required
                />
                <CurrencySelect
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">{t('deposit')}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deposit}
                  onChange={(e) => handleInputChange('deposit', e.target.value)}
                  placeholder="0.00"
                  className="col-span-2"
                />
                <CurrencySelect
                  value={formData.deposit_currency}
                  onValueChange={(value) => handleInputChange('deposit_currency', value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission">{t('commission')}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.commission}
                  onChange={(e) => handleInputChange('commission', e.target.value)}
                  placeholder="0.00"
                  className="col-span-2"
                />
                <CurrencySelect
                  value={formData.commission_currency}
                  onValueChange={(value) => handleInputChange('commission_currency', value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('studentHousingOptions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id="is_student_housing"
              checked={formData.is_student_housing}
              onCheckedChange={handleStudentHousingChange}
            />
            <Label htmlFor="is_student_housing" className="cursor-pointer">
              {t('studentHousing')}
            </Label>
            {formData.is_student_housing && (
              <Badge variant="secondary" className="ml-2">
                {t('studentHousing')}
              </Badge>
            )}
          </div>
          {formData.is_student_housing && (
            <div className="space-y-2">
              <Label htmlFor="student_housing_gender">
                {t('studentHousingType')}
              </Label>
              <Select 
                value={formData.student_housing_gender} 
                onValueChange={(value) => handleInputChange('student_housing_gender', value)}
              >
                <SelectTrigger id="student_housing_gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('maleOnly')}</SelectItem>
                  <SelectItem value="female">{t('femaleOnly')}</SelectItem>
                  <SelectItem value="mixed">{t('mixed')}</SelectItem>
                  <SelectItem value="unspecified">{t('unspecified')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* خانة العقار المميز – تظهر فقط للإدمن أو شريك ومالك الموقع */}
      {canSetFeatured && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
          />
          <Label htmlFor="is_featured">
            {t('featuredProperty')}
          </Label>
        </div>
      )}
    </div>
  );
};

export default BasicInfoTab;
