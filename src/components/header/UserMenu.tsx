import { Heart, Menu, LogOut, UserCircle, User, BarChart3, Phone, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

const UserMenu = () => {
  const { currentLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      console.log('UserMenu: Starting sign out...');
      await signOut();
      console.log('UserMenu: Sign out completed, navigating to home...');
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      // Show success message
      toast({
        title: currentLanguage === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Successfully signed out',
        description: currentLanguage === 'ar' ? 'تم تسجيل خروجك بنجاح' : 'You have been signed out successfully',
      });
    } catch (error) {
      console.error('UserMenu: Error during sign out:', error);
      
      // Even if there's an error, navigate to home (in case of expired session)
      navigate('/', { replace: true });
      
      toast({
        title: currentLanguage === 'ar' ? 'تم تسجيل الخروج' : 'Signed out',
        description: currentLanguage === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'You have been signed out',
      });
    }
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarUrl = () => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url;
  };

  // إضافة دعم "شريك ومالك الموقع" للوصول إلى لوحة التحكم
  const isSellerOrPropertyOwnerOrOffice =
    profile?.user_type === 'agent' ||
    profile?.user_type === 'property_owner' ||
    profile?.user_type === 'real_estate_office' ||
    profile?.user_type === 'partner_and_site_owner';

  // دعم فني يحتاج لوحة تحكم منفصلة
  const isSupportUser = profile?.user_type === 'support';

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      {/* Favorites */}
      <Link to="/favorites">
        <Button
          variant="ghost"
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-[#23293d] relative transition-all duration-300 hover:scale-105"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </Link>
      {/* User Menu */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full border border-gray-200 dark:border-gray-700 p-1 hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:hover:bg-[#23293d]"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse px-2">
                <Menu className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                <Avatar className="w-8 h-8">
                  <AvatarImage src={getAvatarUrl()} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="rounded-xl border-0 shadow-2xl bg-white/95 dark:bg-[#111726] dark:text-white backdrop-blur-lg w-80 animate-scale-in"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-[#191f2b] rounded-t-xl">
              <div className={`flex items-start ${currentLanguage === 'ar' ? 'rtl:space-x-reverse' : 'space-x-6'}`}>
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarImage src={getAvatarUrl()} />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={
                    `flex-1 min-w-0
                    ${currentLanguage === 'ar' ? 'ms-5' : 'ml-5'}`
                  }
                >
                  <div className="font-semibold text-lg text-gray-900 dark:text-white truncate">{getUserDisplayName()}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300 truncate">{user?.email}</div>
                </div>
              </div>
            </div>
            
            <DropdownMenuItem asChild className="rounded-lg m-1 transition-all duration-300 hover:bg-pink-50 dark:hover:bg-[#23293d] dark:text-white">
              <Link to="/" className="flex items-center py-2">
                <Home className="w-4 h-4 mr-3 dark:text-white" />
                {currentLanguage === 'ar' ? 'الرئيسية' : 
                 currentLanguage === 'tr' ? 'Ana Sayfa' : 
                 'Home'}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="rounded-lg m-1 transition-all duration-300 hover:bg-pink-50 dark:hover:bg-[#23293d] dark:text-white">
              <Link to="/profile" className="flex items-center py-2">
                <User className="w-4 h-4 mr-3 dark:text-white" />
                {t('profile')}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild className="rounded-lg m-1 transition-all duration-300 hover:bg-pink-50 dark:hover:bg-[#23293d] dark:text-white">
              <Link to="/favorites" className="flex items-center py-2">
                <Heart className="w-4 h-4 mr-3 dark:text-white" />
                {currentLanguage === 'ar' ? 'المفضلة' : 
                 currentLanguage === 'tr' ? 'Favoriler' : 
                 'Favorites'}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="rounded-lg m-1 transition-all duration-300 hover:bg-pink-50 dark:hover:bg-[#23293d] dark:text-white">
              <Link to="/contact" className="flex items-center py-2">
                <Phone className="w-4 h-4 mr-3 dark:text-white" />
                {currentLanguage === 'ar' ? 'تواصل معنا' : 
                 currentLanguage === 'tr' ? 'İletişim' : 
                 'Contact'}
              </Link>
            </DropdownMenuItem>

            {/* Dashboard - only show for agents, property owners, real estate offices, and partner_and_site_owner */}
            {isSellerOrPropertyOwnerOrOffice && (
              <DropdownMenuItem asChild className="rounded-lg m-1 transition-all duration-300 hover:bg-pink-50 dark:hover:bg-[#23293d] dark:text-white">
                <Link to="/dashboard" className="flex items-center py-2">
                  <BarChart3 className="w-4 h-4 mr-3 dark:text-white" />
                  {currentLanguage === 'ar' ? 'لوحة التحكم' :
                   currentLanguage === 'tr' ? 'Kontrol Paneli' :
                   'Dashboard'}
                </Link>
              </DropdownMenuItem>
            )}

            {/* Support Dashboard - only show for support users */}
            {isSupportUser && (
              <DropdownMenuItem asChild className="rounded-lg m-1 transition-all duration-300 hover:bg-pink-50 dark:hover:bg-[#23293d] dark:text-white">
                <Link to="/support-dashboard" className="flex items-center py-2">
                  <BarChart3 className="w-4 h-4 mr-3 dark:text-white" />
                  {currentLanguage === 'ar' ? 'لوحة الدعم الفني' :
                   currentLanguage === 'tr' ? 'Destek Paneli' :
                   'Support Dashboard'}
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="rounded-lg m-1 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-[#23293d] dark:text-red-400 dark:hover:bg-[#2a2735] transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-3 dark:text-red-400" />
              {currentLanguage === 'ar' ? 'تسجيل الخروج' : 
               currentLanguage === 'tr' ? 'Çıkış Yap' : 
               'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/auth">
          <Button className="bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to hover:opacity-90 text-white rounded-full px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <UserCircle className="w-4 h-4 mr-2" />
            {currentLanguage === 'ar' ? 'تسجيل الدخول' : 
             currentLanguage === 'tr' ? 'Giriş Yap' : 
             'Sign in'}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default UserMenu;
