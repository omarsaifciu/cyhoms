
import { useState, useEffect } from "react";
import { NewPropertyForm } from "@/types/property";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import { getDistrictsByCity } from "@/utils/cityUtils";

export const usePropertyFormData = () => {
  const { districts } = useCitiesAndDistricts();
  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<NewPropertyForm & { is_student_housing: boolean; student_housing_gender: string; }>({
    title_ar: '',
    title_en: '',
    title_tr: '',
    description_ar: '',
    description_en: '',
    description_tr: '',
    price: '',
    currency: 'EUR',
    deposit: '0',
    deposit_currency: 'EUR',
    commission: '0',
    commission_currency: 'EUR',
    city: '',
    district: '',
    property_type: '',
    property_layout_id: '',
    listing_type: 'rent',
    bedrooms: '',
    bathrooms: '',
    area: '',
    status: 'available',
    images: [],
    cover_image: '',
    is_featured: false,
    is_student_housing: false,
    student_housing_gender: 'unspecified'
  });

  useEffect(() => {
    if (formData.city && formData.city !== '') {
      const cityDistricts = getDistrictsByCity(formData.city, districts);
      setAvailableDistricts(cityDistricts);
      if (formData.district && !cityDistricts.find(d => d.id === formData.district)) {
        setFormData(prev => ({ ...prev, district: '' }));
      }
    } else {
      setAvailableDistricts([]);
      setFormData(prev => ({ ...prev, district: '' }));
    }
  }, [formData.city, districts]);

  const handlePropertyTypeChange = (propertyTypeId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      property_type: propertyTypeId,
      property_layout_id: '' // Reset layout when property type changes
    }));
  };

  const resetForm = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      title_tr: '',
      description_ar: '',
      description_en: '',
      description_tr: '',
      price: '',
      currency: 'EUR',
      deposit: '0',
      deposit_currency: 'EUR',
      commission: '0',
      commission_currency: 'EUR',
      city: '',
      district: '',
      property_type: '',
      property_layout_id: '',
      listing_type: 'rent',
      bedrooms: '',
      bathrooms: '',
      area: '',
      status: 'available',
      images: [],
      cover_image: '',
      is_featured: false,
      is_student_housing: false,
      student_housing_gender: 'unspecified'
    });
  };

  const isFormValid = () => {
    // At least one title is required
    if (!formData.title_ar.trim() && !formData.title_en.trim() && !formData.title_tr.trim()) {
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      return false;
    }

    if (!formData.city || !formData.property_type || !formData.listing_type) {
      return false;
    }

    // Cover image is required
    if (!formData.cover_image) {
      return false;
    }

    return true;
  };

  return {
    formData,
    setFormData,
    availableDistricts,
    handlePropertyTypeChange,
    resetForm,
    isFormValid
  };
};
