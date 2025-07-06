
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image } from "lucide-react";

interface CoverImageUploadProps {
  onImageChange: (url: string) => void;
  currentImage?: string;
}

const CoverImageUpload = ({ onImageChange, currentImage }: CoverImageUploadProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || '');

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cover-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      setPreview(imageUrl);
      onImageChange(imageUrl);

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully'
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error.message || (currentLanguage === 'ar' ? 'فشل في رفع الصورة' : 'Failed to upload image'),
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يجب أن يكون الملف صورة' : 'File must be an image',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' : 'Image size must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    uploadFile(file);
  };

  const removeImage = () => {
    setPreview('');
    onImageChange('');
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">
        {currentLanguage === 'ar' ? 'صورة الغلاف (مطلوبة) *' : 'Cover Image (Required) *'}
      </Label>
      <p className="text-sm text-gray-600">
        {currentLanguage === 'ar' ? 'هذه الصورة ستظهر على الصفحة الرئيسية' : 'This image will appear on the homepage'}
      </p>

      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Cover preview" 
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            {currentLanguage === 'ar' ? 'اختر صورة الغلاف' : 'Choose cover image'}
          </p>
          
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button type="button" disabled={uploading} className="pointer-events-none">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {currentLanguage === 'ar' ? 'جارٍ الرفع...' : 'Uploading...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {currentLanguage === 'ar' ? 'رفع صورة' : 'Upload Image'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        {currentLanguage === 'ar' ? 'الحد الأقصى للحجم: 5 ميجابايت. الصيغ المدعومة: JPG, PNG, GIF' : 'Max size: 5MB. Supported formats: JPG, PNG, GIF'}
      </p>
    </div>
  );
};

export default CoverImageUpload;
