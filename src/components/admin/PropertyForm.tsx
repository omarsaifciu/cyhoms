
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewPropertyForm } from "@/types/property";
import BasicInfoTab from "./property-form/BasicInfoTab";
import MultiLanguageTab from "./property-form/MultiLanguageTab";
import MediaTab from "./property-form/MediaTab";
import PropertyFormActions from "./property-form/PropertyFormActions";
import { usePropertyFormData } from "./property-form/usePropertyFormData";

interface PropertyFormProps {
  onSubmit: (property: NewPropertyForm) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const PropertyForm = ({ onSubmit, onCancel, isSubmitting }: PropertyFormProps) => {
  const { t } = useLanguage();
  const {
    formData,
    setFormData,
    handlePropertyTypeChange,
    resetForm,
    isFormValid
  } = usePropertyFormData();

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      resetForm();
      onCancel();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('addNewProperty')}</CardTitle>
        <CardDescription>
          {t('fill_form_add_new_property')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">{t('basicInfo')}</TabsTrigger>
            <TabsTrigger value="multilang">{t('multipleLanguages')}</TabsTrigger>
            <TabsTrigger value="media">{t('mediaAdmin')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInfoTab
              formData={formData}
              setFormData={setFormData}
              handlePropertyTypeChange={handlePropertyTypeChange}
            />
          </TabsContent>

          <TabsContent value="multilang">
            <MultiLanguageTab
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="media">
            <MediaTab
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>
        </Tabs>

        <PropertyFormActions
          onCancel={onCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isValid={isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
