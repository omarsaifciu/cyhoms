
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchQueryDisplayProps {
  searchQuery: string;
  filteredPropertiesCount: number;
  clearSearchHandler: () => void;
}

const SearchQueryDisplay: React.FC<SearchQueryDisplayProps> = ({
  searchQuery,
  filteredPropertiesCount,
  clearSearchHandler,
}) => {
  const { t, currentLanguage } = useLanguage();

  if (!searchQuery) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-pink-800">
              {currentLanguage === 'ar' ? 'نتائج البحث عن:' : 
               currentLanguage === 'tr' ? 'Arama sonuçları:' : 
               'Search results for:'} "{searchQuery}"
            </h2>
            <p className="text-sm text-pink-600 mt-1">
              {filteredPropertiesCount} {currentLanguage === 'ar' ? 'عقار موجود' : 
               currentLanguage === 'tr' ? 'mülk bulundu' : 
               'properties found'}
            </p>
          </div>
          <button
            onClick={clearSearchHandler}
            className="text-pink-600 hover:text-pink-800 font-medium"
          >
            {currentLanguage === 'ar' ? 'مسح البحث' : 
             currentLanguage === 'tr' ? 'Aramayı Temizle' : 
             'Clear Search'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchQueryDisplay;
