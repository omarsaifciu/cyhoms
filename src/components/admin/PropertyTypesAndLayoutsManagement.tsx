
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { usePropertyLayouts } from "@/hooks/usePropertyLayouts";
import PropertyTypesList from "./property-types/PropertyTypesList";
import PropertyTypeForm from "./property-types/PropertyTypeForm";
import PropertyLayoutsList from "./property-layouts/PropertyLayoutsList";
import PropertyLayoutForm from "./property-layouts/PropertyLayoutForm";
import { useQueryClient } from "@tanstack/react-query";

const PropertyTypesAndLayoutsManagement = () => {
  const { currentLanguage } = useLanguage();
  const { propertyTypes, loading: typesLoading } = usePropertyTypes();
  const [refreshKey, setRefreshKey] = useState(0);
  const { propertyLayouts, loading: layoutsLoading, fetchPropertyLayouts } = usePropertyLayouts(refreshKey);
  const queryClient = useQueryClient();
  
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [showLayoutForm, setShowLayoutForm] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);

  const handleAddNewType = () => {
    setEditingType(null);
    setShowTypeForm(true);
  };

  const handleEditType = (propertyType) => {
    setEditingType(propertyType);
    setShowTypeForm(true);
  };

  const handleTypeFormClose = () => {
    setShowTypeForm(false);
    setEditingType(null);
    queryClient.invalidateQueries({ queryKey: ['propertyTypes'] });
  };

  const onTypesRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['propertyTypes'] });
  };

  const handleAddNewLayout = () => {
    setEditingLayout(null);
    setShowLayoutForm(true);
  };

  const handleEditLayout = (propertyLayout) => {
    setEditingLayout(propertyLayout);
    setShowLayoutForm(true);
  };

  const handleLayoutFormClose = () => {
    setShowLayoutForm(false);
    setEditingLayout(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleLayoutsRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchPropertyLayouts();
  };

  return (
    <div className="space-y-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle>
            {currentLanguage === 'ar' ? 'إدارة أنواع العقارات وتقسيماتها' : 
             currentLanguage === 'tr' ? 'Emlak Türleri ve Düzenleri Yönetimi' :
             'Property Types & Layouts Management'}
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' ? 'إضافة وتعديل وحذف أنواع العقارات وتقسيماتها' :
             currentLanguage === 'tr' ? 'Emlak türlerini ve düzenlerini ekleyin, düzenleyin ve silin' :
             'Add, edit and delete property types and layouts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="types" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="types">
                {currentLanguage === 'ar' ? 'أنواع العقارات' :
                 currentLanguage === 'tr' ? 'Emlak Türleri' :
                 'Property Types'}
              </TabsTrigger>
              <TabsTrigger value="layouts">
                {currentLanguage === 'ar' ? 'تقسيمات العقارات' :
                 currentLanguage === 'tr' ? 'Emlak Düzenleri' :
                 'Property Layouts'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="types">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {currentLanguage === 'ar' ? 'أنواع العقارات' : 'Property Types'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === 'ar' ? 'إدارة أنواع العقارات المختلفة' : 'Manage different property types'}
                  </p>
                </div>
                <Button onClick={handleAddNewType} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {currentLanguage === 'ar' ? 'إضافة نوع جديد' :
                   currentLanguage === 'tr' ? 'Yeni Tür Ekle' :
                   'Add New Type'}
                </Button>
              </div>
              {showTypeForm ? (
                <PropertyTypeForm
                  propertyType={editingType}
                  onClose={handleTypeFormClose}
                />
              ) : (
                <PropertyTypesList
                  propertyTypes={propertyTypes}
                  loading={typesLoading}
                  onEdit={handleEditType}
                  onRefresh={onTypesRefresh}
                />
              )}
            </TabsContent>

            <TabsContent value="layouts">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {currentLanguage === 'ar' ? 'تقسيمات العقارات' : 'Property Layouts'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === 'ar' ? 'إدارة تقسيمات العقارات لكل نوع' : 'Manage property layouts for each type'}
                  </p>
                </div>
                <Button onClick={handleAddNewLayout} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {currentLanguage === 'ar' ? 'إضافة تقسيم جديد' :
                   currentLanguage === 'tr' ? 'Yeni Düzen Ekle' :
                   'Add New Layout'}
                </Button>
              </div>
              {showLayoutForm ? (
                <PropertyLayoutForm
                  propertyLayout={editingLayout}
                  onClose={handleLayoutFormClose}
                />
              ) : (
                <PropertyLayoutsList
                  propertyLayouts={propertyLayouts}
                  loading={layoutsLoading}
                  onEdit={handleEditLayout}
                  onRefresh={handleLayoutsRefresh}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyTypesAndLayoutsManagement;
