
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Update search query from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // If search is empty, clear the search param
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    navigate('/');
  };

  return (
    <div className="hidden lg:flex flex-1 justify-center max-w-2xl mx-4">
      <form
        onSubmit={handleSearch}
        className="w-full
          rounded-full
          border-0
          shadow-sm
          hover:shadow-md
          transition-shadow duration-300
          p-1
          bg-white dark:bg-[#151826]
          relative
        "
        style={{
          border: "2px solid #57bfc9",
        }}
      >
        <div className="flex items-center">
          <div className="flex-1 px-4 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLanguage === 'ar'
                  ? "ابحث عن العقارات..."
                  : currentLanguage === 'tr'
                    ? "Mülk ara..."
                    : "Search properties..."
              }
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

export default SearchBar;
