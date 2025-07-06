
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, User, BarChart3, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface MobileNavProps {
  user: SupabaseUser | null;
  canAccessSellerDashboard: boolean;
  canAccessSupportDashboard?: boolean;
  onLinkClick: () => void;
  onHomeClick: () => void;
}

const navLinks = [
  { key: "home", to: "/", label: { ar: "الرئيسية", tr: "Ana Sayfa", en: "Home" }, icon: Home, main: true },
  { key: "favorites", to: "/favorites", label: { ar: "المفضلة", tr: "Favoriler", en: "Favorites" }, icon: Heart },
  { key: "contact", to: "/contact", label: { ar: "تواصل معنا", tr: "İletişim", en: "Contact" }, icon: Phone },
  { key: "profile", to: "/profile", label: { ar: "الملف الشخصي", tr: "Profil", en: "Profile" }, icon: User, auth: true },
  { key: "seller", to: "/dashboard", label: { ar: "لوحة التحكم", tr: "Kontrol Paneli", en: "Dashboard" }, icon: BarChart3, auth: true, seller: true },
  { key: "support", to: "/support-dashboard", label: { ar: "لوحة الدعم الفني", tr: "Destek Paneli", en: "Support Dashboard" }, icon: BarChart3, auth: true, support: true }
];

const MobileNav = ({ user, canAccessSellerDashboard, canAccessSupportDashboard, onLinkClick, onHomeClick }: MobileNavProps) => {
  const { currentLanguage } = useLanguage();
  const location = useLocation();

  return (
    <nav className="px-4 space-y-2">
      {navLinks.map(link => {
        if (link.auth && !user) return null;
        if (link.seller && !canAccessSellerDashboard) return null;
        if (link.support && !canAccessSupportDashboard) return null;

        const isActive = location.pathname === link.to;
        const linkOnClick = link.key === "home" ? onHomeClick : onLinkClick;

        // نضيف مساحة يمين الأيقونة عند اللغة العربية (me-3 = margin-end 12px للـ rtl)
        // وباقي اللغات نستخدم mr-3 كالمعتاد
        const iconSpacing = currentLanguage === "ar" ? "me-3" : "mr-3";

        const baseClasses =
          `flex items-center py-3
           transition-colors
           ${
             isActive
               ? "text-brand-accent dark:text-brand-accent"
               : "text-gray-700 dark:text-white"
           }`;

        const Icon = link.icon;
        return (
          <Link
            key={link.key}
            to={link.to}
            className={baseClasses}
            onClick={linkOnClick}
          >
            <Icon
              className={`w-5 h-5 ${iconSpacing} ${
                isActive ? "text-brand-accent dark:text-brand-accent" : "text-gray-700 dark:text-white"
              }`}
            />
            {link.label[currentLanguage] || link.label.en}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
