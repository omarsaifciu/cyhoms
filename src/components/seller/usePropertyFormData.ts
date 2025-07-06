
import { useState, useEffect } from "react";
import { Property } from "@/types/property";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import { getDistrictsByCity } from "@/utils/cityUtils";

export const usePropertyFormData = (editingProperty?: Property | null) => {
  const { districts } = useCitiesAndDistricts();

  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    title_tr: '',
    description_ar: '',
    description_en: '',
    description_tr: '',
    price: '',
    currency: 'EUR',
    listing_type: 'rent',
    deposit: '0',
    deposit_currency: 'EUR',
    commission: '0',
    commission_currency: 'EUR',
    city: '',
    district: '',
    property_type: '',
    property_layout_id: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    status: 'available',
    images: [] as string[],
    cover_image: '',
    is_featured: false,
    is_student_housing: false,
    student_housing_gender: 'unspecified'
  });

  const [availableDistricts, setAvailableDistricts] = useState(districts);

  // Initialize form data when editing property
  useEffect(() => {
    if (editingProperty) {
      console.log('Initializing form with editing property:', editingProperty);
      
      // تأكد من معالجة البيانات المنطقية بشكل صحيح
      const isStudentHousing = Boolean(editingProperty.is_student_housing);
      const studentGender = editingProperty.student_housing_gender || 'unspecified';
      
      setFormData({
        title_ar: editingProperty.title_ar || '',
        title_en: editingProperty.title_en || '',
        title_tr: editingProperty.title_tr || '',
        description_ar: editingProperty.description_ar || '',
        description_en: editingProperty.description_en || '',
        description_tr: editingProperty.description_tr || '',
        price: editingProperty.price?.toString() || '',
        currency: editingProperty.currency || 'EUR',
        listing_type: editingProperty.listing_type || 'rent',
        deposit: editingProperty.deposit?.toString() || '0',
        deposit_currency: editingProperty.deposit_currency || editingProperty.currency || 'EUR',
        commission: editingProperty.commission?.toString() || '0',
        commission_currency: editingProperty.commission_currency || editingProperty.currency || 'EUR',
        city: editingProperty.city || '',
        district: editingProperty.district || '',
        property_type: editingProperty.property_type_id || editingProperty.property_type || '',
        property_layout_id: editingProperty.property_layout_id || '',
        bedrooms: editingProperty.bedrooms?.toString() || '',
        bathrooms: editingProperty.bathrooms?.toString() || '',
        area: editingProperty.area?.toString() || '',
        status: editingProperty.status || 'available',
        images: Array.isArray(editingProperty.images) ? editingProperty.images : [],
        cover_image: editingProperty.cover_image || '',
        is_featured: !!editingProperty.is_featured,
        is_student_housing: isStudentHousing,
        student_housing_gender: studentGender
      });
      
      console.log('Form initialized with student housing data:', {
        is_student_housing: isStudentHousing,
        student_housing_gender: studentGender
      });
    }
  }, [editingProperty]);

  // Update available districts when city changes
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

  const handlePropertyTypeChange = (propertyTypeId: string) => {
    setFormData(prev => ({ ...prev, property_type: propertyTypeId, property_layout_id: '' }));
  };

  return {
    formData,
    setFormData,
    availableDistricts,
    handleCityChange,
    handlePropertyTypeChange
  };
};
