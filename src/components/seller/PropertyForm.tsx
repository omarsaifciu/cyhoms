import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePropertyFormData } from "./usePropertyFormData";
import BasicInfoTab from "./BasicInfoTab";
import MultiLanguageTab from "./MultiLanguageTab";
import MediaTab from "./MediaTab";
import PropertyFormActions from "./PropertyFormActions";
import { NewPropertyForm } from "@/types/property";
import { Ban, TrendingUp } from "lucide-react";
import { useUserPropertyLimit } from "@/hooks/useUserPropertyLimit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PropertyFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  editingProperty?: Property | null;
}

const PropertyForm = ({ onCancel, onSuccess, editingProperty }: PropertyFormProps) => {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const { propertyLimit, currentCount, canAdd, loading: limitLoading } = useUserPropertyLimit();
  const [loading, setLoading] = useState(false);
  
  const {
    formData,
    setFormData,
    availableDistricts,
    handleCityChange,
    handlePropertyTypeChange
  } = usePropertyFormData(editingProperty);

  // Check if user is suspended
  if (profile?.is_suspended) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="text-center">
          <Ban className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-red-600">
            {t('accountSuspended')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {t('accountSuspendedPropertyMessage')}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Check property limit for new properties
  if (!editingProperty && !limitLoading && !canAdd) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center py-8 px-4 relative overflow-hidden transition-all duration-500"
        style={{
          background: `
            linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent),
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 2%, transparent)
            ),
            linear-gradient(to bottom right,
              #fafbff 0%,
              #f1f5f9 50%,
              #e2e8f0 100%
            )
          `,
          // Dark mode background
          ...(typeof window !== 'undefined' && document.documentElement.classList.contains('dark') && {
            background: `
              linear-gradient(135deg,
                color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent),
                color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent)
              ),
              linear-gradient(to bottom right,
                #0f172a 0%,
                #1e293b 50%,
                #334155 100%
              )
            `
          })
        }}
      >
        {/* Animated background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main gradient overlays */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10"
            style={{
              background: `linear-gradient(135deg,
                color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent) 0%,
                transparent 50%,
                color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent) 100%
              )`
            }}
          />

          {/* Floating elements */}
          <div
            className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse delay-1000 opacity-3 dark:opacity-5"
            style={{
              background: `linear-gradient(135deg,
                color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 6%, transparent),
                color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent)
              )`
            }}
          />
          <div
            className="absolute bottom-20 right-20 w-48 h-48 rounded-full blur-2xl animate-pulse delay-500 opacity-4 dark:opacity-6"
            style={{
              background: `linear-gradient(135deg,
                color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent),
                color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent)
              )`
            }}
          />

          {/* Additional atmospheric elements */}
          <div
            className="absolute top-10 right-10 w-32 h-32 rounded-full blur-2xl animate-pulse delay-200 opacity-5 dark:opacity-8"
            style={{
              background: `linear-gradient(135deg,
                color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 5%, transparent),
                color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent)
              )`
            }}
          />
          <div
            className="absolute bottom-32 left-10 w-40 h-40 rounded-full blur-3xl animate-pulse delay-800 opacity-4 dark:opacity-6"
            style={{
              background: `linear-gradient(135deg,
                color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent),
                color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent)
              )`
            }}
          />

          {/* Animated house icons */}
          <div className="absolute top-1/4 left-1/4 opacity-10 dark:opacity-20 animate-bounce delay-1000">
            <div className="w-8 h-8 text-orange-400">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
          </div>

          <div className="absolute top-1/3 right-1/4 opacity-8 dark:opacity-15 animate-pulse delay-2000">
            <div className="w-6 h-6 text-pink-400">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
          </div>

          <div className="absolute bottom-1/3 left-1/3 opacity-12 dark:opacity-25 animate-bounce delay-500">
            <div className="w-7 h-7 text-orange-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
          </div>

          <div className="absolute top-2/3 right-1/3 opacity-9 dark:opacity-18 animate-pulse delay-1500">
            <div className="w-5 h-5 text-pink-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
          </div>

          <div className="absolute bottom-1/4 right-1/5 opacity-11 dark:opacity-22 animate-bounce delay-3000">
            <div className="w-6 h-6 text-orange-300">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="text-center pt-6 pb-6">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-orange-500/10 dark:ring-orange-400/20"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                }}
              >
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                {currentLanguage === 'ar' ? 'تم الوصول للحد الأقصى' :
                 currentLanguage === 'tr' ? 'Limit Ulaşıldı' : 'Limit Reached'}
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {currentLanguage === 'ar'
                  ? `لقد وصلت للحد الأقصى من العقارات المسموح بها (${currentCount}/${propertyLimit}). لا يمكنك إضافة المزيد من العقارات.`
                  : currentLanguage === 'tr'
                    ? `İzin verilen mülk sınırına ulaştınız (${currentCount}/${propertyLimit}). Daha fazla mülk ekleyemezsiniz.`
                    : `You have reached your property limit (${currentCount}/${propertyLimit}). You cannot add more properties.`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-12">
              <Button
                onClick={onCancel}
                className="w-full h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:brightness-95"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
                }}
              >
                {currentLanguage === 'ar' ? 'العودة' :
                 currentLanguage === 'tr' ? 'Geri Dön' : 'Go Back'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Patch: ensure is_featured is always defined on formData (guard/default, 
  // in case old data/hook doesn't include it)
  const patchedFormData = { is_featured: false, ...formData };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is suspended before allowing submission
      if (profile?.is_suspended) {
        toast({
          title: t('error'),
          description: t('accountSuspendedPropertyMessage'),
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Check property limit for new properties
      if (!editingProperty && !canAdd) {
        toast({
          title: t('error'),
          description: currentLanguage === 'ar' 
            ? 'لقد وصلت للحد الأقصى من العقارات المسموح بها'
            : 'You have reached your property limit',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Validation
      
      // 1. Titles: at least one language required
      if (!formData.title_ar.trim() && !formData.title_en.trim() && !formData.title_tr.trim()) {
        toast({
          title: t('error'),
          description: t('titleRequiredInOneLanguage'),
          variant: 'destructive'
        });
        setLoading(false); return;
      }

      // 2. Price required & > 0
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast({
          title: t('error'),
          description: t('priceRequiredAndPositive'),
          variant: 'destructive'
        });
        setLoading(false); return;
      }

      // 3. City, property_type required
      if (!formData.city || !formData.property_type) {
        toast({
          title: t('error'),
          description: t('cityAndTypeRequired'),
          variant: 'destructive'
        });
        setLoading(false); return;
      }

      // 4. Cover image required
      if (!formData.cover_image) {
        toast({
          title: t('error'),
          description: currentLanguage === "ar" ? "صورة الغلاف مطلوبة" : currentLanguage === "tr" ? "Kapak fotoğrafı gereklidir" : "Cover image is required",
          variant: 'destructive'
        });
        setLoading(false); return;
      }

      // 5. Bedrooms (required, must be > 0)
      if (!formData.bedrooms || parseInt(formData.bedrooms) <= 0) {
        toast({
          title: t('error'),
          description: currentLanguage === "ar"
            ? "عدد غرف النوم مطلوب"
            : currentLanguage === "tr"
              ? "Yatak odası sayısı zorunludur"
              : "Bedrooms count is required",
          variant: 'destructive'
        });
        setLoading(false); return;
      }

      // 6. Bathrooms (required, must be > 0)
      if (!formData.bathrooms || parseInt(formData.bathrooms) <= 0) {
        toast({
          title: t('error'),
          description: currentLanguage === "ar"
            ? "عدد الحمامات مطلوب"
            : currentLanguage === "tr"
              ? "Banyo sayısı zorunludur"
              : "Bathrooms count is required",
          variant: 'destructive'
        });
        setLoading(false); return;
      }

      // 7. Area (required, must be > 0)
      if (!formData.area || parseFloat(formData.area) <= 0) {
        toast({
          title: t('error'),
          description: currentLanguage === "ar"
            ? "المساحة مطلوبة"
            : currentLanguage === "tr"
              ? "Alan zorunludur"
              : "Area is required",
          variant: 'destructive'
        });
        setLoading(false); return;
      }

      const propertyData = {
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
        is_student_housing: Boolean(formData.is_student_housing),
        student_housing_gender: formData.is_student_housing ? (formData.student_housing_gender || 'unspecified') : 'unspecified'
      };

      console.log('Saving property with complete data:', {
        is_student_housing: propertyData.is_student_housing,
        student_housing_gender: propertyData.student_housing_gender,
        property_type_id: propertyData.property_type_id,
        city: propertyData.city,
        district: propertyData.district
      });

      let result;
      if (editingProperty) {
        console.log('Updating existing property:', editingProperty.id);
        result = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select();
      } else {
        console.log('Creating new property with user ID:', profile?.id);
        result = await supabase
          .from('properties')
          .insert([{ ...propertyData, created_by: profile?.id }])
          .select();
      }

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      console.log('Property saved successfully:', result.data);

      toast({
        title: t('success'),
        description: editingProperty 
          ? t('propertyUpdatedSuccess')
          : t('propertyAddedSuccess')
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: t('error'),
        description: t('failedToSaveProperty'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>
          {editingProperty 
            ? t('editProperty')
            : t('addNewProperty')
          }
        </CardTitle>
        <CardDescription>
          {t('propertyDetails')}
          {!editingProperty && !limitLoading && (
            <div className="mt-2 text-sm">
              <Badge variant="outline" className="mr-2">
                {currentLanguage === 'ar' 
                  ? `العقارات: ${currentCount}/${propertyLimit}`
                  : `Properties: ${currentCount}/${propertyLimit}`
                }
              </Badge>
              {propertyLimit - currentCount <= 2 && (
                <span className="text-orange-600">
                  {currentLanguage === 'ar' 
                    ? `متبقي ${propertyLimit - currentCount} عقارات فقط`
                    : `Only ${propertyLimit - currentCount} properties left`
                  }
                </span>
              )}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">{t('basicInfo')}</TabsTrigger>
            <TabsTrigger value="multilang">{t('multipleLanguages')}</TabsTrigger>
            <TabsTrigger value="media">{t('mediaSeller')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <BasicInfoTab
              formData={patchedFormData}
              setFormData={setFormData as React.Dispatch<React.SetStateAction<typeof patchedFormData>>}
              handlePropertyTypeChange={handlePropertyTypeChange}
            />
          </TabsContent>

          <TabsContent value="multilang" className="space-y-4">
            <MultiLanguageTab
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <MediaTab
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>
        </Tabs>

        <PropertyFormActions
          onCancel={onCancel}
          onSubmit={handleSubmit}
          loading={loading}
          editingProperty={editingProperty}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
