import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image, FileImage } from "lucide-react";

interface ImageUploadProps {
  onCoverImageChange: (url: string) => void;
  onImagesChange: (urls: string[]) => void;
  coverImage: string;
  images: string[];
}

const ImageUpload = ({ onCoverImageChange, onImagesChange, coverImage, images }: ImageUploadProps) => {
  const { currentLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      console.log('Uploading image:', fileName);

      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading) {
      console.log('Already uploading, preventing duplicate upload');
      return;
    }

    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
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

      const imageUrl = await uploadImage(file);
      
      if (imageUrl) {
        onCoverImageChange(imageUrl);
        toast({
          title: currentLanguage === 'ar' ? 'نجح' : 'Success',
          description: currentLanguage === 'ar' ? 'تم رفع صورة الغلاف بنجاح' : 'Cover image uploaded successfully'
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في رفع الصورة' : 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      // Clear the input value to allow re-uploading the same file
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading) {
      console.log('Already uploading, preventing duplicate upload');
      return;
    }

    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const files = Array.from(event.target.files);
      
      // Validate file types and sizes
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
            description: currentLanguage === 'ar' ? 'جميع الملفات يجب أن تكون صور' : 'All files must be images',
            variant: 'destructive'
          });
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
            description: currentLanguage === 'ar' ? 'حجم كل صورة يجب أن يكون أقل من 5 ميجابايت' : 'Each image size must be less than 5MB',
            variant: 'destructive'
          });
          return;
        }
      }

      const uploadPromises = files.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const successfulUploads = uploadedUrls.filter((url): url is string => url !== null);
      
      if (successfulUploads.length > 0) {
        onImagesChange([...images, ...successfulUploads]);
        toast({
          title: currentLanguage === 'ar' ? 'نجح' : 'Success',
          description: currentLanguage === 'ar' 
            ? `تم رفع ${successfulUploads.length} صورة بنجاح` 
            : `${successfulUploads.length} images uploaded successfully`
        });
      }
      
      if (successfulUploads.length < files.length) {
        toast({
          title: currentLanguage === 'ar' ? 'تحذير' : 'Warning',
          description: currentLanguage === 'ar' ? 'فشل في رفع بعض الصور' : 'Some images failed to upload',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في رفع الصور' : 'Failed to upload images',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      // Clear the input value to allow re-uploading the same files
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  const removeCoverImage = () => {
    onCoverImageChange('');
  };

  return (
    <div className="space-y-6">
      {/* Cover Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            {t('coverImageRequired')}
          </CardTitle>
          <CardDescription>
            {t('coverImageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {coverImage ? (
            <div className="relative">
              <img 
                src={coverImage} 
                alt="Cover"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeCoverImage}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => !uploading && coverInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {t('clickToUploadCover')}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {t('maxFileSize')}
              </p>
            </div>
          )}
          
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            className="hidden"
            disabled={uploading}
          />
          
          <Button 
            onClick={() => !uploading && coverInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                {currentLanguage === 'ar' ? 'جارٍ الرفع...' : currentLanguage === 'tr' ? 'Yükleniyor...' : 'Uploading...'}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t('uploadCoverImage')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Additional Images Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            {t('additionalImages')}
          </CardTitle>
          <CardDescription>
            {t('additionalImagesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 p-1 h-auto"
                    onClick={() => removeImage(index)}
                    disabled={uploading}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <input
            ref={imagesInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesUpload}
            className="hidden"
            disabled={uploading}
          />
          
          <Button 
            onClick={() => !uploading && imagesInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            className="w-full"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                {currentLanguage === 'ar' ? 'جارٍ الرفع...' : currentLanguage === 'tr' ? 'Yükleniyor...' : 'Uploading...'}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t('uploadAdditionalImages')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUpload;
