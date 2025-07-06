
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image, Video } from "lucide-react";

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface MediaUploadProps {
  onFilesChange: (files: string[]) => void;
  existingFiles?: string[];
}

const MediaUpload = ({ onFilesChange, existingFiles = [] }: MediaUploadProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingFiles);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
      
      if (!isImage && !isVideo) {
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'يرجى اختيار صور أو فيديوهات فقط' : 'Please select images or videos only',
          variant: 'destructive'
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'حجم الملف يجب أن يكون أقل من 50 ميجابايت' : 'File size must be less than 50MB',
          variant: 'destructive'
        });
        return false;
      }
      
      return true;
    });

    const newMediaFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' as const : 'video' as const
    }));

    setMediaFiles(prev => [...prev, ...newMediaFiles]);
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeUploadedFile = (url: string) => {
    setUploadedUrls(prev => {
      const newUrls = prev.filter(u => u !== url);
      onFilesChange(newUrls);
      return newUrls;
    });
  };

  const uploadFiles = async () => {
    if (mediaFiles.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const mediaFile of mediaFiles) {
        const fileExt = mediaFile.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-media')
          .upload(filePath, mediaFile.file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('property-media')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      const allUrls = [...uploadedUrls, ...newUrls];
      setUploadedUrls(allUrls);
      onFilesChange(allUrls);
      
      // Clear preview files
      mediaFiles.forEach(file => URL.revokeObjectURL(file.preview));
      setMediaFiles([]);

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم رفع الملفات بنجاح' : 'Files uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في رفع الملفات' : 'Failed to upload files',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {currentLanguage === 'ar' ? 'الصور والفيديوهات' : 'Images and Videos'}
        </label>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="media-upload"
          />
          <label htmlFor="media-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {currentLanguage === 'ar' 
                ? 'اضغط لاختيار الصور والفيديوهات أو اسحبها هنا'
                : 'Click to select images and videos or drag them here'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {currentLanguage === 'ar' ? 'الحد الأقصى 50 ميجابايت لكل ملف' : 'Max 50MB per file'}
            </p>
          </label>
        </div>
      </div>

      {/* Preview selected files */}
      {mediaFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              {currentLanguage === 'ar' ? 'الملفات المختارة' : 'Selected Files'}
            </h4>
            <Button 
              onClick={uploadFiles} 
              disabled={uploading}
              size="sm"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {currentLanguage === 'ar' ? 'جارٍ الرفع...' : 'Uploading...'}
                </>
              ) : (
                currentLanguage === 'ar' ? 'رفع الملفات' : 'Upload Files'
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaFiles.map((mediaFile, index) => (
              <div key={index} className="relative group">
                {mediaFile.type === 'image' ? (
                  <img 
                    src={mediaFile.preview} 
                    alt="Preview" 
                    className="w-full h-24 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 rounded border flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display uploaded files */}
      {uploadedUrls.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">
            {currentLanguage === 'ar' ? 'الملفات المرفوعة' : 'Uploaded Files'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative group">
                {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img 
                    src={url} 
                    alt="Uploaded" 
                    className="w-full h-24 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 rounded border flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeUploadedFile(url)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
