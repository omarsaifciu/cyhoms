
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroBackground {
  id: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

interface BackgroundCardProps {
  background: HeroBackground;
  onSetActive: (id: string) => void;
  onDelete: (id: string, imageUrl: string) => void;
}

const BackgroundCard = ({ background, onSetActive, onDelete }: BackgroundCardProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div 
      className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-300 ${
        background.is_active 
          ? 'border-blue-500 shadow-lg scale-105' 
          : 'border-gray-200 hover:border-gray-300 hover:scale-102'
      }`}
    >
      <div className="aspect-video relative">
        <img
          src={background.image_url}
          alt="Hero background"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {background.is_active && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            {currentLanguage === 'ar' ? 'نشط' : 'Active'}
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onSetActive(background.id)}
            className="bg-white text-gray-800 hover:bg-gray-100"
          >
            {background.is_active ? (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                {currentLanguage === 'ar' ? 'إلغاء التفعيل' : 'Deactivate'}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                {currentLanguage === 'ar' ? 'تفعيل' : 'Activate'}
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(background.id, background.image_url)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {currentLanguage === 'ar' ? 'حذف' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundCard;
