
import { ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BackgroundCard from "./BackgroundCard";

interface HeroBackground {
  id: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

interface BackgroundGridProps {
  backgrounds: HeroBackground[];
  onSetActive: (id: string) => void;
  onDelete: (id: string, imageUrl: string) => void;
}

const BackgroundGrid = ({ backgrounds, onSetActive, onDelete }: BackgroundGridProps) => {
  const { currentLanguage } = useLanguage();

  if (backgrounds.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>
          {currentLanguage === 'ar' 
            ? 'لا توجد صور خلفية. قم برفع الصورة الأولى'
            : 'No background images. Upload your first image'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {backgrounds.map((bg) => (
        <BackgroundCard
          key={bg.id}
          background={bg}
          onSetActive={onSetActive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BackgroundGrid;
