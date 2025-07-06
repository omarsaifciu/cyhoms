
import { useState, ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, User, Calendar, MessageSquare, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReports } from '@/hooks/useReports';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserReportsDialogProps {
  userId: string;
  userName: string;
  children: ReactNode;
}

interface UserReportData {
  id: string;
  report_type: string;
  reason: string;
  status: string;
  created_at: string;
  reporter_profile: {
    full_name: string;
    username: string;
    avatar_url?: string;
  };
}

const UserReportsDialog = ({ userId, userName, children }: UserReportsDialogProps) => {
  const { currentLanguage } = useLanguage();
  const { fetchUserReports, loading } = useReports();
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState<UserReportData[]>([]);

  const reportTypes = {
    inappropriate_behavior: {
      ar: 'سلوك غير مناسب',
      en: 'Inappropriate Behavior',
      tr: 'Uygunsuz Davranış'
    },
    fake_listings: {
      ar: 'إعلانات وهمية',
      en: 'Fake Listings',
      tr: 'Sahte İlanlar'
    },
    scam: {
      ar: 'نصب واحتيال',
      en: 'Scam',
      tr: 'Dolandırıcılık'
    },
    harassment: {
      ar: 'مضايقة',
      en: 'Harassment',
      tr: 'Taciz'
    },
    fraud: {
      ar: 'احتيال',
      en: 'Fraud',
      tr: 'Dolandırıcılık'
    },
    other: {
      ar: 'أخرى',
      en: 'Other',
      tr: 'Diğer'
    }
  };

  const statusTypes = {
    pending: {
      ar: 'قيد المراجعة',
      en: 'Pending',
      tr: 'Beklemede'
    },
    reviewed: {
      ar: 'تمت المراجعة',
      en: 'Reviewed',
      tr: 'İncelendi'
    },
    resolved: {
      ar: 'تم الحل',
      en: 'Resolved',
      tr: 'Çözüldü'
    },
    dismissed: {
      ar: 'مرفوض',
      en: 'Dismissed',
      tr: 'Reddedildi'
    }
  };

  useEffect(() => {
    if (open) {
      loadReports();
    }
  }, [open]);

  const loadReports = async () => {
    const result = await fetchUserReports();
    if (result.data) {
      // Filter reports for this specific user
      const userReports = result.data.filter((report: any) => report.reported_user_id === userId);
      setReports(userReports);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'dismissed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleUserClick = (username: string) => {
    window.open(`/user/${username}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {currentLanguage === 'ar' ? `البلاغات ضد ${userName}` : `Reports against ${userName}`}
          </DialogTitle>
          <DialogDescription>
            {currentLanguage === 'ar' 
              ? 'جميع البلاغات المقدمة ضد هذا المستخدم' 
              : 'All reports submitted against this user'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">
                {currentLanguage === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
              </p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {currentLanguage === 'ar' ? 'لا توجد بلاغات' : 'No Reports'}
              </h3>
              <p className="text-gray-500">
                {currentLanguage === 'ar' ? 'لم يتم تقديم أي بلاغات ضد هذا المستخدم' : 'No reports have been submitted against this user'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {currentLanguage === 'ar' ? `إجمالي البلاغات: ${reports.length}` : `Total Reports: ${reports.length}`}
              </div>
              
              {reports.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 rounded-full p-2">
                          <User className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {reportTypes[report.report_type]?.[currentLanguage] || report.report_type}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.created_at).toLocaleDateString(
                              currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
                              { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(report.status)} font-medium`}>
                        {statusTypes[report.status]?.[currentLanguage] || report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {currentLanguage === 'ar' ? 'المبلغ:' : 'Reported by:'}
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={report.reporter_profile?.avatar_url} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {report.reporter_profile?.full_name?.charAt(0) || report.reporter_profile?.username?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Button
                            variant="link"
                            className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            onClick={() => handleUserClick(report.reporter_profile?.username)}
                          >
                            {report.reporter_profile?.full_name || report.reporter_profile?.username || 'Unknown User'}
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                          {report.reporter_profile?.username && (
                            <p className="text-sm text-gray-500">@{report.reporter_profile.username}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {currentLanguage === 'ar' ? 'نوع البلاغ:' : 'Report Type:'}
                      </h4>
                      <p className="text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-200">
                        {reportTypes[report.report_type]?.[currentLanguage] || report.report_type}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {currentLanguage === 'ar' ? 'تفاصيل البلاغ:' : 'Report Details:'}
                      </h4>
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-3 border">
                        {report.reason}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserReportsDialog;
