
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentHousingBadgeProps {
  isStudentHousing: boolean;
  gender?: string;
  className?: string;
}

const StudentHousingBadge = ({ isStudentHousing, gender, className = "" }: StudentHousingBadgeProps) => {
  const { currentLanguage } = useLanguage();

  if (!isStudentHousing) return null;

  const getGenderText = () => {
    switch (gender) {
      case 'male':
        return currentLanguage === 'ar' ? 'رجال' : 
               currentLanguage === 'tr' ? 'Erkek' : 
               'Male';
      case 'female':
        return currentLanguage === 'ar' ? 'نساء' : 
               currentLanguage === 'tr' ? 'Kadın' : 
               'Female';
      case 'mixed':
        return currentLanguage === 'ar' ? 'مختلط' : 
               currentLanguage === 'tr' ? 'Karma' : 
               'Mixed';
      default:
        return currentLanguage === 'ar' ? 'غير محدد' : 
               currentLanguage === 'tr' ? 'Belirtilmemiş' : 
               'Unspecified';
    }
  };

  const getGenderColor = () => {
    switch (gender) {
      case 'male':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'female':
        return 'bg-gradient-to-r from-pink-400 to-pink-600 text-white';
      case 'mixed':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  return (
    <Badge className={`${getGenderColor()} text-xs px-2 py-1 rounded-full shadow flex items-center gap-2 ${className}`}>
      <GraduationCap className="w-3 h-3" />
      <span>{getGenderText()}</span>
    </Badge>
  );
};

export default StudentHousingBadge;

