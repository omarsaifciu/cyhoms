
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Search, RefreshCw, Grid3X3, List, Download, Filter, Home, Eye, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePropertyManagement } from "@/hooks/usePropertyManagement";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import PropertyForm from "./PropertyForm";
import PropertiesTable from "./PropertiesTable";
import PropertyCard from "./PropertyCard";

const PropertyManagement = () => {
  const { currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Filters
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [listingTypeFilter, setListingTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    properties,
    loading,
    isAdmin,
    addingProperty,
    user,
    addProperty,
    deleteProperty,
    togglePropertyStatus,
    toggleFeaturedStatus,
    toggleHideStatus,
    toggleSoldStatus,
    fetchProperties
  } = usePropertyManagement();

  const { cities, districts } = useCitiesAndDistricts();

  // Advanced filtering and sorting
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.title_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.title_tr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.district?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // City filter
    if (cityFilter !== "all") {
      const selectedCity = cities.find(city => city.id === cityFilter);
      if (selectedCity) {
        const cityNames = [selectedCity.name_ar, selectedCity.name_en, selectedCity.name_tr];
        filtered = filtered.filter(property =>
          cityNames.some(name => name.toLowerCase() === property.city?.toLowerCase())
        );
      }
    }

    // District filter
    if (districtFilter !== "all") {
      const selectedDistrict = districts.find(district => district.id === districtFilter);
      if (selectedDistrict) {
        const districtNames = [selectedDistrict.name_ar, selectedDistrict.name_en, selectedDistrict.name_tr];
        filtered = filtered.filter(property =>
          districtNames.some(name => name.toLowerCase() === property.district?.toLowerCase())
        );
      }
    }

    // Property type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(property => property.property_type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    // Listing type filter
    if (listingTypeFilter !== "all") {
      filtered = filtered.filter(property => property.listing_type === listingTypeFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title || a.title_ar || a.title_en || '';
          bValue = b.title || b.title_ar || b.title_en || '';
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'views_count':
          aValue = a.views_count || 0;
          bValue = b.views_count || 0;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at || '').getTime();
          bValue = new Date(b.created_at || '').getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [properties, searchTerm, cityFilter, districtFilter, typeFilter, statusFilter, listingTypeFilter, sortBy, sortOrder, cities, districts]);

  const handleRefresh = async () => {
    console.log('Refreshing properties...');
    await fetchProperties();
  };

  const handleOpenProperty = (propertyId: string) => {
    window.open(`/property/${propertyId}`, '_blank');
  };

  const handleExportProperties = () => {
    // Create CSV content
    const headers = ['Title', 'City', 'District', 'Type', 'Status', 'Listing Type', 'Price', 'Views', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...filteredProperties.map(property => [
        property.title || property.title_ar || property.title_en || 'No Title',
        property.city || '',
        property.district || '',
        property.property_type || '',
        property.status || '',
        property.listing_type || '',
        property.price || 0,
        property.views_count || 0,
        new Date(property.created_at || '').toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get available districts for selected city
  const availableDistricts = useMemo(() => {
    if (cityFilter === "all") return districts;
    return districts.filter(district => district.city_id === cityFilter);
  }, [districts, cityFilter]);

  // Reset district filter when city changes
  const handleCityChange = (value: string) => {
    setCityFilter(value);
    setDistrictFilter("all");
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
          {currentLanguage === 'ar' ? `المستخدم: ${user.email}` : `User: ${user.email}`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentLanguage === 'ar' ? 'إدارة العقارات' : 'Property Management'}
          </h1>
          <p className="text-muted-foreground">
            {currentLanguage === 'ar'
              ? 'مراجعة وإدارة جميع العقارات المسجلة في الموقع'
              : 'Review and manage all registered properties on the platform'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'إضافة عقار جديد' : 'Add New Property'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-500" />
              <CardTitle>
                {currentLanguage === 'ar' ? 'قائمة العقارات' : 'Properties List'}
                <span className="text-sm font-normal text-gray-500 mr-2">
                  ({filteredProperties.length} {currentLanguage === 'ar' ? 'عقار' : 'properties'})
                </span>
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" />
              </Button>

              {/* Export Button */}
              <Button
                onClick={handleExportProperties}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'تصدير' : 'Export'}
              </Button>
            </div>
          </div>

          <CardDescription>
            {currentLanguage === 'ar'
              ? 'إدارة جميع العقارات المضافة إلى النظام'
              : 'Manage all properties added to the system'
            }
          </CardDescription>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={currentLanguage === 'ar' ? 'البحث بالعنوان أو المدينة أو المنطقة...' : 'Search by title, city, district, or owner name...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* City Filter */}
              <Select value={cityFilter} onValueChange={handleCityChange}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={currentLanguage === 'ar' ? 'المدينة' : 'City'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{currentLanguage === 'ar' ? 'جميع المدن' : 'All Cities'}</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {currentLanguage === 'ar' ? city.name_ar :
                       currentLanguage === 'tr' ? city.name_tr : city.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* District Filter */}
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={currentLanguage === 'ar' ? 'المنطقة' : 'District'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{currentLanguage === 'ar' ? 'جميع المناطق' : 'All Districts'}</SelectItem>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {currentLanguage === 'ar' ? district.name_ar :
                       currentLanguage === 'tr' ? district.name_tr : district.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Property Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={currentLanguage === 'ar' ? 'نوع العقار' : 'Property Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{currentLanguage === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                  <SelectItem value="apartment">{currentLanguage === 'ar' ? 'شقة' : currentLanguage === 'tr' ? 'Daire' : 'Apartment'}</SelectItem>
                  <SelectItem value="villa">{currentLanguage === 'ar' ? 'فيلا' : currentLanguage === 'tr' ? 'Villa' : 'Villa'}</SelectItem>
                  <SelectItem value="studio">{currentLanguage === 'ar' ? 'استوديو' : currentLanguage === 'tr' ? 'Stüdyo' : 'Studio'}</SelectItem>
                  <SelectItem value="house">{currentLanguage === 'ar' ? 'منزل' : currentLanguage === 'tr' ? 'Ev' : 'House'}</SelectItem>
                  <SelectItem value="office">{currentLanguage === 'ar' ? 'مكتب' : currentLanguage === 'tr' ? 'Ofis' : 'Office'}</SelectItem>
                  <SelectItem value="shop">{currentLanguage === 'ar' ? 'محل تجاري' : currentLanguage === 'tr' ? 'Dükkan' : 'Shop'}</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={currentLanguage === 'ar' ? 'الحالة' : 'Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{currentLanguage === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                  <SelectItem value="available">{currentLanguage === 'ar' ? 'متاح' : currentLanguage === 'tr' ? 'Müsait' : 'Available'}</SelectItem>
                  <SelectItem value="pending">{currentLanguage === 'ar' ? 'معلق' : currentLanguage === 'tr' ? 'Beklemede' : 'Pending'}</SelectItem>
                  <SelectItem value="sold">{currentLanguage === 'ar' ? 'مباع' : currentLanguage === 'tr' ? 'Satıldı' : 'Sold'}</SelectItem>
                  <SelectItem value="rented">{currentLanguage === 'ar' ? 'مؤجر' : currentLanguage === 'tr' ? 'Kiralandı' : 'Rented'}</SelectItem>
                  <SelectItem value="hidden">{currentLanguage === 'ar' ? 'مخفي' : currentLanguage === 'tr' ? 'Gizli' : 'Hidden'}</SelectItem>
                </SelectContent>
              </Select>

              {/* Listing Type Filter */}
              <Select value={listingTypeFilter} onValueChange={setListingTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={currentLanguage === 'ar' ? 'نوع الإعلان' : 'Listing Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{currentLanguage === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                  <SelectItem value="for_sale">{currentLanguage === 'ar' ? 'للبيع' : currentLanguage === 'tr' ? 'Satılık' : 'For Sale'}</SelectItem>
                  <SelectItem value="for_rent">{currentLanguage === 'ar' ? 'للإيجار' : currentLanguage === 'tr' ? 'Kiralık' : 'For Rent'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={currentLanguage === 'ar' ? 'ترتيب حسب' : 'Sort by'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">{currentLanguage === 'ar' ? 'تاريخ الإضافة' : 'Created Date'}</SelectItem>
                  <SelectItem value="title">{currentLanguage === 'ar' ? 'العنوان' : 'Title'}</SelectItem>
                  <SelectItem value="price">{currentLanguage === 'ar' ? 'السعر' : 'Price'}</SelectItem>
                  <SelectItem value="views_count">{currentLanguage === 'ar' ? 'المشاهدات' : 'Views'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">{currentLanguage === 'ar' ? 'تنازلي' : 'Descending'}</SelectItem>
                  <SelectItem value="asc">{currentLanguage === 'ar' ? 'تصاعدي' : 'Ascending'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>{currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-8">
              <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                {currentLanguage === 'ar' ? 'لا توجد عقارات' : 'No properties found'}
              </p>
              <p className="text-sm text-gray-500">
                {currentLanguage === 'ar' ? 'جرب تغيير الفلاتر أو إضافة عقار جديد' : 'Try changing filters or add a new property'}
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onToggleStatus={(id, currentStatus) => togglePropertyStatus(id, currentStatus)}
                      onToggleHide={(id, currentStatus) => toggleHideStatus(id, currentStatus)}
                      onToggleSold={(id, currentStatus) => toggleSoldStatus(id, currentStatus)}
                      onDelete={(id) => deleteProperty(id)}
                      onToggleFeatured={(id, currentFeatured) => toggleFeaturedStatus(id, currentFeatured)}
                      onOpenProperty={handleOpenProperty}
                      onEdit={(property) => {
                        // Add edit functionality here
                        console.log('Edit property:', property.id);
                        // You can add a modal or navigate to edit page
                      }}
                    />
                  ))}
                </div>
              ) : (
                <PropertiesTable
                  properties={filteredProperties}
                  loading={loading}
                  onToggleStatus={(id, currentStatus) => togglePropertyStatus(id, currentStatus)}
                  onDelete={(id) => deleteProperty(id)}
                  onToggleFeatured={(id, currentFeatured) => toggleFeaturedStatus(id, currentFeatured)}
                  onRefresh={fetchProperties}
                  onOpenProperty={handleOpenProperty}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Property Form */}
      {showAddForm && (
        <PropertyForm
          onSubmit={addProperty}
          onCancel={() => setShowAddForm(false)}
          isSubmitting={addingProperty}
        />
      )}
    </div>
  );
};

export default PropertyManagement;
