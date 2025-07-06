import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Star, Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import OwnerRatingDialog from './OwnerRatingDialog';
import { supabase } from "@/integrations/supabase/client";
import VerifiedBadge from "../ui/VerifiedBadge";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { cn } from "@/lib/utils";

import { useOwnerRating } from "@/hooks/useOwnerRating";

interface PropertyOwnerInfoProps {
  ownerId: string;
  ownerName: string;
  ownerAvatar: string | null;
  userType?: string;
  averageRating?: number;
  ratingCount?: number;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
}

type OwnerProfile = {
  full_name?: string | null;
  avatar_url?: string | null;
  username?: string | null;
  is_verified?: boolean;
};

const PropertyOwnerInfo = ({
  ownerId,
  ownerName,
  ownerAvatar,
  userType,
  phone,
  whatsapp,
  email
}: PropertyOwnerInfoProps) => {
  const { currentLanguage } = useLanguage();
  const { isAdmin } = useAdminStatus();
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  
  // استخدام hook للحصول على تقييمات المالك
  const { ownerRatingData, ratingLoading } = useOwnerRating(ownerId);

  useEffect(() => {
    async function fetchProfile() {
      if (!ownerId) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name,avatar_url,username,is_verified")
        .eq("id", ownerId)
        .maybeSingle();

      if (!error && data) {
        setOwnerProfile(data);
      }
    }
    fetchProfile();
  }, [ownerId]);

  const getUserTypeLabel = (type: string | undefined) => {
    switch (type) {
      case 'property_owner':
        return currentLanguage === 'ar' ? 'مالك العقار' : currentLanguage === 'tr' ? 'Mülk Sahibi' : 'Property Owner';
      case 'seller':
        return currentLanguage === 'ar' ? 'بائع' : currentLanguage === 'tr' ? 'Satıcı' : 'Seller';
      case 'real_estate_office':
        return currentLanguage === 'ar' ? 'مكتب عقارات' : currentLanguage === 'tr' ? 'Emlak Ofisi' : 'Real Estate Office';
      case 'partner_and_site_owner':
        return currentLanguage === 'ar' ? 'شريك ومالك الموقع' : currentLanguage === 'tr' ? 'Ortak & Site Sahibi' : 'Partner & Site Owner';
      default:
        return currentLanguage === 'ar' ? 'تم النشر بواسطة' : currentLanguage === 'tr' ? 'Yayınlayan' : 'Published by';
    }
  };

  // استخدام البيانات من hook
  const displayRating = ownerRatingData?.averageRating || 0;
  const displayRatingCount = ownerRatingData?.ratingCount || 0;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar && <Star key="half" className="w-4 h-4 text-yellow-400 fill-yellow-200" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600" />
        ))}
      </>
    );
  };

  const getOwnerInitials = () => {
    const profileName = ownerProfile?.full_name || ownerName || '';
    if (!profileName.trim()) return '';
    return profileName.trim().slice(0, 2).toUpperCase();
  };

  const displayName = ownerProfile?.full_name || ownerName || (currentLanguage === 'ar' ? 'غير محدد' : currentLanguage === 'tr' ? 'Belirtilmemiş' : 'Not specified');
  const displayAvatar = ownerProfile?.avatar_url || ownerAvatar || undefined;
  const isVerified = ownerProfile?.is_verified;

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      {/* Owner Profile Section */}
      <Link to={`/user/${ownerProfile?.username || ownerId}`}>
        <div className="flex items-start gap-4 bg-gradient-to-r from-brand-accent/3 to-brand-accent/5 border border-brand-accent/10 hover:from-brand-accent/8 hover:to-brand-accent/12 hover:shadow-xl hover:shadow-brand-accent/25 rounded-xl p-4 transition-all duration-300 cursor-pointer group hover:border-brand-accent/40 hover:scale-[1.02] transform relative overflow-hidden">
          
          {/* Subtle background animation on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          
          {/* Avatar with Rating Badge */}
          <div className="relative z-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-brand-accent/60 rounded-full opacity-0 group-hover:opacity-70 transition-all duration-300 blur-sm"></div>
            <Avatar className="w-16 h-16 relative border-4 border-white dark:border-gray-800 rounded-full shadow-lg group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 ring-0 group-hover:ring-4 group-hover:ring-brand-accent/20">
              <AvatarImage src={displayAvatar} alt={displayName} className="object-cover" />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white">
                {getOwnerInitials() || <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            
            {/* Rating Score Badge - موضع مختلف حسب اللغة */}
            {!ratingLoading && displayRating > 0 && (
              <div className={`absolute -bottom-2 bg-white border-2 border-yellow-300/30 text-yellow-600 rounded-full px-1.5 py-0.5 text-xs font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400/50 ${
                currentLanguage === 'ar' ? '-left-2' : '-right-2'
              }`}>
                {displayRating.toFixed(1)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium group-hover:text-brand-accent/70 transition-colors duration-300">
              {getUserTypeLabel(userType)}
            </p>
            
            {/* Name with Verification */}
            <h3 className="font-bold text-gray-800 dark:text-gray-50 flex items-center gap-2 text-lg mb-1 group-hover:text-brand-accent dark:group-hover:text-brand-accent transition-colors duration-300">
              {isVerified && <VerifiedBadge size="sm" />}
              <span className="truncate">{displayName}</span>
            </h3>
            
            {/* Stars Below Name with reduced spacing */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {!ratingLoading && displayRating > 0 ? (
                    renderStars(displayRating)
                  ) : (
                    [...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-yellow-300/50 transition-colors duration-300" />
                    ))
                  )}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-brand-accent/80 transition-colors duration-300">
                  {!ratingLoading && displayRating > 0 ? (
                    `(${displayRatingCount} ${currentLanguage === 'ar' ? 'تقييم' : currentLanguage === 'tr' ? 'değerlendirme' : 'reviews'})`
                  ) : ratingLoading ? (
                    currentLanguage === 'ar' ? 'جارٍ التحميل...' : currentLanguage === 'tr' ? 'Yükleniyor...' : 'Loading...'
                  ) : (
                    `(${currentLanguage === 'ar' ? 'لا يوجد تقييمات' : currentLanguage === 'tr' ? 'Değerlendirme yok' : 'No reviews'})`
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Click indicator - subtle arrow or pointer */}
          <div className={cn(
            "absolute top-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0",
            currentLanguage === 'ar'
              ? "left-4 -translate-x-2"
              : "right-4 translate-x-2"
          )}>
            <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center">
              <div className={cn(
                "w-2 h-2 border-brand-accent transform",
                currentLanguage === 'ar'
                  ? "border-l-2 border-b-2 rotate-[45deg]"  // سهم يسار في العربية
                  : "border-r-2 border-b-2 rotate-[-45deg]" // سهم يمين في الإنجليزية
              )}></div>
            </div>
          </div>
        </div>
      </Link>

      {/* Contact Information for Admins */}
      {isAdmin && (phone || whatsapp || email) && (
        <div className="mt-4 p-4 bg-gradient-to-r from-brand-accent/5 to-brand-accent/10 rounded-xl border border-brand-accent/20 hover:shadow-lg transition-all duration-300">
          <h4 className="text-sm font-semibold text-brand-accent mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
            {currentLanguage === 'ar' ? 'معلومات الاتصال' : currentLanguage === 'tr' ? 'İletişim Bilgileri' : 'Contact Information'}
          </h4>
          <div className="space-y-2">
            {phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <a href={`tel:${phone}`} className="text-brand-accent hover:text-brand-accent/80 font-medium transition-colors duration-300">
                  {phone}
                </a>
              </div>
            )}
            {whatsapp && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <a 
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-accent hover:text-brand-accent/80 font-medium transition-colors duration-300"
                >
                  {whatsapp}
                </a>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <a href={`mailto:${email}`} className="text-brand-accent hover:text-brand-accent/80 font-medium transition-colors duration-300">
                  {email}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        {/* Rating Button */}
        <OwnerRatingDialog ownerId={ownerId} ownerName={displayName}>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-sm bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-yellow-300 text-yellow-700 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700 dark:text-yellow-400 dark:hover:from-yellow-900/30 dark:hover:to-orange-900/30 font-medium transition-all duration-300 hover:shadow-lg rounded-xl"
          >
            <Star className="w-4 h-4 mr-2" />
            {currentLanguage === 'ar' ? 'تقييم' : currentLanguage === 'tr' ? 'Değerlendir' : 'Rate'}
          </Button>
        </OwnerRatingDialog>


      </div>
    </div>
  );
};

export default PropertyOwnerInfo;
