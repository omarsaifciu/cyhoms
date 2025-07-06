import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types/property";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import { getCityNameByLanguage, getDistrictNameByLanguage, getDistrictsByCity } from "@/utils/cityUtils";
import ImageUpload from "../seller/ImageUpload";
import PropertyTypeSelector from "../property/PropertyTypeSelector";
import PropertyLayoutFilter from "../search/PropertyLayoutFilter";
import { X } from "lucide-react";

interface PropertyEditFormProps {
  property: Property;
  onSave: (updatedProperty: Partial<Property>) => Promise<void>;
  onCancel: () => void;
}

const PropertyEditForm = ({ property, onSave, onCancel }: PropertyEditFormProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { cities, districts } = useCitiesAndDistricts();
  const [loading, setLoading] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState(districts);
  
  const [formData, setFormData] = useState({
    title_ar: property.title_ar || '',
    title_en: property.title_en || '',
    title_tr: property.title_tr || '',
    description_ar: property.description_ar || '',
    description_en: property.description_en || '',
    description_tr: property.description_tr || '',
    price: property.price.toString(),
    currency: property.currency || 'EUR',
    listing_type: property.listing_type || 'rent',
    deposit: property.deposit?.toString() || '0',
    deposit_currency: property.deposit_currency || property.currency || 'EUR',
    commission: property.commission?.toString() || '0',
    commission_currency: property.commission_currency || property.currency || 'EUR',
    city: property.city,
    district: property.district || '',
    property_type: property.property_type_id || '',
    property_layout_id: property.property_layout_id || '',
    bedrooms: property.bedrooms?.toString() || '',
    bathrooms: property.bathrooms?.toString() || '',
    area: property.area?.toString() || '',
    status: property.status || 'available',
    images: Array.isArray(property.images) ? property.images : [],
    cover_image: property.cover_image || '',
    is_featured: property.is_featured || false
  });

  useEffect(() => {
    if (formData.city) {
      const cityDistricts = getDistrictsByCity(formData.city, districts);
      setAvailableDistricts(cityDistricts);
    }
  }, [formData.city, districts]);

  const handleCityChange = (cityId: string) => {
    setFormData(prev => ({ ...prev, city: cityId, district: '' }));
    const cityDistricts = getDistrictsByCity(cityId, districts);
    setAvailableDistricts(cityDistricts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title_ar.trim() && !formData.title_en.trim() && !formData.title_tr.trim()) {
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'يجب إدخال العنوان في لغة واحدة على الأقل' : 'Title is required in at least one language',
          variant: 'destructive'
        });
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'السعر مطلوب ويجب أن يكون أكبر من صفر' : 'Price is required and must be greater than zero',
          variant: 'destructive'
        });
        return;
      }

      if (!formData.city || !formData.property_type) {
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'المدينة ونوع العقار مطلوبان' : 'City and property type are required',
          variant: 'destructive'
        });
        return;
      }

      const updatedData: Partial<Property> = {
        title: formData.title_ar.trim() || formData.title_en.trim() || formData.title_tr.trim(),
        title_ar: formData.title_ar.trim() || null,
        title_en: formData.title_en.trim() || null,
        title_tr: formData.title_tr.trim() || null,
        description: formData.description_ar.trim() || formData.description_en.trim() || formData.description_tr.trim() || null,
        description_ar: formData.description_ar.trim() || null,
        description_en: formData.description_en.trim() || null,
        description_tr: formData.description_tr.trim() || null,
        price: parseFloat(formData.price),
        currency: formData.currency,
        listing_type: formData.listing_type,
        deposit: parseFloat(formData.deposit) || 0,
        deposit_currency: formData.deposit_currency,
        commission: parseFloat(formData.commission) || 0,
        commission_currency: formData.commission_currency,
        city: formData.city,
        district: formData.district.trim() || null,
        property_type_id: formData.property_type,
        property_layout_id: formData.property_layout_id || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        status: formData.status,
        images: formData.images,
        cover_image: formData.cover_image,
        is_featured: formData.is_featured
      };

      await onSave(updatedData);
      
      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث العقار بنجاح' : 'Property updated successfully'
      });
    } catch (error) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحديث العقار' : 'Failed to update property',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const validCities = cities.filter(city => 
    city.id && typeof city.id === 'string' && city.id.trim() !== ''
  );

  const validDistricts = availableDistricts.filter(district => 
    district.id && typeof district.id === 'string' && district.id.trim() !== ''
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {currentLanguage === 'ar' ? 'تعديل العقار' : 'Edit Property'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">{currentLanguage === 'ar' ? 'البيانات الأساسية' : 'Basic Info'}</TabsTrigger>
            <TabsTrigger value="multilang">{currentLanguage === 'ar' ? 'اللغات المتعددة' : 'Multiple Languages'}</TabsTrigger>
            <TabsTrigger value="media">{currentLanguage === 'ar' ? 'الصور والوسائط' : 'Images & Media'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="listing_type">{currentLanguage === 'ar' ? 'نوع الإعلان *' : 'Listing Type *'}</Label>
                <Select value={formData.listing_type} onValueChange={(value) => setFormData(prev => ({ ...prev, listing_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر النوع' : 'Select Type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">{currentLanguage === 'ar' ? 'للإيجار' : 'For Rent'}</SelectItem>
                    <SelectItem value="sale">{currentLanguage === 'ar' ? 'للبيع' : 'For Sale'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">
                  {formData.listing_type === 'rent' 
                    ? (currentLanguage === 'ar' ? 'السعر الشهري *' : 'Monthly Price *')
                    : (currentLanguage === 'ar' ? 'سعر البيع *' : 'Sale Price *')
                  }
                </Label>
                <Input 
                  id="price" 
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder={formData.listing_type === 'rent' ? "1200" : "250000"} 
                />
              </div>
              
              <div>
                <Label htmlFor="currency">{currentLanguage === 'ar' ? 'العملة *' : 'Currency *'}</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="TRY">TRY (₺)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.listing_type === 'rent' && (
                <>
                  <div>
                    <Label htmlFor="deposit">{currentLanguage === 'ar' ? 'الوديعة' : 'Deposit'}</Label>
                    <Input 
                      id="deposit" 
                      type="number"
                      value={formData.deposit}
                      onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
                      placeholder="0" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="deposit_currency">{currentLanguage === 'ar' ? 'عملة الوديعة' : 'Deposit Currency'}</Label>
                    <Select value={formData.deposit_currency} onValueChange={(value) => setFormData(prev => ({ ...prev, deposit_currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="TRY">TRY (₺)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="commission">{currentLanguage === 'ar' ? 'العمولة' : 'Commission'}</Label>
                <Input 
                  id="commission" 
                  type="number"
                  value={formData.commission}
                  onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                  placeholder="0" 
                />
              </div>
              <div>
                <Label htmlFor="commission_currency">{currentLanguage === 'ar' ? 'عملة العمولة' : 'Commission Currency'}</Label>
                <Select value={formData.commission_currency} onValueChange={(value) => setFormData(prev => ({ ...prev, commission_currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="TRY">TRY (₺)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="city">{currentLanguage === 'ar' ? 'المدينة *' : 'City *'}</Label>
                <Select value={formData.city} onValueChange={handleCityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر المدينة' : 'Select City'} />
                  </SelectTrigger>
                  <SelectContent>
                    {validCities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {getCityNameByLanguage(city, currentLanguage)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">{currentLanguage === 'ar' ? 'المنطقة' : 'District'}</Label>
                <Select 
                  value={formData.district || "no-district"} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, district: value === "no-district" ? "" : value }))}
                  disabled={!formData.city}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر المنطقة' : 'Select District'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-district">
                      {currentLanguage === 'ar' ? 'بدون منطقة محددة' : 'No specific district'}
                    </SelectItem>
                    {validDistricts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {getDistrictNameByLanguage(district, currentLanguage)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <PropertyTypeSelector
                value={formData.property_type}
                onChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}
                required
              />
              
              <PropertyLayoutFilter
                value={formData.property_layout_id}
                onChange={(value) => setFormData(prev => ({ ...prev, property_layout_id: value }))}
                label={currentLanguage === 'ar' ? 'تقسيم العقار' : 'Property Layout'}
                placeholder={currentLanguage === 'ar' ? 'اختر التقسيم' : 'Select Layout'}
              />
              
              <div>
                <Label htmlFor="bedrooms">{currentLanguage === 'ar' ? 'عدد الغرف' : 'Bedrooms'}</Label>
                <Input 
                  id="bedrooms" 
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  placeholder="3" 
                />
              </div>
              
              <div>
                <Label htmlFor="bathrooms">{currentLanguage === 'ar' ? 'عدد الحمامات' : 'Bathrooms'}</Label>
                <Input 
                  id="bathrooms" 
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                  placeholder="2" 
                />
              </div>
              
              <div>
                <Label htmlFor="area">{currentLanguage === 'ar' ? 'المساحة (متر مربع)' : 'Area (sqm)'}</Label>
                <Input 
                  id="area" 
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="120" 
                />
              </div>
              
              <div>
                <Label htmlFor="status">{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">{currentLanguage === 'ar' ? 'متاح' : 'Available'}</SelectItem>
                    <SelectItem value="pending">{currentLanguage === 'ar' ? 'مخفي' : 'Hidden'}</SelectItem>
                    <SelectItem value="rented">{currentLanguage === 'ar' ? 'مؤجر' : 'Rented'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_featured" 
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked as boolean }))}
                />
                <Label htmlFor="is_featured">{currentLanguage === 'ar' ? 'عقار مميز' : 'Featured Property'}</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="multilang" className="space-y-4">
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-right">العربية</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title_ar">العنوان بالعربية *</Label>
                    <Input 
                      id="title_ar" 
                      value={formData.title_ar}
                      onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                      placeholder="أدخل عنوان العقار بالعربية"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_ar">الوصف بالعربية</Label>
                    <Textarea 
                      id="description_ar" 
                      value={formData.description_ar}
                      onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                      placeholder="أدخل وصف العقار بالعربية..."
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">English</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title_en">Title in English</Label>
                    <Input 
                      id="title_en" 
                      value={formData.title_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                      placeholder="Enter property title in English"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_en">Description in English</Label>
                    <Textarea 
                      id="description_en" 
                      value={formData.description_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                      placeholder="Enter property description in English..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Türkçe</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title_tr">Türkçe Başlık</Label>
                    <Input 
                      id="title_tr" 
                      value={formData.title_tr}
                      onChange={(e) => setFormData(prev => ({ ...prev, title_tr: e.target.value }))}
                      placeholder="Türkçe mülk başlığını girin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_tr">Türkçe Açıklama</Label>
                    <Textarea 
                      id="description_tr" 
                      value={formData.description_tr}
                      onChange={(e) => setFormData(prev => ({ ...prev, description_tr: e.target.value }))}
                      placeholder="Türkçe mülk açıklamasını girin..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <ImageUpload
              onCoverImageChange={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
              onImagesChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
              coverImage={formData.cover_image}
              images={formData.images}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
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
      </CardContent>
    </Card>
  );
};

export default PropertyEditForm;
