
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import MobileSearch from "./mobile/MobileSearch";
import MobileNav from "./mobile/MobileNav";
import MobileAuth from "./mobile/MobileAuth";
import MobileLanguageSelector from "./mobile/MobileLanguageSelector";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileMenu = ({ isMenuOpen, setIsMenuOpen }: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(80); // Default header height (h-20)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Dynamically calculate header height to position menu correctly
      const headerElement = document.querySelector('header');
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const handleSignOut = async () => {
    try {
      console.log('MobileMenu: Starting sign out...');
      await signOut();
      console.log('MobileMenu: Sign out completed, navigating to home...');
      setIsMenuOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('MobileMenu: Error during sign out:', error);
      // Even if there's an error, close menu and navigate (in case of expired session)
      setIsMenuOpen(false);
      navigate('/', { replace: true });
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

  // Check if user can access seller dashboard
  const canAccessSellerDashboard = profile?.user_type === 'agent' ||
                                          profile?.user_type === 'property_owner' ||
                                          profile?.user_type === 'real_estate_office' ||
                                          profile?.user_type === 'partner_and_site_owner';

  // Check if user can access support dashboard
  const canAccessSupportDashboard = profile?.user_type === 'support';
                                          
  const onLinkClick = () => setIsMenuOpen(false);

  const onHomeClick = () => {
    setIsMenuOpen(false);
    navigate('/');
  };

  const menuDropdown = (
    <div 
      ref={menuRef} 
      className={`lg:hidden fixed inset-x-0 z-[60] overflow-hidden
        bg-white/95 dark:bg-[#0b1421]/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800
        transition-all duration-500 ease-out
        ${isMenuOpen 
          ? 'opacity-100 translate-y-0 max-h-screen' 
          : 'opacity-0 -translate-y-4 max-h-0'
        }`}
      style={{ 
        top: `${headerHeight}px`,
        boxShadow: isMenuOpen ? '0 10px 25px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <div className={`transform transition-all duration-500 ease-out delay-100
        ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="py-4 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className={`transform transition-all duration-300 ease-out delay-150
            ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
            <MobileSearch setIsMenuOpen={setIsMenuOpen} />
          </div>
          
          <div className={`transform transition-all duration-300 ease-out delay-200
            ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
            <MobileNav
              user={user}
              canAccessSellerDashboard={canAccessSellerDashboard}
              canAccessSupportDashboard={canAccessSupportDashboard}
              onLinkClick={onLinkClick}
              onHomeClick={onHomeClick}
            />
          </div>
          
          <div className={`transform transition-all duration-300 ease-out delay-250
            ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
            <MobileAuth
              user={user}
              displayName={getUserDisplayName()}
              initials={getUserInitials()}
              avatarUrl={getAvatarUrl()}
              handleSignOut={handleSignOut}
              onSignInClick={onLinkClick}
            />
          </div>
          
          <div className={`transform transition-all duration-300 ease-out delay-300
            ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
            <MobileLanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button - Style matches desktop UserMenu */}
      <div ref={triggerRef}>
        {user ? (
          <Button
            variant="ghost"
            className="lg:hidden rounded-full border border-gray-200 dark:border-gray-700 p-1 hover:shadow-md transition-all duration-300 hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse px-2">
              <div className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                {isMenuOpen 
                  ? <X className="w-4 h-4 text-gray-600 dark:text-white" /> 
                  : <Menu className="w-4 h-4 text-gray-600 dark:text-white" />}
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback className="bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full transition-all duration-300 hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
              {isMenuOpen 
                ? <X className="w-6 h-6 text-gray-600 dark:text-white" /> 
                : <Menu className="w-6 h-6 text-gray-600 dark:text-white" />}
            </div>
          </Button>
        )}
      </div>

      {/* Mobile Menu Dropdown with Beautiful Sliding Animation */}
      {createPortal(menuDropdown, document.body)}
    </>
  );
};

export default MobileMenu;
