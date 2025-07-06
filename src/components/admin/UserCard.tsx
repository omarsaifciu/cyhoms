
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mail, Clock, Infinity, Ban, ExternalLink, Home, AlertTriangle, Activity } from "lucide-react";
import UserActions from "./UserActions";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminUserActivityDialog from "./AdminUserActivityDialog";
import { useState } from "react";

interface User {
  id: string;
  full_name: string | null;
  phone: string;
  email: string;
  username?: string;
  user_type: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support';
  is_approved: boolean;
  is_verified?: boolean;
  is_suspended?: boolean;
  is_trial_active?: boolean;
  trial_started_at?: string;
  created_at: string;
  avatar_url?: string;
  whatsapp_number?: string;
}

interface UserCardProps {
  user: User;
  onToggleApproval: (userId: string, currentStatus: boolean) => void;
  onToggleVerification: (userId: string, currentStatus: boolean) => void;
  onUpdateUserType: (userId: string, newType: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support') => void;
  onDeleteUser: (userId: string, email: string) => void;
  onTrialUpdated?: () => void;
  onToggleSuspension: (userId: string, currentStatus: boolean) => void;
  onOpenProfile: (username: string) => void;
}

const UserCard = ({
  user,
  onToggleApproval,
  onToggleVerification,
  onUpdateUserType,
  onDeleteUser,
  onTrialUpdated,
  onToggleSuspension,
  onOpenProfile
}: UserCardProps) => {
  const { currentLanguage } = useLanguage();
  const [showActivityDialog, setShowActivityDialog] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      currentLanguage === 'ar' ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        calendar: 'gregory' // Force Gregorian calendar for Arabic
      }
    );
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'client': return currentLanguage === 'ar' ? 'عميل' : 'Client';
      case 'agent': return currentLanguage === 'ar' ? 'وسيط' : currentLanguage === 'tr' ? 'Acente' : 'Agent';
      case 'property_owner': return currentLanguage === 'ar' ? 'مالك عقار' : 'Property Owner';
      case 'real_estate_office': return currentLanguage === 'ar' ? 'مكتب عقارات' : 'Real Estate Office';
      case 'partner_and_site_owner': return currentLanguage === 'ar' ? 'شريك ومالك الموقع' : 'Partner & Site Owner';
      case 'support': return currentLanguage === 'ar' ? 'دعم فني' : currentLanguage === 'tr' ? 'Destek' : 'Support';
      default: return type;
    }
  };

  const getAvatarFallback = () => {
    if (user.full_name) {
      // Extract first two letters from the first name
      const firstName = user.full_name.trim().split(' ')[0];
      return firstName.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const isPermanentTrial = user.trial_started_at && new Date(user.trial_started_at) < new Date('2010-01-01');

  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-lg ${user.is_suspended ? 'border-red-200 bg-red-50/30' : 'hover:border-primary/20'}`}>
      <CardContent className="p-6 h-full flex flex-col">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
            <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">
                {user.full_name || (currentLanguage === 'ar' ? 'غير محدد' : 'Not specified')}
              </h3>
              {user.is_verified && <VerifiedBadge size="sm" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenProfile(user.username || user.id)}
                className="ml-auto p-1 h-auto hover:bg-blue-50"
                title={currentLanguage === 'ar' ? 'فتح الملف الشخصي' : 'Open Profile'}
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </Button>
            </div>
            
            <Badge variant="outline" className="mb-2">
              {getUserTypeLabel(user.user_type)}
            </Badge>
          </div>
        </div>

        {/* Contact Information with Hyperlinks */}
        <div className="space-y-3 mb-4 flex-1">
          {/* Email - More prominent display */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
            <Mail className="w-5 h-5 flex-shrink-0 text-blue-600" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-blue-700 mb-1">
                {currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </div>
              {user.email && !user.email.includes('@temp-email.com') ? (
                <a
                  href={`mailto:${user.email}`}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline transition-colors block break-all"
                  title={currentLanguage === 'ar' ? 'إرسال إيميل' : 'Send Email'}
                >
                  {user.email}
                </a>
              ) : (
                <div className="text-sm block break-all">
                  <span className="text-gray-600 font-medium">
                    {user.username || user.full_name || 'مستخدم'}
                  </span>
                  <div className="text-xs text-orange-600 mt-1">
                    {currentLanguage === 'ar' ? 'إيميل مؤقت - يحتاج تحديث' : 'Temporary Email - Needs Update'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Phone - Consistent with email design */}
          {user.phone && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-5 h-5 flex-shrink-0 text-green-600" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">
                  {currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone'}
                </div>
                <a
                  href={`tel:${user.phone}`}
                  className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline transition-colors"
                  title={currentLanguage === 'ar' ? 'اتصال' : 'Call'}
                >
                  {user.phone}
                </a>
              </div>
            </div>
          )}

          {/* WhatsApp - Consistent with email and phone design */}
          {user.whatsapp_number && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 flex-shrink-0 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">
                  {currentLanguage === 'ar' ? 'واتساب' : 'WhatsApp'}
                </div>
                <a
                  href={`https://wa.me/${user.whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline transition-colors"
                  title={currentLanguage === 'ar' ? 'فتح واتساب' : 'Open WhatsApp'}
                >
                  {user.whatsapp_number}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {user.is_suspended ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Ban className="w-3 h-3" />
              {currentLanguage === 'ar' ? 'موقوف' : (currentLanguage === 'tr' ? 'Askıya Alındı' : 'Suspended')}
            </Badge>
          ) : (
            <Badge variant={user.is_approved ? "default" : "secondary"}>
              {user.is_approved ? 
                (currentLanguage === 'ar' ? 'موافق عليه' : 'Approved') : 
                (currentLanguage === 'ar' ? 'في انتظار الموافقة' : 'Pending')
              }
            </Badge>
          )}

          {user.user_type !== 'client' && (
            <>
              {user.is_trial_active ? (
                <Badge variant={isPermanentTrial ? "default" : "secondary"}>
                  {isPermanentTrial ? (
                    <>
                      <Infinity className="w-3 h-3 mr-1" />
                      {currentLanguage === 'ar' ? 'دائمة' : 'Permanent'}
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      {currentLanguage === 'ar' ? 'نشطة' : 'Active'}
                    </>
                  )}
                </Badge>
              ) : (
                <Badge variant="outline">
                  {currentLanguage === 'ar' ? 'غير نشطة' : 'Inactive'}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Home className="w-4 h-4 text-blue-500" />
            <span className="font-medium">0</span>
            <span className="text-muted-foreground">
              {currentLanguage === 'ar' ? 'عقارات' : 'Properties'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="font-medium">0</span>
            <span className="text-muted-foreground">
              {currentLanguage === 'ar' ? 'بلاغات' : 'Reports'}
            </span>
          </div>
        </div>

        {/* View Activity Button - For all users */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowActivityDialog(true)}
            className="w-full flex items-center gap-2 text-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <Activity className="w-4 h-4 text-blue-600" />
            {currentLanguage === 'ar' ? 'مشاهدة النشاط' :
             currentLanguage === 'tr' ? 'Etkinliği Görüntüle' :
             'View Activity'}
          </Button>
        </div>

        {/* Registration Date */}
        <div className="text-sm text-muted-foreground mb-4">
          {currentLanguage === 'ar' ? 'تاريخ التسجيل:' : 'Registered:'} {formatDate(user.created_at)}
        </div>

        {/* Actions */}
        <div className="mt-auto">
          <UserActions
            user={user}
            onToggleApproval={onToggleApproval}
            onToggleVerification={onToggleVerification}
            onUpdateUserType={onUpdateUserType}
            onDeleteUser={onDeleteUser}
            onTrialUpdated={onTrialUpdated}
            onToggleSuspension={onToggleSuspension}
          />
        </div>
      </CardContent>

      {/* Activity Dialog */}
      <AdminUserActivityDialog
        open={showActivityDialog}
        onOpenChange={setShowActivityDialog}
        userId={user.id}
        userName={user.full_name || user.email}
      />
    </Card>
  );
};

export default UserCard;
