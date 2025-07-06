import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Clock, Users, CheckCheck, XCircle, Phone, Mail, Search, Grid3X3, List, ExternalLink } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  full_name: string | null;
  phone: string;
  email: string;
  username?: string;
  user_type: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support';
  is_approved: boolean;
  created_at: string;
  avatar_url?: string;
  whatsapp_number?: string;
}

interface PendingApprovalsProps {
  pendingUsers: User[];
  onApprove: (userId: string, currentStatus: boolean) => void;
  onReject: (userId: string) => void;
  onApproveAll: () => void;
  loading: boolean;
}

const PendingApprovals = ({ pendingUsers, onApprove, onReject, onApproveAll, loading }: PendingApprovalsProps) => {
  const { currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter users based on search
  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.whatsapp_number?.includes(searchTerm);
    return matchesSearch;
  });

  const handleOpenProfile = (username: string) => {
    // Open user profile in new tab - using /user/ with username
    window.open(`/user/${username}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      currentLanguage === 'ar' ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        calendar: 'gregory' // Force Gregorian calendar for Arabic
      }
    );
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'agent':
        return currentLanguage === 'ar' ? 'وسيط' : currentLanguage === 'tr' ? 'Acente' : 'Agent';
      case 'support':
        return currentLanguage === 'ar' ? 'دعم فني' : currentLanguage === 'tr' ? 'Destek' : 'Support';
      case 'property_owner':
        return currentLanguage === 'ar' ? 'مالك عقار' : 'Property Owner';
      case 'real_estate_office':
        return currentLanguage === 'ar' ? 'مكتب عقارات' : 'Real Estate Office';
      case 'partner_and_site_owner':
        return currentLanguage === 'ar' ? 'شريك ومالك الموقع' : 'Partner & Site Owner';
      default:
        return userType;
    }
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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <CardTitle>
              {currentLanguage === 'ar' ? 'الطلبات المعلقة' : 'Pending Approvals'}
              <span className="text-sm font-normal text-gray-500 mr-2">
                ({filteredUsers.length} {currentLanguage === 'ar' ? 'طلب' : 'requests'})
              </span>
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4" />
            </Button>

            {pendingUsers.length > 0 && (
              <Button
                onClick={onApproveAll}
                disabled={loading}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                {currentLanguage === 'ar' ? 'الموافقة على الكل' : 'Approve All'}
              </Button>
            )}
          </div>
        </div>
        
        <CardDescription>
          {currentLanguage === 'ar'
            ? 'طلبات الوسطاء ومالكي العقارات ومكاتب العقارات التي تحتاج موافقة للنشر'
            : currentLanguage === 'tr'
            ? 'Yayınlamak için onay gereken acente, mülk sahibi ve emlak ofisi talepleri'
            : 'Agent, property owner and real estate office requests that need approval to publish'
          }
        </CardDescription>

        {/* Search Bar */}
        {pendingUsers.length > 0 && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={currentLanguage === 'ar' ? 'البحث بالاسم أو البريد الإلكتروني أو الهاتف أو الواتساب...' : 'Search by name, email, phone, or WhatsApp...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-500">
              {currentLanguage === 'ar' ? 'جارٍ تحميل الطلبات...' : 'Loading requests...'}
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 
                (currentLanguage === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found') :
                (currentLanguage === 'ar' ? 'لا توجد طلبات معلقة' : 'No pending requests')
              }
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-400 mt-1">
                {currentLanguage === 'ar'
                  ? 'جميع طلبات الوسطاء ومالكي العقارات ومكاتب العقارات تمت الموافقة عليها'
                  : currentLanguage === 'tr'
                  ? 'Tüm acente, mülk sahibi ve emlak ofisi talepleri onaylandı'
                  : 'All agent, property owner and real estate office requests have been approved'
                }
              </p>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="h-full transition-all duration-200 hover:shadow-lg border-orange-200 bg-orange-50/30">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Header with Avatar and Basic Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
                      <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white">
                        {getAvatarFallback(user)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">
                          {user.full_name || (currentLanguage === 'ar' ? 'غير محدد' : 'Not specified')}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenProfile(user.username || user.id)}
                          className="ml-auto p-1 h-auto hover:bg-orange-50"
                          title={currentLanguage === 'ar' ? 'فتح الملف الشخصي' : 'Open Profile'}
                        >
                          <ExternalLink className="w-4 h-4 text-orange-600" />
                        </Button>
                      </div>
                      
                      <Badge variant="outline" className="mb-2 bg-orange-100 text-orange-800">
                        {getUserTypeLabel(user.user_type)}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Information with Hyperlinks */}
                  <div className="space-y-3 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 flex-shrink-0 text-gray-500" />
                      <a 
                        href={`mailto:${user.email}`} 
                        className="truncate text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        title={currentLanguage === 'ar' ? 'إرسال إيميل' : 'Send Email'}
                      >
                        {user.email}
                      </a>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
                        <a 
                          href={`tel:${user.phone}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          title={currentLanguage === 'ar' ? 'اتصال' : 'Call'}
                        >
                          {user.phone}
                        </a>
                      </div>
                    )}

                    {user.whatsapp_number && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <a 
                          href={`https://wa.me/${user.whatsapp_number.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 hover:underline transition-colors"
                          title={currentLanguage === 'ar' ? 'واتساب' : 'WhatsApp'}
                        >
                          {user.whatsapp_number}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Registration Date */}
                  <div className="text-sm text-muted-foreground mb-4">
                    {currentLanguage === 'ar' ? 'تاريخ الطلب:' : 'Request Date:'} {formatDate(user.created_at)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto">
                    <Button
                      size="sm"
                      onClick={() => onApprove(user.id, user.is_approved)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {currentLanguage === 'ar' ? 'موافقة' : 'Approve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white flex-1"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      {currentLanguage === 'ar' ? 'رفض' : 'Reject'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{currentLanguage === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'التواصل' : 'Contact'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'النوع المطلوب' : 'Requested Type'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'تاريخ الطلب' : 'Request Date'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="bg-orange-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
                          <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to text-white">
                            {getAvatarFallback(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            {user.full_name || (currentLanguage === 'ar' ? 'غير محدد' : 'Not specified')}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenProfile(user.username || user.id)}
                            className="p-1 h-auto hover:bg-orange-50"
                            title={currentLanguage === 'ar' ? 'فتح الملف الشخصي' : 'Open Profile'}
                          >
                            <ExternalLink className="w-3 h-3 text-orange-600" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <a 
                            href={`mailto:${user.email}`} 
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate max-w-[200px]"
                            title={currentLanguage === 'ar' ? 'إرسال إيميل' : 'Send Email'}
                          >
                            {user.email}
                          </a>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <a 
                              href={`tel:${user.phone}`} 
                              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              title={currentLanguage === 'ar' ? 'اتصال' : 'Call'}
                            >
                              {user.phone}
                            </a>
                          </div>
                        )}
                        {user.whatsapp_number && (
                          <div className="flex items-center gap-1 text-sm">
                            <svg className="w-3 h-3 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            <a 
                              href={`https://wa.me/${user.whatsapp_number.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 hover:underline transition-colors"
                              title={currentLanguage === 'ar' ? 'واتساب' : 'WhatsApp'}
                            >
                              {user.whatsapp_number}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        {getUserTypeLabel(user.user_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => onApprove(user.id, user.is_approved)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {currentLanguage === 'ar' ? 'موافقة' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onReject(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          {currentLanguage === 'ar' ? 'رفض' : 'Reject'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
