
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchButtonProps {
  onSearch: () => void;
}

const SearchButton = ({ onSearch }: SearchButtonProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="p-2">
      <Button 
        onClick={onSearch}
        className="bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to hover:brightness-95 text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full lg:w-auto cursor-pointer"
      >
        <Search className={`w-5 h-5 ${currentLanguage === 'ar' ? '' : 'mr-2'}`} />
        {currentLanguage === 'ar' ? 'بحث' : 
         currentLanguage === 'tr' ? 'Ara' : 
         'Search'}
      </Button>
    </div>
  );
};

export default SearchButton;
