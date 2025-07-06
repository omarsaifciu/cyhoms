
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileSearchProps {
  setIsMenuOpen: (open: boolean) => void;
}

const MobileSearch = ({ setIsMenuOpen }: MobileSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    } else {
      navigate('/');
      setIsMenuOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    navigate('/');
  };

  return (
    <div className="px-4">
      <form
        onSubmit={handleMobileSearch}
        className="
          flex items-center 
          p-1
          rounded-full
          border-2
          bg-white dark:bg-[#151826]
          border-[#57bfc9] 
          shadow-sm hover:shadow-md transition-shadow duration-300
          relative
        "
        style={{
          // متناسق مع الديسكتوب للداكن والفاتح
        }}
      >
        <div className="flex items-center flex-1">
          <div className="px-4 py-2 flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLanguage === 'ar' ? "ابحث عن العقارات..." :
                currentLanguage === 'tr' ? "Mülk ara..." :
                  "Search properties..."}
              className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            />
          </div>
          {searchQuery && (
            <Button
              type="button"
              onClick={clearSearch}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white px-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            className={`rounded-full shadow-none text-white border-2 border-[#57bfc9] focus:ring-2 focus:ring-[#57bfc9] transition-all duration-300 hover:brightness-95 ${
              currentLanguage === 'ar' ? '' : 'ml-2'
            }`}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              background: 'linear-gradient(to right, var(--brand-gradient-from-color, #ec489a), var(--brand-gradient-to-color, #f43f5e))'
            }}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MobileSearch;

