
import { Link } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface MobileAuthProps {
  user: SupabaseUser | null;
  displayName: string;
  initials: string;
  avatarUrl?: string;
  handleSignOut: () => void;
  onSignInClick: () => void;
}

const MobileAuth = ({
  user, displayName, initials, avatarUrl, handleSignOut, onSignInClick
}: MobileAuthProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="px-4 pt-4 border-t border-gray-100 dark:border-[#293345]">
      {user ? (
        <div className="space-y-3 rounded-2xl p-4 mt-2 shadow-md bg-white dark:bg-[#151826]">
          {/* معلومات المستخدم */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse py-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{displayName}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{user?.email}</div>
            </div>
          </div>
          {/* زر تسجيل الخروج بشكل متدرج */}
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className={`
              w-full rounded-full font-semibold
              py-3 text-base flex items-center justify-center gap-2
              bg-gradient-to-r from-[#2ca5b5] to-[#3bdac9]
              text-white
              shadow-none
              hover:brightness-95 transition
              border-0
            `}
            style={{ boxShadow: "0 0 0 0" }}
          >
            <LogOut className="w-4 h-4 mr-2 text-white" />
            <span>
              {currentLanguage === 'ar' ? 'تسجيل الخروج' :
                currentLanguage === 'tr' ? 'Çıkış Yap' :
                  'Sign out'}
            </span>
          </Button>
        </div>
      ) : (
        <Link to="/auth" onClick={onSignInClick}>
          <Button
            className="
              w-full rounded-full font-semibold
              py-3 flex items-center justify-center gap-2
              bg-gradient-to-r from-[#2ca5b5] to-[#3bdac9] 
              text-white
              hover:brightness-95 transition
              shadow-md
              border-0
              mt-2
            "
          >
            <UserCircle className="w-4 h-4 mr-2 text-white" />
            {currentLanguage === 'ar' ? 'تسجيل الدخول' :
              currentLanguage === 'tr' ? 'Giriş Yap' :
                'Sign in'}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default MobileAuth;
