
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Home, User } from "lucide-react";
import { useReportTypes } from "@/hooks/useReportTypes";
import ReportTypesList from "./report-types/ReportTypesList";
import ReportTypeForm from "./report-types/ReportTypeForm";
import { useQueryClient } from "@tanstack/react-query";

const ReportTypesManagement = () => {
  const { currentLanguage } = useLanguage();
  const { 
    propertyReportTypes, 
    userReportTypes, 
    loading,
    fetchAllPropertyReportTypes,
    fetchAllUserReportTypes
  } = useReportTypes();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [currentCategory, setCurrentCategory] = useState<'property' | 'user'>('property');

  const handleAddNew = (category: 'property' | 'user') => {
    setCurrentCategory(category);
    setEditingType(null);
    setShowForm(true);
  };

  const handleEdit = (reportType: any, category: 'property' | 'user') => {
    setCurrentCategory(category);
    setEditingType(reportType);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingType(null);
    fetchAllPropertyReportTypes();
    fetchAllUserReportTypes();
  };

  const onRefresh = () => {
    fetchAllPropertyReportTypes();
    fetchAllUserReportTypes();
  };

  return (
    <div className="space-y-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle>
            {currentLanguage === 'ar' ? 'إدارة أنواع البلاغات' : 
             currentLanguage === 'tr' ? 'Şikayet Türü Yönetimi' :
             'Report Types Management'}
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' ? 'إضافة وتعديل وحذف أنواع البلاغات للعقارات والمستخدمين' :
             currentLanguage === 'tr' ? 'Emlak ve kullanıcılar için şikayet türlerini ekleyin, düzenleyin ve silin' :
             'Add, edit and delete report types for properties and users'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <ReportTypeForm
              reportType={editingType}
              category={currentCategory}
              onClose={handleFormClose}
            />
          ) : (
            <Tabs defaultValue="property" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="property" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {currentLanguage === 'ar' ? 'بلاغات العقارات' :
                   currentLanguage === 'tr' ? 'Emlak Şikayetleri' :
                   'Property Reports'}
                </TabsTrigger>
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {currentLanguage === 'ar' ? 'بلاغات المستخدمين' :
                   currentLanguage === 'tr' ? 'Kullanıcı Şikayetleri' :
                   'User Reports'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="property" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {currentLanguage === 'ar' ? 'أنواع بلاغات العقارات' :
                     currentLanguage === 'tr' ? 'Emlak Şikayet Türleri' :
                     'Property Report Types'}
                  </h3>
                  <Button onClick={() => handleAddNew('property')} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {currentLanguage === 'ar' ? 'إضافة نوع جديد' :
                     currentLanguage === 'tr' ? 'Yeni Tür Ekle' :
                     'Add New Type'}
                  </Button>
                </div>
                <ReportTypesList
                  reportTypes={propertyReportTypes}
                  category="property"
                  loading={loading}
                  onEdit={(type) => handleEdit(type, 'property')}
                  onRefresh={onRefresh}
                />
              </TabsContent>
              
              <TabsContent value="user" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {currentLanguage === 'ar' ? 'أنواع بلاغات المستخدمين' :
                     currentLanguage === 'tr' ? 'Kullanıcı Şikayet Türleri' :
                     'User Report Types'}
                  </h3>
                  <Button onClick={() => handleAddNew('user')} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {currentLanguage === 'ar' ? 'إضافة نوع جديد' :
                     currentLanguage === 'tr' ? 'Yeni Tür Ekle' :
                     'Add New Type'}
                  </Button>
                </div>
                <ReportTypesList
                  reportTypes={userReportTypes}
                  category="user"
                  loading={loading}
                  onEdit={(type) => handleEdit(type, 'user')}
                  onRefresh={onRefresh}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportTypesManagement;
