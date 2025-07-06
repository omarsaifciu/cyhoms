
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileSearchButtonProps {
  onSearch: () => void;
}

const MobileSearchButton = ({ onSearch }: MobileSearchButtonProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <Button 
      onClick={onSearch}
      className="w-full text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:brightness-95"
      style={{
        background: 'linear-gradient(to right, var(--brand-gradient-from-color, #ec489a), var(--brand-gradient-to-color, #f43f5e))'
      }}
    >
      <Search className={`w-5 h-5 ${currentLanguage === 'ar' ? '' : 'mr-2'}`} />
      {currentLanguage === 'ar' ? 'بحث' : 
       currentLanguage === 'tr' ? 'Ara' : 
       'Search'}
    </Button>
  );
};

export default MobileSearchButton;
