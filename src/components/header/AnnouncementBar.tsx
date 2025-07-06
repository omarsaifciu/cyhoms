
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AnnouncementBar = () => {
  const { settings, loading } = useSiteSettings();
  const { currentLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  const text = 
    currentLanguage === 'ar' ? settings.announcementBarTextAr :
    currentLanguage === 'tr' ? settings.announcementBarTextTr :
    settings.announcementBarTextEn;

  if (loading || !settings.announcementBarEnabled || !isVisible || !text) {
    return null;
  }
  
  const barContent = (
    <p className="font-medium text-sm">
      {text}
    </p>
  );

  return (
    <div 
      className="px-4 py-2 relative text-center w-full"
      style={{
        backgroundColor: settings.announcementBarBackgroundColor,
        color: settings.announcementBarTextColor,
      }}
    >
        <div className="flex items-center justify-center">
            {settings.announcementBarLink ? (
                <a href={settings.announcementBarLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {barContent}
                </a>
            ) : (
                barContent
            )}
        </div>
      <button
        onClick={() => setIsVisible(false)}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors",
          currentLanguage === 'ar' ? 'left-2' : 'right-2'
        )}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
