
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Eye, EyeOff, Star, CheckCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types/property";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import { supabase } from "@/integrations/supabase/client";
import PropertyEditForm from "./PropertyEditForm";
import { usePropertyViewsCount } from "@/hooks/usePropertyViewsCount";

interface PropertiesTableProps {
  properties: Property[];
  loading: boolean;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, currentFeatured: boolean) => void;
  onRefresh?: () => void;
  onOpenProperty?: (id: string) => void;
}

const PropertiesTable = ({ properties, loading, onToggleStatus, onDelete, onToggleFeatured, onRefresh, onOpenProperty }: PropertiesTableProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { cities, districts, loading: loadingCities } = useCitiesAndDistricts();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': return '$';
      default: return '€';
    }
  };

  const getImageCount = (images: any): number => {
    if (Array.isArray(images)) {
      return images.length;
    }
    return 0;
  };

  function getCityNameById(cityId: string) {
    const city = cities.find(c => c.id === cityId);
    if (!city) return cityId;
    if (currentLanguage === 'ar') return city.name_ar;
    if (currentLanguage === 'tr') return city.name_tr;
    return city.name_en;
  }

  const handleEditProperty = async (updatedData: Partial<Property>) => {
    if (!editingProperty) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update(updatedData)
        .eq('id', editingProperty.id);

      if (error) throw error;

      setEditingProperty(null);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحديث العقار' : 'Failed to update property'),
        variant: 'destructive'
      });
    }
  };

  const handleToggleSoldRented = async (propertyId: string, currentStatus: string) => {
    try {
      const newStatus = (currentStatus === 'sold' || currentStatus === 'rented') ? 'available' : 'sold';
      
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'تم التحديث' : 'Updated',
        description: newStatus === 'sold' 
          ? (currentLanguage === 'ar' ? 'تم تحديد العقار كمباع/مؤجر' : 'Property marked as sold/rented')
          : (currentLanguage === 'ar' ? 'تم تحديد العقار كمتاح' : 'Property marked as available'),
      });

      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحديث الحالة' : 'Failed to update status'),
        variant: 'destructive'
      });
    }
  };

  const getFeaturedLabel = () => {
    if (currentLanguage === 'ar') return 'مميز';
    if (currentLanguage === 'tr') return 'Öne Çıkan';
    return 'Featured';
  };

  if (editingProperty) {
    return (
      <PropertyEditForm
        property={editingProperty}
        onSave={handleEditProperty}
        onCancel={() => setEditingProperty(null)}
      />
    );
  }

  // Separate featured and regular properties
  const featuredProperties = properties.filter(property => property.is_featured);
  const regularProperties = properties.filter(property => !property.is_featured);

  const PropertyTable = ({ properties: tableProperties, title }: { properties: Property[], title?: string }) => (
    <div className="mb-8">
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {title}
        </h3>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{currentLanguage === 'ar' ? 'العنوان' : 'Title'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'المدينة' : 'City'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'السعر' : 'Price'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'الصور' : 'Images'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'المشاهدات' : 'Views'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableProperties.map((property) => {
            // استخدم hook المشاهدات لكل عقار
            const { viewsCount, loading: loadingViews } = usePropertyViewsCount(property.id);
            const isSoldOrRented = property.status === 'sold' || property.status === 'rented';

            return (
              <TableRow key={property.id} className={isSoldOrRented ? "bg-green-50" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {currentLanguage === 'ar' && property.title_ar ? property.title_ar :
                    currentLanguage === 'tr' && property.title_tr ? property.title_tr :
                    property.title_en || property.title}
                    {isSoldOrRented && (
                      <CheckCircle className="w-4 h-4 text-green-600 fill-current" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {loadingCities
                    ? <span className="text-gray-400">...</span>
                    : getCityNameById(property.city)}
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  {getCurrencySymbol(property.currency || 'EUR')}{property.price}
                </TableCell>
                <TableCell>{property.property_type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : property.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : property.status === 'sold'
                      ? 'bg-red-100 text-red-800'
                      : property.status === 'rented'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status === 'available' ? (currentLanguage === 'ar' ? 'متاح' : 'Available') :
                    property.status === 'pending' ? (currentLanguage === 'ar' ? 'مخفي' : 'Hidden') :
                    property.status === 'sold' ? (currentLanguage === 'ar' ? 'مباع' : 'Sold') :
                    property.status === 'rented' ? (currentLanguage === 'ar' ? 'مؤجر' : 'Rented') :
                    (currentLanguage === 'ar' ? 'مؤجر' : 'Rented')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {getImageCount(property.images)} {currentLanguage === 'ar' ? 'ملف' : 'files'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">
                      {loadingViews 
                        ? (currentLanguage === 'ar' ? "..." : "...")
                        : viewsCount ?? 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onOpenProperty && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenProperty(property.id)}
                        title={currentLanguage === 'ar' ? 'فتح العقار' : 'Open Property'}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={property.is_featured ? "default" : "outline"}
                      onClick={() => onToggleFeatured(property.id, property.is_featured || false)}
                      title={property.is_featured ?
                        (currentLanguage === 'ar' ? 'إزالة من المميزة' : 'Remove from featured') :
                        (currentLanguage === 'ar' ? 'إضافة إلى المميزة' : 'Add to featured')
                      }
                      className={property.is_featured ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                    >
                      <Star className={`w-4 h-4 ${property.is_featured ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant={isSoldOrRented ? "default" : "outline"}
                      onClick={() => handleToggleSoldRented(property.id, property.status || 'available')}
                      title={isSoldOrRented ?
                        (currentLanguage === 'ar' ? 'إعادة تعيين إلى متاح' : 'Mark as available') :
                        (currentLanguage === 'ar' ? 'تحديد كمباع/مؤجر' : 'Mark as sold/rented')
                      }
                      className={isSoldOrRented ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      <CheckCircle className={`w-4 h-4 ${isSoldOrRented ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStatus(property.id, property.status || 'available')}
                      title={property.status === 'available' ?
                        (currentLanguage === 'ar' ? 'إخفاء العقار' : 'Hide Property') :
                        (currentLanguage === 'ar' ? 'إظهار العقار' : 'Show Property')
                      }
                    >
                      {property.status === 'available' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProperty(property)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onDelete(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentLanguage === 'ar' ? 'قائمة العقارات' : 'Properties List'}</CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'جميع العقارات المضافة في النظام' : 'All properties added to the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div>
            {/* Featured Properties Section */}
            {featuredProperties.length > 0 && (
              <PropertyTable 
                properties={featuredProperties} 
                title={getFeaturedLabel()}
              />
            )}
            
            {/* Regular Properties Section */}
            {regularProperties.length > 0 && (
              <PropertyTable 
                properties={regularProperties} 
                title={featuredProperties.length > 0 ? (currentLanguage === 'ar' ? 'العقارات العادية' : 'Regular Properties') : undefined}
              />
            )}

            {properties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {currentLanguage === 'ar' ? 'لا توجد عقارات' : 'No properties found'}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertiesTable;
