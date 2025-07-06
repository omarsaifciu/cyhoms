
import ImageUpload from "./ImageUpload";

interface MediaTabProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const MediaTab = ({ formData, setFormData }: MediaTabProps) => {
  return (
    <ImageUpload
      onCoverImageChange={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
      onImagesChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
      coverImage={formData.cover_image}
      images={formData.images}
    />
  );
};

export default MediaTab;
