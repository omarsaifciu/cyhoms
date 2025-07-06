
import { Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BackgroundUploadSectionProps {
  uploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BackgroundUploadSection = ({ uploading, onFileUpload }: BackgroundUploadSectionProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <input
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        className="hidden"
        id="hero-bg-upload"
        disabled={uploading}
      />
      <label htmlFor="hero-bg-upload" className="cursor-pointer">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          {uploading
            ? (currentLanguage === 'ar' ? 'جارٍ الرفع...' : 'Uploading...')
            : (currentLanguage === 'ar' 
              ? 'اضغط لرفع صورة خلفية جديدة'
              : 'Click to upload a new background image'
            )
          }
        </p>
        <p className="text-xs text-gray-500">
          {currentLanguage === 'ar' ? 'الحد الأقصى 10 ميجابايت' : 'Max 10MB'}
        </p>
      </label>
    </div>
  );
};

export default BackgroundUploadSection;
