import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, MessageCircle, Star, Home, Flag, Calendar, Eye, EyeOff, ArrowLeft, ArrowRight, RefreshCw, User, Bed, Bath, Square, Heart, Ban, Trash2, Edit, X, XCircle, CheckCircle, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import ReportUserDialog from '@/components/reports/ReportUserDialog';
import ReportPropertyDialog from '@/components/reports/ReportPropertyDialog';
import { useFavorites } from '@/hooks/useFavorites';
import { useCitiesData } from '@/hooks/useCitiesData';
import { useDistrictsData } from '@/hooks/useDistrictsData';
import StudentHousingBadge from '@/components/property/StudentHousingBadge';
import { cn, formatCompactNumber } from '@/lib/utils';
import { usePropertyViewsCount } from '@/hooks/usePropertyViewsCount';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import UserReportsDialog from '@/components/reports/UserReportsDialog';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import SuspensionDialog from '@/components/admin/SuspensionDialog';
import { useUserActions } from '@/hooks/useUserActions';
import { useOwnerRating } from '@/hooks/useOwnerRating';
import OwnerRatingDialog from '@/components/property/OwnerRatingDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminUserActivityDialog from '@/components/admin/AdminUserActivityDialog';
import PublisherActivityDialog from '@/components/publisher/PublisherActivityDialog';
import { formatDateGregorian, formatDateLongGregorian } from '@/utils/dateUtils';

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  user_type: string;
  whatsapp_number: string;
  phone: string;
  created_at: string;
  is_verified: boolean;
  is_approved: boolean;
  suspension_end_date?: string;
  suspension_reason?: string;
}
interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  property_type: string;
  cover_image: string;
  status: string;
  created_at: string;
  views_count: number;
  is_featured: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number;
  listing_type: string;
  deposit: number;
  commission: number;
  is_student_housing: boolean;
  student_housing_gender: string;
  deposit_currency: string;
  commission_currency: string;
}
const UserProfile = () => {
  const {
    username
  } = useParams();
  const navigate = useNavigate();
  const {
    currentLanguage
  } = useLanguage();
  const {
    user: currentUser
  } = useAuth();
  const {
    isAdmin
  } = useAdminStatus();
  const {
    toggleFavorite,
    isFavorited
  } = useFavorites();
  const {
    cities,
    loading: citiesLoading
  } = useCitiesData();
  const {
    districts,
    loading: districtsLoading
  } = useDistrictsData();
  const isMobile = useIsMobile();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminActivityDialog, setShowAdminActivityDialog] = useState(false);
  const [showPublisherActivityDialog, setShowPublisherActivityDialog] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    featuredProperties: 0,
    availableProperties: 0,
    hiddenProperties: 0,
    soldProperties: 0,
    totalViews: 0,
    latestPost: ''
  });

  // Declare fetchUserProfile function first
  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const {
        data: profile,
        error: profileError
      } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (profileError) throw profileError;
      setUserProfile(profile);

      // Fetch user's properties
      const {
        data: userProperties,
        error: propertiesError
      } = await supabase.from('properties').select('*').eq('created_by', profile.id).order('created_at', {
        ascending: false
      });
      if (propertiesError) throw propertiesError;
      setProperties(userProperties || []);

      // Calculate stats
      if (userProperties) {
        const totalViews = userProperties.reduce((sum, prop) => sum + (prop.views_count || 0), 0);
        const featuredCount = userProperties.filter(prop => prop.is_featured).length;
        const availableCount = userProperties.filter(prop => prop.status === 'available' && !prop.is_hidden).length;
        const hiddenCount = userProperties.filter(prop => prop.is_hidden).length;
        const soldCount = userProperties.filter(prop => prop.status === 'sold' || prop.status === 'rented').length;
        const latestProperty = userProperties[0];
        setStats({
          totalProperties: userProperties.length,
          featuredProperties: featuredCount,
          availableProperties: availableCount,
          hiddenProperties: hiddenCount,
          soldProperties: soldCount,
          totalViews,
          latestPost: latestProperty ? formatDateGregorian(latestProperty.created_at, currentLanguage) : ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Now useUserActions hook can be called after fetchUserProfile is declared
  const {
    toggleVerification,
    toggleApproval,
    deleteUser
  } = useUserActions(fetchUserProfile);
  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  // Add owner rating hook
  const {
    ownerRatingData,
    ratingLoading
  } = useOwnerRating(userProfile?.id);

  // Debug logging for user authentication and profile comparison
  useEffect(() => {
    console.log('Current user:', currentUser);
    console.log('User profile:', userProfile);
    console.log('Are they the same?', currentUser?.id === userProfile?.id);
    console.log('Should show report button?', currentUser && userProfile && currentUser.id !== userProfile.id);
  }, [currentUser, userProfile]);

  // Handle property deletion
  const handlePropertyDeleted = (propertyId: string) => {
    setProperties(prevProperties => prevProperties.filter(p => p.id !== propertyId));
    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      totalProperties: prevStats.totalProperties - 1,
      availableProperties: prevStats.availableProperties - 1
    }));
  };
  const getUserTypeLabel = (type: string) => {
    const types = {
      client: currentLanguage === 'ar' ? 'عميل' : 'Client',
      seller: currentLanguage === 'ar' ? 'بائع' : 'Seller',
      property_owner: currentLanguage === 'ar' ? 'مالك عقارات' : 'Property Owner',
      real_estate_office: currentLanguage === 'ar' ? 'مكتب عقارات' : 'Real Estate Office',
      partner_and_site_owner: currentLanguage === 'ar' ? 'شريك ومالك الموقع' : 'Partner & Site Owner'
    };
    return types[type] || type;
  };
  const getCityNameById = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return cityId;
    if (currentLanguage === 'ar') return city.name_ar;
    if (currentLanguage === 'tr') return city.name_tr;
    return city.name_en;
  };
  const getDistrictNameById = (districtId: string) => {
    const district = districts.find(d => d.id === districtId);
    if (!district) return districtId;
    if (currentLanguage === 'ar') return district.name_ar;
    if (currentLanguage === 'tr') return district.name_tr;
    return district.name_en;
  };
  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'USD':
        return '$';
      default:
        return '€';
    }
  };
  const getBedLabel = () => {
    if (currentLanguage === 'ar') return 'غرفة';
    if (currentLanguage === 'tr') return 'yatak odası';
    return 'beds';
  };
  const getBathLabel = () => {
    if (currentLanguage === 'ar') return 'حمام';
    if (currentLanguage === 'tr') return 'banyo';
    return 'baths';
  };
  const getAreaUnit = () => {
    if (currentLanguage === 'ar') return 'م²';
    if (currentLanguage === 'tr') return 'm²';
    return 'm²';
  };
  const getAvatarInitials = () => {
    const name = userProfile?.full_name || userProfile?.username || '';
    if (!name.trim()) return '';
    return name.trim().slice(0, 2).toUpperCase();
  };
  const renderStars = (rating: number) => {
    return <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : i < rating ? 'text-yellow-400 fill-yellow-200' : 'text-gray-300 dark:text-gray-600'}`} />)}
      </div>;
  };
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
        <div className="relative">
          <div className="w-16 h-16 border border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border border-brand-accent/20 rounded-full animate-pulse"></div>
        </div>
      </div>;
  }
  if (!userProfile) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-accent/10 to-brand-accent/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-brand-accent" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLanguage === 'ar' ? 'المستخدم غير موجود' : 'User not found'}
          </h2>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-brand-accent to-brand-accent/80 hover:from-brand-accent/90 hover:to-brand-accent text-white shadow-lg hover:shadow-brand-glow transition-all duration-300">
            {currentLanguage === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </div>
      </div>;
  }

  // Determine if we should show the report button
  const shouldShowReportButton = currentUser?.id !== userProfile?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background decoration elements - Hidden on mobile, visible on tablet+ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-10 left-10 text-brand-accent/20 animate-float">
          <Home className="w-8 h-8" />
        </div>
        <div className="absolute top-1/4 right-20 text-brand-accent/15 animate-bounce-subtle animation-delay-500">
          <Home className="w-6 h-6" />
        </div>
        <div className="absolute top-1/3 left-1/4 text-brand-accent/10 animate-pulse-soft animation-delay-300">
          <Home className="w-10 h-10" />
        </div>
        <div className="absolute bottom-32 right-1/3 text-brand-accent/20 animate-float animation-delay-700">
          <Home className="w-7 h-7" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-brand-accent/15 animate-bounce-subtle animation-delay-1000">
          <Home className="w-9 h-9" />
        </div>
        <div className="absolute top-2/3 right-10 text-brand-accent/10 animate-pulse-soft animation-delay-800">
          <Home className="w-5 h-5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 relative z-10">
        {/* Header - Responsive for all screen sizes */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full p-2 md:p-3 shrink-0 px-[16px] py-[8px]">
            {currentLanguage === 'ar' ? (
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex-1 text-gray-900 dark:text-white truncate">
            {currentLanguage === 'ar' ? 'ملف المستخدم' : 'User Profile'}
          </h1>
          <Button variant="outline" size="sm" onClick={fetchUserProfile} disabled={loading} className="flex items-center gap-1 sm:gap-2 md:gap-3 border-brand-accent/20 text-brand-accent hover:bg-brand-accent hover:text-white transition-all duration-300 rounded-xl shrink-0 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5">
            <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline text-xs sm:text-sm md:text-base">
              {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
            </span>
          </Button>
        </div>

        {/* User Profile Card - Fully Responsive */}
        <Card className="mb-6 sm:mb-8 md:mb-10 shadow-lg border bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden animate-scale-in">
          <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex flex-col space-y-6 md:space-y-8">
              {/* User Avatar and Info - Responsive Layout */}
              <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
                <div className="relative group shrink-0">
                  {/* Avatar with Rating Badge */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-brand-accent/60 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 relative border-4 border-white dark:border-gray-800 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <AvatarImage src={userProfile?.avatar_url} />
                      <AvatarFallback className="text-lg md:text-xl lg:text-2xl bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white font-semibold">
                        {getAvatarInitials() || <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Rating Score Badge */}
                    {!ratingLoading && ownerRatingData && ownerRatingData.averageRating > 0 && <div className="absolute -bottom-2 -right-2 bg-white border-2 border-yellow-300/30 text-yellow-600 rounded-full px-2 py-1 text-xs sm:text-sm md:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        {ownerRatingData.averageRating.toFixed(1)}
                      </div>}
                  </div>
                </div>
                
                <div className="flex-1 text-center min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    {userProfile?.is_verified && <VerifiedBadge size="md" />}
                    <span className="truncate">{userProfile?.full_name || userProfile?.username}</span>
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-3 md:mb-4 text-base sm:text-lg md:text-xl">
                    @{userProfile?.username}
                  </p>
                  
                  {/* Rating Section - Responsive */}
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {!ratingLoading && ownerRatingData && ownerRatingData.ratingCount > 0 ? <>
                            {renderStars(ownerRatingData.averageRating)}
                            <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 ml-1 md:ml-2">
                              ({ownerRatingData.ratingCount} {currentLanguage === 'ar' ? 'تقييمات' : 'reviews'})
                            </span>
                          </> : <>
                            {renderStars(0)}
                            <span className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 ml-1 md:ml-2">
                              ({currentLanguage === 'ar' ? 'بدون تقييمات' : 'No reviews'})
                            </span>
                          </>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                    {/* User Type Badge - Consistent styling */}
                    <div className="h-12 px-4 py-2 text-xs sm:text-sm md:text-base flex items-center gap-2 text-brand-accent border border-brand-accent/30 bg-brand-accent/5 rounded-xl">
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">
                        {getUserTypeLabel(userProfile?.user_type)}
                      </span>
                    </div>
                    
                    {/* Verified Badge - Consistent styling */}
                    {userProfile?.is_verified && <div className="h-12 px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl text-xs sm:text-sm md:text-base font-semibold flex items-center gap-2 shadow-sm">
                        <VerifiedBadge size="sm" />
                        <span>{currentLanguage === 'ar' ? 'موثق' : 'Verified'}</span>
                      </div>}
                  </div>

                  {/* Member Since Card - Responsive */}
                  <div className="bg-gradient-to-r from-brand-accent/5 to-brand-accent/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-brand-accent/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="bg-gradient-to-r from-brand-accent to-brand-accent/80 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 shrink-0">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm md:text-base font-medium text-brand-accent">
                          {currentLanguage === 'ar' ? 'عضو منذ' : 'Member since'}
                        </p>
                        <p className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                          {formatDateLongGregorian(userProfile?.created_at || '', currentLanguage)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Responsive Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {/* Report User Button */}
                {shouldShowReportButton && <ReportUserDialog userId={userProfile?.id || ''} userName={userProfile?.full_name || userProfile?.username || ''}>
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 dark:border-red-700 dark:text-red-400 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3">
                      <Flag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="truncate">
                        {currentLanguage === 'ar' ? 'إبلاغ عن الناشر' : currentLanguage === 'tr' ? 'Yayıncıyı Bildir' : 'Report Seller'}
                      </span>
                    </Button>
                  </ReportUserDialog>}

                {/* Rate Button */}
                {shouldShowReportButton && <OwnerRatingDialog ownerId={userProfile?.id || ''} ownerName={userProfile?.full_name || userProfile?.username || ''}>
                    <Button variant="outline" className="w-full text-brand-accent border-brand-accent/30 hover:bg-brand-accent hover:text-white transition-all duration-300 rounded-xl flex items-center gap-2 md:gap-3 text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      {currentLanguage === 'ar' ? 'تقييم' : 'Rate'}
                    </Button>
                  </OwnerRatingDialog>}

                {/* Admin-only buttons - Responsive */}
                {isAdmin && <>
                    {/* Email Button */}
                    <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3" onClick={() => {
                  supabase.auth.admin.getUserById(userProfile?.id || '').then(({
                    data
                  }) => {
                    if (data.user?.email) {
                      window.location.href = `mailto:${data.user.email}`;
                    }
                  });
                }}>
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="truncate">{currentLanguage === 'ar' ? 'إيميل' : 'Email'}</span>
                    </Button>

                    {/* Phone Button */}
                    {userProfile?.phone && <Button variant="outline" className="w-full text-purple-600 border-purple-200 hover:bg-purple-500 hover:text-white hover:border-purple-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3" onClick={() => window.location.href = `tel:${userProfile.phone}`}>
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <span className="truncate">{currentLanguage === 'ar' ? 'هاتف' : 'Phone'}</span>
                      </Button>}

                    {/* WhatsApp Button */}
                    {userProfile?.whatsapp_number && <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3" onClick={() => window.open(`https://wa.me/${userProfile.whatsapp_number}`, '_blank')}>
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <span className="truncate">{currentLanguage === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                      </Button>}

                    {/* Additional Admin Buttons - Responsive */}
                    <SuspensionDialog userId={userProfile?.id || ''} userName={userProfile?.full_name || userProfile?.username || ''} onSuspensionUpdated={fetchUserProfile} trigger={<Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3">
                          <Ban className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span className="truncate">{currentLanguage === 'ar' ? 'حظر المستخدم' : 'Suspend User'}</span>
                        </Button>} />

                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3" onClick={() => deleteUser(userProfile?.id || '', userProfile?.full_name || userProfile?.username || '')}>
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="truncate">{currentLanguage === 'ar' ? 'حذف المستخدم' : 'Delete User'}</span>
                    </Button>

                    <Button variant="outline" className={`w-full ${userProfile?.is_verified ? 'text-yellow-600 border-yellow-200 hover:bg-yellow-500' : 'text-green-600 border-green-200 hover:bg-green-500'} hover:text-white flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3`} onClick={() => toggleVerification(userProfile?.id || '', userProfile?.is_verified || false)}>
                      {userProfile?.is_verified ? <>
                          <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span className="truncate">{currentLanguage === 'ar' ? 'إلغاء التوثيق' : 'Remove Verification'}</span>
                        </> : <>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span className="truncate">{currentLanguage === 'ar' ? 'توثيق المستخدم' : 'Verify User'}</span>
                        </>}
                    </Button>

                    {userProfile?.user_type !== 'client' && <Button variant="outline" className={`w-full ${userProfile?.is_approved ? 'text-red-600 border-red-200 hover:bg-red-500' : 'text-green-600 border-green-200 hover:bg-green-500'} hover:text-white flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3`} onClick={() => toggleApproval(userProfile?.id || '', userProfile?.is_approved || false)}>
                        {userProfile?.is_approved ? <>
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span className="truncate">{currentLanguage === 'ar' ? 'رفض الطلب' : 'Reject Request'}</span>
                          </> : <>
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span className="truncate">{currentLanguage === 'ar' ? 'الموافقة على الطلب' : 'Approve Request'}</span>
                          </>}
                      </Button>}

                    {/* Admin Activity View Button */}
                    <Button
                      variant="outline"
                      className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3"
                      onClick={() => setShowAdminActivityDialog(true)}
                    >
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="truncate">
                        {currentLanguage === 'ar' ? 'سجل الأنشطة (مدير)' :
                         currentLanguage === 'tr' ? 'Etkinlik Günlüğü (Admin)' :
                         'Activity Log (Admin)'}
                      </span>
                    </Button>

                    <UserReportsDialog userId={userProfile?.id || ''} userName={userProfile?.full_name || userProfile?.username || ''}>
                      <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <span className="truncate">{currentLanguage === 'ar' ? 'عرض البلاغات' : 'View Reports'}</span>
                      </Button>
                    </UserReportsDialog>
                  </>}

                {/* View Activity Button - Only visible to the profile owner */}
                {currentUser?.id === userProfile?.id && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3"
                      onClick={() => setShowPublisherActivityDialog(true)}
                    >
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="truncate">
                        {currentLanguage === 'ar' ? 'سجل الأنشطة' : currentLanguage === 'tr' ? 'Etkinlik Günlüğü' : 'Activity Log'}
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full text-purple-600 border-purple-200 hover:bg-purple-500 hover:text-white hover:border-purple-500 flex items-center gap-2 md:gap-3 transition-all duration-300 rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3"
                      onClick={() => navigate(`/user-activity/${userProfile?.id}`)}
                    >
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="truncate">
                        {currentLanguage === 'ar' ? 'عرض الأنشطة' : currentLanguage === 'tr' ? 'Etkinlikleri Görüntüle' : 'View Activity'}
                      </span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Properties Section - Responsive */}
        <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden animate-slide-up animation-delay-200">
          <CardHeader className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="bg-gradient-to-r from-brand-accent to-brand-accent/80 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-lg shrink-0">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-brand-accent">
                    {currentLanguage === 'ar' ? 'عقارات المستخدم' : 'User Properties'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base md:text-lg">
                    {currentLanguage === 'ar' ? 'جميع العقارات المتاحة لهذا المستخدم' : 'All available properties by this user'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-brand-accent/10 text-brand-accent px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-xl self-start sm:self-auto">
                {stats.totalProperties} {currentLanguage === 'ar' ? 'عقارات' : 'Properties'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 md:p-8">
            {/* Stats Cards - 4 Cards Only */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Total Properties */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-900">
                      {stats.totalProperties}
                    </p>
                    <p className="text-sm font-medium text-blue-700">
                      {currentLanguage === 'ar' ? 'إجمالي العقارات' : 'Total Properties'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Properties */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-900">
                      {stats.featuredProperties}
                    </p>
                    <p className="text-sm font-medium text-purple-700">
                      {currentLanguage === 'ar' ? 'العقارات المميزة' : 'Featured Properties'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Views */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-900">
                      {formatCompactNumber(stats.totalViews)}
                    </p>
                    <p className="text-sm font-medium text-green-700">
                      {currentLanguage === 'ar' ? 'المشاهدات' : 'Views'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Latest Post */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-900">
                      {stats.latestPost || (currentLanguage === 'ar' ? 'لا يوجد' : 'None')}
                    </p>
                    <p className="text-sm font-medium text-orange-700">
                      {currentLanguage === 'ar' ? 'آخر منشور' : 'Latest Post'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties List */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
                <div className="bg-gradient-to-r from-brand-accent to-brand-accent/80 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 shrink-0">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-brand-accent">
                  {currentLanguage === 'ar' ? 'قائمة العقارات' : 'Properties List'}
                </h3>
              </div>

              {properties.length === 0 ? <div className="text-center py-12 sm:py-16 md:py-20 animate-fade-in">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 md:mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                    <Home className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-700 dark:text-gray-300">
                    {currentLanguage === 'ar' ? 'لا توجد عقارات' : 'No Properties'}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">
                    {currentLanguage === 'ar' ? 'لا توجد عقارات متاحة لهذا المستخدم' : 'No properties available from this user'}
                  </p>
                </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  {properties.map((property, index) => <PropertyCardComponent key={property.id} property={property} index={index} currentLanguage={currentLanguage} cities={cities} districts={districts} citiesLoading={citiesLoading} districtsLoading={districtsLoading} getCityNameById={getCityNameById} getDistrictNameById={getDistrictNameById} getCurrencySymbol={getCurrencySymbol} getBedLabel={getBedLabel} getBathLabel={getBathLabel} getAreaUnit={getAreaUnit} navigate={navigate} toggleFavorite={toggleFavorite} isFavorited={isFavorited} currentUser={currentUser} onPropertyDeleted={handlePropertyDeleted} />)}
                </div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin User Activity Dialog */}
      <AdminUserActivityDialog
        open={showAdminActivityDialog}
        onOpenChange={setShowAdminActivityDialog}
        userId={userProfile?.id || ''}
        userName={userProfile?.full_name || userProfile?.username || ''}
      />

      {/* Publisher Activity Dialog */}
      <PublisherActivityDialog
        open={showPublisherActivityDialog}
        onOpenChange={setShowPublisherActivityDialog}
      />
    </div>
  );
};

// Property Card Component - Using Main Page Design (PropertyCard.tsx)
const PropertyCardComponent = ({
  property,
  index,
  currentLanguage,
  cities,
  districts,
  citiesLoading,
  districtsLoading,
  getCityNameById,
  getDistrictNameById,
  getCurrencySymbol,
  getBedLabel,
  getBathLabel,
  getAreaUnit,
  navigate,
  toggleFavorite,
  isFavorited,
  currentUser,
  onPropertyDeleted
}: any) => {
  const {
    viewsCount,
    loading: viewsLoading
  } = usePropertyViewsCount(property.id);

  // Check if current user is the owner of this property
  const isOwner = currentUser?.id === property.created_by;

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/property/${property.id}`);
  };
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };
  const isPropertyFavorited = isFavorited(property.id);

  const handleDeleteProperty = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmMessage = currentLanguage === 'ar'
      ? `هل أنت متأكد من حذف "${property.title}"؟`
      : `Are you sure you want to delete "${property.title}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) throw error;

      // Call the callback to refresh the properties list
      if (onPropertyDeleted) {
        onPropertyDeleted(property.id);
      }

      // Show success message
      alert(currentLanguage === 'ar' ? 'تم حذف العقار بنجاح' : 'Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(currentLanguage === 'ar' ? 'فشل في حذف العقار' : 'Failed to delete property');
    }
  };

  const handleEditProperty = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/dashboard'); // Redirect to dashboard for editing
  };
  const getDepositLabel = () => {
    if (currentLanguage === 'ar') return 'وديعة: ';
    if (currentLanguage === 'tr') return 'Depozito: ';
    return 'Deposit: ';
  };
  const getCommissionLabel = () => {
    if (currentLanguage === 'ar') return 'عمولة: ';
    if (currentLanguage === 'tr') return 'Komisyon: ';
    return 'Commission: ';
  };

  const cleanTitle = property.title || '';
  const listingTypeText = property.listing_type === 'rent'
    ? (currentLanguage === 'ar' ? 'للإيجار' : currentLanguage === 'tr' ? 'Kiralık' : 'For Rent')
    : (currentLanguage === 'ar' ? 'للبيع' : currentLanguage === 'tr' ? 'Satılık' : 'For Sale');

  return (
    <Card
      className={cn(
        `group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border-0
        bg-card text-card-foreground
        dark:bg-[#1a2232] dark:text-[#e4e8ef]
        ${property.is_featured ? "shadow-brand-glow" : ""}`,
      )}
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.cover_image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Featured Badge */}
        {property.is_featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse-soft">
            ⭐ {currentLanguage === 'ar' ? 'مميز' : currentLanguage === 'tr' ? 'Öne Çıkan' : 'Featured'}
          </div>
        )}

        {/* Hidden Badge */}
        {property.is_hidden && (
          <div className="absolute top-3 right-14 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🙈 {currentLanguage === 'ar' ? 'مخفي' : currentLanguage === 'tr' ? 'Gizli' : 'Hidden'}
          </div>
        )}

        {/* Status Badge */}
        {(property.status === 'sold' || property.status === 'rented') && (
          <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
            property.status === 'sold' ? 'bg-green-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {property.status === 'sold' ? (currentLanguage === 'ar' ? '🏠 مباع' : '🏠 Sold') :
             (currentLanguage === 'ar' ? '🏠 مؤجر' : '🏠 Rented')}
          </div>
        )}

        {/* No Deposit/Commission Badges and Student Housing Badge */}
        <div className="absolute top-3 right-14 flex flex-col gap-1 z-10">
          {property.deposit === 0 && (
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow">
              {currentLanguage === 'ar' ? 'بدون وديعة' :
               currentLanguage === 'tr' ? 'Depozitosu Yok' : 'No Deposit'}
            </Badge>
          )}
          {property.commission === 0 && (
            <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow">
              {currentLanguage === 'ar' ? 'بدون عمولة' :
               currentLanguage === 'tr' ? 'Komisyonsuz' : 'No Commission'}
            </Badge>
          )}
          <StudentHousingBadge
            isStudentHousing={property.is_student_housing || false}
            gender={property.student_housing_gender}
            className="text-xs"
          />
        </div>

        {/* Heart Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full transition-all duration-300 ${
            isPropertyFavorited
              ? 'bg-white text-red-500 shadow-lg scale-110'
              : 'bg-black/20 text-white hover:bg-white hover:text-red-500 hover:scale-110'
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart className={`w-5 h-5 ${isPropertyFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* Action Buttons */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white rounded-full font-semibold"
              onClick={handleViewDetails}
            >
              <Eye className="w-4 h-4 mr-1" />
              {currentLanguage === 'ar' ? 'عرض' :
               currentLanguage === 'tr' ? 'Görüntüle' :
               'View'}
            </Button>

            {/* Owner-only buttons */}
            {isOwner && (
              <>
                <Button
                  size="sm"
                  className="bg-blue-500/90 backdrop-blur-sm text-white hover:bg-blue-600 rounded-full font-semibold"
                  onClick={handleEditProperty}
                  title={currentLanguage === 'ar' ? 'تعديل العقار' : 'Edit Property'}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  className="bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-600 rounded-full font-semibold"
                  onClick={handleDeleteProperty}
                  title={currentLanguage === 'ar' ? 'حذف العقار' : 'Delete Property'}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Location */}
        <div className="flex items-center text-muted-foreground text-sm dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-1 text-brand-accent" />
          <span>
            {citiesLoading || districtsLoading ? (
              <span className="text-gray-400">
                {currentLanguage === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
              </span>
            ) : cities.length === 0 ? (
              <span className="text-red-400">
                {currentLanguage === 'ar' ? 'خطأ في تحميل المدن' : 'Error loading cities'}
              </span>
            ) : (
              <>
                {getCityNameById(property.city)}
                {property.district && (
                  <>
                    <span> - </span>
                    {getDistrictNameById(property.district)}
                  </>
                )}
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-foreground dark:text-white group-hover:text-brand-accent transition-colors duration-300 line-clamp-2">
          {cleanTitle}
          {property.listing_type && (
            <span className="text-gray-600 font-normal dark:text-gray-300">
              {' - '}
              {listingTypeText}
            </span>
          )}
        </h3>

        {/* Features */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse text-muted-foreground text-sm dark:text-gray-300">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} {getBedLabel()}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} {getBathLabel()}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.area}{getAreaUnit()}</span>
          </div>
        </div>

        {/* Deposit & Commission Info */}
        {(property.deposit > 0 || property.commission > 0) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {property.deposit > 0 && (
              <div className="text-muted-foreground bg-muted px-2 py-1 rounded dark:bg-[#273143] dark:text-gray-200">
                {getDepositLabel()}
                {getCurrencySymbol(property.deposit_currency || property.currency)}{property.deposit}
              </div>
            )}
            {property.commission > 0 && (
              <div className="text-muted-foreground bg-muted px-2 py-1 rounded dark:bg-[#273143] dark:text-gray-200">
                {getCommissionLabel()}
                {getCurrencySymbol(property.commission_currency || property.currency)}{property.commission}
              </div>
            )}
          </div>
        )}

        {/* Price & Views */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-brand-accent dark:text-cyan-300">
              {getCurrencySymbol(property.currency)}{property.price.toLocaleString()}
              {property.listing_type === 'rent' && (
                <span className="text-sm font-normal text-muted-foreground ml-1 dark:text-gray-400">
                  {currentLanguage === 'ar' ? '/شهر' : currentLanguage === 'tr' ? '/ay' : '/month'}
                </span>
              )}
            </div>
            {/* عدد المشاهدات - دائماً تظهر تحت السعر */}
            <div className="mt-2 flex items-center text-sm text-muted-foreground dark:text-gray-400">
              <Eye className="mr-1.5 h-4 w-4" />
              <span>
                {viewsLoading
                  ? (currentLanguage === 'ar' ? 'جارٍ التحميل...' : currentLanguage === 'tr' ? 'Yükleniyor...' : 'Loading...')
                  : `${formatCompactNumber(viewsCount ?? 0)} ${currentLanguage === 'ar' ? 'مشاهدات' : currentLanguage === 'tr' ? 'Görüntüleme' : 'Views'}`}
              </span>
            </div>
          </div>

          {/* View Details Button: أبيض بالكامل بالدارك مود */}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "self-end rounded-full transition-all duration-300 font-semibold px-6",
              "border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 hover:border-brand-accent/50",
              "dark:bg-transparent dark:text-white dark:border-white/30 dark:hover:bg-white/10 dark:hover:text-white dark:ring-1 dark:ring-white/10"
            )}
            onClick={handleViewDetails}
          >
            {currentLanguage === 'ar' ? 'عرض التفاصيل' : currentLanguage === 'tr' ? 'Detayları Görüntüle' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
