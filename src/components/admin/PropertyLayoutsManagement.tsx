
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { usePropertyLayouts } from "@/hooks/usePropertyLayouts";
import PropertyLayoutsList from "./property-layouts/PropertyLayoutsList";
import PropertyLayoutForm from "./property-layouts/PropertyLayoutForm";

const PropertyLayoutsManagement = () => {
  const { currentLanguage } = useLanguage();
  const [refreshKey, setRefreshKey] = useState(0);
  const { propertyLayouts, loading, fetchPropertyLayouts } = usePropertyLayouts(refreshKey);
  const [showForm, setShowForm] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);

  useEffect(() => {
    console.log('PropertyLayoutsManagement - Current layouts:', propertyLayouts);
  }, [propertyLayouts]);

  const handleAddNew = () => {
    setEditingLayout(null);
    setShowForm(true);
  };

  const handleEdit = (propertyLayout) => {
    console.log('Editing layout:', propertyLayout);
    setEditingLayout(propertyLayout);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLayout(null);
    // تحديث القائمة عن طريق تغيير المفتاح
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    setRefreshKey(prev => prev + 1);
    fetchPropertyLayouts();
  };

  return (
    <div className="space-y-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {currentLanguage === 'ar' ? 'إدارة تقسيمات العقارات' : 
                 currentLanguage === 'tr' ? 'Emlak Düzeni Yönetimi' :
                 'Property Layouts Management'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'ar' ? 'إضافة وتعديل وحذف تقسيمات العقارات' :
                 currentLanguage === 'tr' ? 'Emlak düzenlerini ekleyin, düzenleyin ve silin' :
                 'Add, edit and delete property layouts'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
              </Button>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'إضافة تقسيم جديد' :
                 currentLanguage === 'tr' ? 'Yeni Düzen Ekle' :
                 'Add New Layout'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <PropertyLayoutForm
              propertyLayout={editingLayout}
              onClose={handleFormClose}
            />
          ) : (
            <PropertyLayoutsList
              propertyLayouts={propertyLayouts}
              loading={loading}
              onEdit={handleEdit}
              onRefresh={handleRefresh}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyLayoutsManagement;
