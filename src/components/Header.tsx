
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "./header/LanguageSelector";
import SearchBar from "./header/SearchBar";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";
import Logo from "./Logo";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import AnnouncementBar from "./header/AnnouncementBar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const clearSearch = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // مكون زر تبديل المود الصغير
  const ThemeToggleIcon = () => (
    <button
      className="ml-2 flex items-center justify-center rounded-full bg-transparent border border-gray-200 dark:border-gray-700 p-2 hover:bg-gray-100 dark:hover:bg-[#23293d] transition-all"
      aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-background/95 backdrop-blur-lg shadow-lg border-b border-gray-100 dark:border-gray-800"
          : "bg-white/80 dark:bg-background/80 backdrop-blur-md"
      }`}
    >
      <AnnouncementBar />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="group" onClick={clearSearch}>
            <Logo className="group-hover:scale-110 transition-transform duration-300" />
          </Link>
          
          {/* Search Bar - Now shows on lg and up */}
          <div className="hidden lg:flex flex-1 justify-center mx-2 lg:mx-4 max-w-xl">
            <SearchBar />
          </div>
          
          {/* Desktop Navigation - lg and up */}
          <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
            <NotificationDropdown />
            <LanguageSelector />
            {/* إذا المستخدم غير مسجل الدخول، أظهر زر تغيير المود بجانب زر تسجيل الدخول */}
            {!user && <ThemeToggleIcon />}
            <UserMenu />
          </div>
          
          {/* Mobile navigation (menu button only) - Now shows on screens smaller than lg */}
          <div className="flex lg:hidden items-center space-x-2 rtl:space-x-reverse">
            {user && <NotificationDropdown />}
            {/* إذا المستخدم غير مسجل الدخول، أظهر زر تغيير المود بجانب زر تسجيل الدخول بالنسبة للموبايل */}
            {!user && <ThemeToggleIcon />}
            <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

