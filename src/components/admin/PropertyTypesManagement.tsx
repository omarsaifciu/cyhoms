
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import PropertyTypesList from "./property-types/PropertyTypesList";
import PropertyTypeForm from "./property-types/PropertyTypeForm";
import { useQueryClient } from "@tanstack/react-query";

const PropertyTypesManagement = () => {
  const { currentLanguage } = useLanguage();
  const { propertyTypes, loading } = usePropertyTypes();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const handleAddNew = () => {
    setEditingType(null);
    setShowForm(true);
  };

  const handleEdit = (propertyType) => {
    setEditingType(propertyType);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingType(null);
    queryClient.invalidateQueries({ queryKey: ['propertyTypes'] });
  };

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['propertyTypes'] });
  };

  return (
    <div className="space-y-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {currentLanguage === 'ar' ? 'إدارة أنواع العقارات' : 
                 currentLanguage === 'tr' ? 'Emlak Türü Yönetimi' :
                 'Property Types Management'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'ar' ? 'إضافة وتعديل وحذف أنواع العقارات' :
                 currentLanguage === 'tr' ? 'Emlak türlerini ekleyin, düzenleyin ve silin' :
                 'Add, edit and delete property types'}
              </CardDescription>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {currentLanguage === 'ar' ? 'إضافة نوع جديد' :
               currentLanguage === 'tr' ? 'Yeni Tür Ekle' :
               'Add New Type'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <PropertyTypeForm
              propertyType={editingType}
              onClose={handleFormClose}
            />
          ) : (
            <PropertyTypesList
              propertyTypes={propertyTypes}
              loading={loading}
              onEdit={handleEdit}
              onRefresh={onRefresh}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyTypesManagement;
