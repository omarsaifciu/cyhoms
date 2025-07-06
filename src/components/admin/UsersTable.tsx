
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mail, Clock, Infinity, Ban } from "lucide-react";
import UserActions from "./UserActions";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
}

interface UsersTableProps {
  users: User[];
  onToggleApproval: (userId: string, currentStatus: boolean) => void;
  onToggleVerification: (userId: string, currentStatus: boolean) => void;
  onUpdateUserType: (userId: string, newType: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner') => void;
  onDeleteUser: (userId: string, email: string) => void;
  onTrialUpdated?: () => void;
  onToggleSuspension: (userId: string, currentStatus: boolean) => void;
}

const UsersTable = ({ users, onToggleApproval, onUpdateUserType, onDeleteUser, onTrialUpdated, onToggleVerification, onToggleSuspension }: UsersTableProps) => {
  const { currentLanguage } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );
  };

  const getAvatarFallback = (user: User) => {
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

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {currentLanguage === 'ar' ? 'لا توجد مستخدمين' : 'No users found'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{currentLanguage === 'ar' ? 'الاسم' : 'Name'}</TableHead>
            <TableHead className="min-w-[250px]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                {currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                {currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </div>
            </TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'التجربة المجانية' : 'Free Trial'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}</TableHead>
            <TableHead>{currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isPermanentTrial = user.trial_started_at && new Date(user.trial_started_at) < new Date('2010-01-01');
            
            return (
              <TableRow key={user.id} className={user.is_suspended ? "bg-red-50" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
                      <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white">
                        {getAvatarFallback(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <div>
                        {user.full_name || (currentLanguage === 'ar' ? 'غير محدد' : 'Not specified')}
                      </div>
                      {user.is_verified && <VerifiedBadge size="sm" />}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="min-w-[250px]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    {user.email && !user.email.includes('@temp-email.com') ? (
                      <a
                        href={`mailto:${user.email}`}
                        className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline transition-colors break-all"
                        title={currentLanguage === 'ar' ? 'إرسال إيميل' : 'Send Email'}
                      >
                        {user.email}
                      </a>
                    ) : (
                      <div className="text-sm break-all">
                        <span className="text-gray-600 font-medium">
                          {user.username || user.full_name || 'مستخدم'}
                        </span>
                        <div className="text-xs text-orange-600">
                          {currentLanguage === 'ar' ? 'إيميل مؤقت' : 'Temp Email'}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    {user.phone ? (
                      <a
                        href={`tel:${user.phone}`}
                        className="text-sm text-green-600 hover:text-green-800 hover:underline transition-colors"
                        title={currentLanguage === 'ar' ? 'اتصال' : 'Call'}
                      >
                        {user.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {currentLanguage === 'ar' ? 'غير محدد' : 'Not specified'}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {user.user_type === 'client' && (currentLanguage === 'ar' ? 'عميل' : 'Client')}
                    {user.user_type === 'agent' && (currentLanguage === 'ar' ? 'وسيط' : currentLanguage === 'tr' ? 'Acente' : 'Agent')}
                    {user.user_type === 'property_owner' && (currentLanguage === 'ar' ? 'مالك عقار' : 'Property Owner')}
                    {user.user_type === 'real_estate_office' && (currentLanguage === 'ar' ? 'مكتب عقارات' : 'Real Estate Office')}
                    {user.user_type === 'partner_and_site_owner' && (currentLanguage === 'ar' ? 'شريك ومالك الموقع' : 'Partner & Site Owner')}
                  </Badge>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell>
                  <UserActions
                    user={user}
                    onToggleApproval={onToggleApproval}
                    onToggleVerification={onToggleVerification}
                    onUpdateUserType={onUpdateUserType}
                    onDeleteUser={onDeleteUser}
                    onTrialUpdated={onTrialUpdated}
                    onToggleSuspension={onToggleSuspension}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
