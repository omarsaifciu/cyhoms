
import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyVideoProps {
  videoUrl: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  isSelected?: boolean;
  onOpenLightbox?: () => void;
}

const PropertyVideo = ({ videoUrl, title, isActive, onClick, isSelected, onOpenLightbox }: PropertyVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useLanguage();

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = e.currentTarget.parentElement?.querySelector('video');
    if (video) {
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = e.currentTarget.parentElement?.querySelector('video');
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  // إذا كان الفيديو نشطاً (في المنطقة الرئيسية)، اعرضه كبيراً
  if (isActive) {
    return (
      <div className="relative w-full h-full flex items-center justify-center" onClick={onOpenLightbox}>
        <video
          id="main-video"
          src={videoUrl}
          className="w-full h-full object-contain"
          controls
          onClick={(e) => e.stopPropagation()}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold pointer-events-none">
          {t('video')}
        </div>
      </div>
    );
  }

  // إذا لم يكن نشطاً، اعرضه كصورة مصغرة صغيرة
  return (
    <div
      className={cn(
        "relative w-20 h-20 cursor-pointer border-2 rounded-lg overflow-hidden transition-colors hover:border-brand-accent",
        isSelected ? "border-brand-accent" : "border-gray-200"
      )}
      onClick={onClick}
    >
      <div
        className="w-full h-full bg-gray-200 bg-cover bg-center"
        style={{
          backgroundImage: `url(${videoUrl}#t=1)`
        }}
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <Play className="w-4 h-4 text-white" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs px-1 py-0.5 text-center">
        {t('video')}
      </div>
    </div>
  );
};

export default PropertyVideo;
