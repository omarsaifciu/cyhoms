
import { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

const AvatarUpload = ({ currentAvatarUrl, userName, onAvatarUpdate }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const getUserInitials = () => {
    if (!userName) return "??";
    const names = userName.split(' ').filter(Boolean);
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف صورة صالح",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      console.log('Uploading avatar:', fileName);

      // Delete existing avatar if it exists
      if (currentAvatarUrl) {
        const existingPath = currentAvatarUrl.split('/').pop();
        if (existingPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${existingPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Avatar uploaded successfully:', publicUrl);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      onAvatarUpdate(publicUrl);
      setPreview(null);

      toast({
        title: "تم بنجاح",
        description: "تم تحديث الصورة الشخصية بنجاح"
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "خطأ",
        description: "فشل في رفع الصورة. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user || !currentAvatarUrl) return;

    setUploading(true);
    try {
      console.log('Removing avatar...');

      // Remove from storage
      const existingPath = currentAvatarUrl.split('/').pop();
      if (existingPath) {
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${existingPath}`]);
      }

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      onAvatarUpdate('');

      toast({
        title: "تم بنجاح",
        description: "تم حذف الصورة الشخصية بنجاح"
      });

    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الصورة. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      <Avatar className="w-24 h-24 ring-4 ring-brand-accent-light transition-all duration-300 hover:ring-brand-accent-light-hover">
        <AvatarImage src={preview || currentAvatarUrl} />
        <AvatarFallback className="text-white text-xl bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>

      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="avatar-upload"
            disabled={uploading}
          />
          <label htmlFor="avatar-upload">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full p-2 h-8 w-8"
              disabled={uploading}
              asChild
            >
              <span className="cursor-pointer">
                {uploading ? (
                  <Upload className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </span>
            </Button>
          </label>

          {currentAvatarUrl && (
            <Button
              size="sm"
              variant="destructive"
              className="rounded-full p-2 h-8 w-8"
              onClick={removeAvatar}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
          <Upload className="w-6 h-6 text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
