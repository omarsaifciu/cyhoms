
import { useLanguage } from "@/contexts/LanguageContext";
import { Building, Home, Key, GraduationCap } from "lucide-react";

interface PropertyTypeFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  propertyCounts: {
    all: number;
    sale: number;
    rent: number;
    student: number;
  };
}

const PropertyTypeFilter = ({ selectedFilter, onFilterChange, propertyCounts }: PropertyTypeFilterProps) => {
  const { currentLanguage } = useLanguage();

  const filters = [
    {
      id: 'all',
      label: currentLanguage === 'ar' ? 'جميع العقارات' : 
             currentLanguage === 'tr' ? 'Tüm Mülkler' : 
             'All Properties',
      icon: Building,
      count: propertyCounts.all,
      color: 'from-brand-gradient-from to-brand-gradient-to'
    },
    {
      id: 'sale',
      label: currentLanguage === 'ar' ? 'للبيع' : 
             currentLanguage === 'tr' ? 'Satılık' : 
             'For Sale',
      icon: Home,
      count: propertyCounts.sale,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'rent',
      label: currentLanguage === 'ar' ? 'للإيجار' : 
             currentLanguage === 'tr' ? 'Kiralık' : 
             'For Rent',
      icon: Key,
      count: propertyCounts.rent,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'student',
      label: currentLanguage === 'ar' ? 'سكنات الطلاب' : 
             currentLanguage === 'tr' ? 'Öğrenci Konutları' : 
             'Student Housing',
      icon: GraduationCap,
      count: propertyCounts.student,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-12 sm:gap-4">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = selectedFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              group relative overflow-hidden
              px-4 py-3 sm:px-6 sm:py-4 rounded-2xl
              transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-xl
              ${isActive 
                ? `bg-gradient-to-r ${filter.color} text-white shadow-lg scale-105` // active: gradient + white text
                : `
                  bg-white text-gray-700 border-2 border-gray-200
                  hover:border-gray-300
                  dark:bg-[#242734] dark:text-white dark:border-[#2c3141]
                  dark:hover:bg-[#2d3040]
                `
              }
              focus:outline-none focus:ring-4 focus:ring-opacity-30
              ${isActive ? 'focus:ring-white' : 'focus:ring-gray-400 dark:focus:ring-gray-600'}
              transform active:scale-95
            `}
          >
            {/* Background animation */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300
              bg-gradient-to-r ${filter.color}
              ${isActive ? 'opacity-0' : ''}
            `} />
            
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className={`
                p-2 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-white/20' 
                  : `bg-gray-100 group-hover:bg-gray-200 dark:bg-[#222537] dark:group-hover:bg-[#23263e]`
                }
              `}>
                <Icon className={`
                  w-5 h-5 transition-all duration-300
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-600 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-white'
                  }
                  group-hover:rotate-12
                `} />
              </div>
              
              <div className="text-left">
                <div className={`
                  font-semibold text-xs sm:text-sm transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-gray-800 dark:text-white'}
                `}>
                  {filter.label}
                </div>
                <div className={`
                  text-xs transition-colors duration-300
                  ${isActive 
                    ? 'text-white/80' 
                    : 'text-gray-500 dark:text-gray-200'
                  }
                `}>
                  {filter.count} {currentLanguage === 'ar' ? 'عقار' : 
                                  currentLanguage === 'tr' ? 'mülk' : 
                                  'properties'}
                </div>
              </div>
            </div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-30 transition-opacity duration-150 bg-white dark:bg-white/20" />
          </button>
        );
      })}
    </div>
  );
};

export default PropertyTypeFilter;
