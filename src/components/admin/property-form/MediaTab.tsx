
import { useLanguage } from "@/contexts/LanguageContext";
import MediaUpload from "../MediaUpload";
import CoverImageUpload from "../../property/CoverImageUpload";
import { NewPropertyForm } from "@/types/property";

interface MediaTabProps {
  formData: NewPropertyForm;
  setFormData: React.Dispatch<React.SetStateAction<NewPropertyForm>>;
}

const MediaTab = ({ formData, setFormData }: MediaTabProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="space-y-6">
      <CoverImageUpload
        onImageChange={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
        currentImage={formData.cover_image}
      />
      
      <MediaUpload
        onFilesChange={(files) => setFormData(prev => ({ ...prev, images: files }))}
        existingFiles={formData.images}
      />
    </div>
  );
};

export default MediaTab;
