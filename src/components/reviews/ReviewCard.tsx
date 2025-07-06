
import React from 'react';
import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SiteReview } from "@/hooks/useSiteReviews";

interface ReviewCardProps {
  review: SiteReview;
  index: number;
}

const ReviewCard = ({ review, index }: ReviewCardProps) => {
  const { currentLanguage } = useLanguage();

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'seller':
        return {
          text: currentLanguage === 'ar' ? 'بائع' : 
                currentLanguage === 'tr' ? 'Satıcı' : 'Seller',
          color: 'bg-gradient-to-r from-blue-500 to-blue-600'
        };
      case 'property_owner':
        return {
          text: currentLanguage === 'ar' ? 'مالك عقار' : 
                currentLanguage === 'tr' ? 'Mülk Sahibi' : 'Property Owner',
          color: 'bg-gradient-to-r from-green-500 to-green-600'
        };
      case 'real_estate_office':
        return {
          text: currentLanguage === 'ar' ? 'مكتب عقارات' : 
                currentLanguage === 'tr' ? 'Emlak Ofisi' : 'Real Estate Office',
          color: 'bg-gradient-to-r from-purple-500 to-purple-600'
        };
      case 'partner_and_site_owner':
        return {
          text: currentLanguage === 'ar' ? 'شريك ومالك الموقع' :
                currentLanguage === 'tr' ? 'Ortak & Site Sahibi' : 'Partner & Site Owner',
          color: 'bg-gradient-to-r from-yellow-500 to-orange-400'
        };
      default:
        return {
          text: currentLanguage === 'ar' ? 'عميل' : 
                currentLanguage === 'tr' ? 'Müşteri' : 'Client',
          color: 'bg-gradient-to-r from-gray-500 to-gray-600'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 
                                  currentLanguage === 'tr' ? 'tr-TR' : 'en-US');
  };

  const userTypeBadge = getUserTypeBadge(review.profiles?.user_type || 'client');

  // جلب ألوان التدرج من :root لعمل نفس خلفية الأفاتار المرجعية
  const gradientFrom =
    getComputedStyle(document.documentElement).getPropertyValue('--brand-gradient-from-color') || '#2e90fa';
  const gradientTo =
    getComputedStyle(document.documentElement).getPropertyValue('--brand-gradient-to-color') || '#a855f7';

  // الحصول على اسم المستخدم مع التعامل مع القيم الفارغة
  const getUserName = () => {
    if (review.profiles?.full_name) {
      return review.profiles.full_name;
    }
    return currentLanguage === 'ar' ? 'مستخدم' : 
           currentLanguage === 'tr' ? 'Kullanıcı' : 'User';
  };

  return (
    <Card className="group relative overflow-hidden rounded-xl
      bg-white/80 dark:bg-gradient-to-tl dark:from-[#262734]/95 dark:to-[#232334]/95 dark:text-gray-50
      backdrop-blur-[2px] border-0 shadow-lg hover:shadow-2xl transition-all duration-700
      transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in">
      <div 
        className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none dark:hidden"
      ></div>
      {/* خلفية متدرجة باهتة للوضع الداكن */}
      <div className="hidden dark:block absolute inset-0 opacity-30 pointer-events-none"
           style={{background: `linear-gradient(120deg, ${gradientFrom}11 65%, ${gradientTo}22 100%)`}}></div>
      {/* Floating Elements */}
      <div className="absolute top-3 md:top-4 right-3 md:right-4 w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-brand-gradient-from/30 to-brand-gradient-to/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 w-4 md:w-6 h-4 md:h-6 bg-gradient-to-br from-brand-gradient-from/30 to-brand-gradient-to/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
      <CardContent className="relative p-4 md:p-6 flex flex-col h-full">
        {/* Header with User Info */}
        <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
          {/* -------- دائرة أفاتار بتدرج ألوان الهوية -------- */}
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-0 w-full h-full rounded-full"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                zIndex: 0,
                boxShadow: "0 2px 8px 0 rgba(60, 61, 178, 0.06)"
              }}
            ></div>
            <Avatar className="w-10 md:w-14 h-10 md:h-14 ring-2 ring-white dark:ring-[#1d1c28] shadow-lg transition-all duration-500 group-hover:ring-4 group-hover:ring-brand-accent/20 group-hover:scale-110 relative z-10">
              <AvatarImage 
                src={review.profiles?.avatar_url || ''} 
                alt={getUserName()} 
                className="object-cover"
              />
              <AvatarFallback className="bg-transparent text-white text-sm md:text-lg flex items-center justify-center">
                {review.profiles?.full_name
                  ? review.profiles.full_name.slice(0, 2).toUpperCase()
                  : <User className="w-5 md:w-7 h-5 md:h-7" />
                }
              </AvatarFallback>
            </Avatar>
            {/* Status Indicator - أسفل يمين الأفاتار مع ظل */}
            <div className="absolute -bottom-0.5 md:-bottom-1 -right-0.5 md:-right-1 w-3 md:w-5 h-3 md:h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white dark:border-[#1d1c28] shadow-md z-20 animate-pulse"
                 style={{
                   boxShadow: "0 2px 8px 0 #fff8, 0 1px 3px 0 #71e77533"
                 }}
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 flex-wrap">
              <h4 className="font-bold text-gray-900 dark:text-gray-50 text-sm md:text-lg group-hover:text-brand-accent transition-colors duration-300 truncate">
                {getUserName()}
              </h4>
              <Badge 
                className={`${userTypeBadge.color} text-white text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg border-0 flex-shrink-0`}
              >
                {userTypeBadge.text}
              </Badge>
            </div>
            {/* Enhanced Rating */}
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 md:w-5 h-3 md:h-5 transition-all duration-300 hover:scale-125 ${
                    star <= review.rating
                      ? 'text-yellow-400 fill-current drop-shadow-sm'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  style={{ animationDelay: `${star * 0.1}s` }}
                />
              ))}
              <span className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-300 ml-1 md:ml-2 bg-gray-100 dark:bg-[#232432] px-1 md:px-2 py-0.5 md:py-1 rounded-full">
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>
        {/* Enhanced Comment */}
        <div className="mb-3 md:mb-4 flex-grow">
          <div className="relative h-full">
            <div className="absolute -left-1 md:-left-2 top-0 w-0.5 md:w-1 h-full bg-gradient-to-b from-brand-gradient-from to-brand-gradient-to rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed pl-2 md:pl-4 text-xs md:text-base group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300 italic line-clamp-4">
              "{review.comment}"
            </p>
          </div>
        </div>
        {/* Enhanced Date */}
        <div className="pt-3 md:pt-4 border-t border-gray-100 dark:border-gray-700 group-hover:border-gray-200 dark:group-hover:border-gray-500 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-300 font-medium bg-gray-50 dark:bg-[#232432] px-2 md:px-3 py-1 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-[#2a2b3e] transition-colors duration-300">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
