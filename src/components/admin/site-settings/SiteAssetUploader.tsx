
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface SiteAssetUploaderProps {
  label: string;
  value: string | null | undefined;
  onValueChange: (url: string | null) => void;
  bucketName: string;
  filePathPrefix?: string;
  t: (key: string) => string;
}

const SiteAssetUploader = ({ label, value, onValueChange, bucketName, filePathPrefix = '' }: SiteAssetUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${filePathPrefix}${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      if (value) {
        const oldFilePath = value.split(`${bucketName}/`).pop();
        if (oldFilePath) {
          await supabase.storage.from(bucketName).remove([oldFilePath]);
        }
      }

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      onValueChange(publicUrl);
      
      toast({
        title: currentLanguage === 'ar' ? 'تم رفع الملف' : 'File Uploaded',
        description: currentLanguage === 'ar' ? 'الرجاء الضغط على "حفظ جميع الإعدادات" لتطبيق التغيير.' : 'Please click "Save All Settings" to apply the change.',
      });

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ في الرفع' : 'Upload Error',
        description: error.message || (currentLanguage === 'ar' ? 'فشل رفع الملف.' : 'Failed to upload file.'),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveImage = async () => {
    if (!value) return;

    setUploading(true);
    try {
      const filePath = value.split(`${bucketName}/`).pop();
      if (filePath) {
        const { error } = await supabase.storage.from(bucketName).remove([filePath]);
        if (error) throw error;
      }
      onValueChange(null);
      toast({
        title: currentLanguage === 'ar' ? 'تمت إزالة الصورة' : 'Image Removed',
        description: currentLanguage === 'ar' ? 'الرجاء الضغط على "حفظ جميع الإعدادات" لتطبيق التغيير.' : 'Please click "Save All Settings" to apply the change.',
      });
    } catch(error: any) {
      console.error("Error removing image:", error);
       toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في إزالة الصورة.' : 'Failed to remove image.',
        variant: 'destructive',
      });
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="flex items-center gap-2">
            <img src={value} alt={label} className="w-24 h-24 object-contain rounded-md border p-1" />
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              disabled={uploading}
              aria-label="Remove image"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <div className="relative w-full">
            <Input 
              id={`uploader-${label}`} 
              type="file" 
              onChange={handleFileChange} 
              disabled={uploading} 
              accept="image/*,.svg"
              className="w-full"
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteAssetUploader;
