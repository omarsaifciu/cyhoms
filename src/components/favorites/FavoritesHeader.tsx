
import { Heart } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserProfile } from "@/types/user";

interface FavoritesHeaderProps {
  user: User | null;
  profile?: UserProfile | null;
}

const FavoritesHeader = ({ user, profile }: FavoritesHeaderProps) => {
  const { currentLanguage } = useLanguage();

  const title = currentLanguage === 'ar' ? 'المفضلة' : currentLanguage === 'tr' ? 'Favoriler' : 'My Favorites';
  const description = currentLanguage === 'ar' ? 'العقارات التي أضفتها إلى قائمة المفضلة الخاصة بك' : currentLanguage === 'tr' ? 'Favori listenize kaydettiğiniz mülkler' : 'Properties you have saved to your favorites list.';
  const welcome = currentLanguage === 'ar' ? 'مرحباً بعودتك، ' : currentLanguage === 'tr' ? 'Tekrar hoş geldin, ' : 'Welcome back, ';

  const userDisplayName =
    profile?.full_name?.trim() && profile?.full_name !== ""
      ? profile.full_name
      : user?.user_metadata?.full_name ||
        user?.email?.split('@')[0] ||
        "";

  return (
    <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-blue-500/10 dark:ring-blue-400/20"
        style={{
          background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
        }}
      >
        <Heart className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">{title}</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-2xl mx-auto">
        {description}
      </p>
      {user && (
        <div className="mt-6 p-4 backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl max-w-md mx-auto transition-all duration-300 hover:shadow-2xl">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {welcome}{userDisplayName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesHeader;
