
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { UserProfile } from "@/types/user";
import { User } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import AvatarUpload from "./AvatarUpload";

interface ProfileSummaryCardProps {
  profile: UserProfile;
  user: User;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

const ProfileSummaryCard = ({ profile, user, onAvatarUpdate }: ProfileSummaryCardProps) => {
  const { t } = useLanguage();

  // Function to get first two letters of full name in uppercase
  const getAvatarInitials = () => {
    const fullName = profile.full_name || user?.email?.split('@')[0] || 'User';
    // Remove extra spaces and get first two characters
    const cleanName = fullName.trim();
    if (cleanName.length >= 2) {
      return cleanName.substring(0, 2).toUpperCase();
    } else if (cleanName.length === 1) {
      return cleanName.toUpperCase() + 'U'; // fallback if only one character
    }
    return 'US'; // fallback for 'User'
  };

  return (
    <Card className="animate-scale-in hover-scale transition-all duration-300 hover:shadow-xl border-0 
      bg-white dark:bg-[#181926] dark:border-none dark:backdrop-blur-0 backdrop-blur-0">
      <CardContent className="p-6 dark:text-gray-100 text-gray-900">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <AvatarUpload
              currentAvatarUrl={profile.avatar_url || undefined}
              userName={getAvatarInitials()}
              onAvatarUpdate={onAvatarUpdate}
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-100 text-gray-900">
            {profile.full_name || user?.email?.split('@')[0]}
          </h2>
          
          {profile.username && (
            <p className="mb-2 dark:text-gray-300 text-gray-500">@{profile.username}</p>
          )}
          
          <p className="mb-4 dark:text-gray-200 text-gray-600">{user?.email}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <Badge 
                variant={profile.is_approved ? "default" : "secondary"}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  profile.is_approved 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-950 dark:text-yellow-200'
                }`}
              >
                {profile.is_approved ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {profile.is_approved ? t('approved') : t('pending')}
              </Badge>
            </div>
            
            {profile.created_at && (
              <div className="flex items-center justify-center text-sm dark:text-gray-300 text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {t('memberSince')} {format(new Date(profile.created_at), 'MMM yyyy')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummaryCard;
