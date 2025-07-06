import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  Home,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  DollarSign,
  RefreshCw,
  Calendar,
  User,
  MapPin,
  X,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ar, tr, enUS } from 'date-fns/locale';
import { adminSeedUserActivity } from '@/utils/seedUserActivity';
import { createTableDirectly } from '@/utils/createUserActivityTable';

interface AdminUserActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  action_details: any;
  created_at: string;
  property_title?: string;
  property_id?: string;
}

const AdminUserActivityDialog = ({ 
  open, 
  onOpenChange, 
  userId, 
  userName 
}: AdminUserActivityDialogProps) => {
  const { currentLanguage } = useLanguage();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      fetchUserActivities();
    }
  }, [open, userId]);

  const fetchUserActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching user activities:', error);
        return;
      }

      setActivities(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    if (userId && userName) {
      await adminSeedUserActivity(userId, userName);
      await fetchUserActivities();
    }
  };

  const handleCreateTable = async () => {
    const result = await createTableDirectly();
    if (result.success) {
      alert(currentLanguage === 'ar' ?
        'تم إنشاء الجدول بنجاح! يمكنك الآن إضافة الأنشطة.' :
        'Table created successfully! You can now add activities.');
      await fetchUserActivities();
    } else {
      // Show instructions for manual table creation
      const instructions = `
${currentLanguage === 'ar' ? 'يرجى إنشاء الجدول يدوياً في Supabase:' : 'Please create the table manually in Supabase:'}

1. ${currentLanguage === 'ar' ? 'اذهب إلى Supabase Dashboard' : 'Go to Supabase Dashboard'}
2. ${currentLanguage === 'ar' ? 'افتح SQL Editor' : 'Open SQL Editor'}
3. ${currentLanguage === 'ar' ? 'شغل هذا الكود:' : 'Run this code:'}

CREATE TABLE user_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Fix RLS policies
DROP POLICY IF EXISTS "Admins can view all activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity logs for any user" ON user_activity_logs;

CREATE POLICY "admin_select_all" ON user_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "admin_insert_all" ON user_activity_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

${currentLanguage === 'ar' ? 'راجع ملف docs/CREATE_USER_ACTIVITY_TABLE.md للتفاصيل الكاملة' : 'See docs/CREATE_USER_ACTIVITY_TABLE.md for full details'}
      `;
      alert(instructions);
    }
  };

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'property_created':
        return <Home className="w-4 h-4" />;
      case 'property_updated':
        return <Edit className="w-4 h-4" />;
      case 'property_deleted':
        return <Trash2 className="w-4 h-4" />;
      case 'property_hidden':
        return <EyeOff className="w-4 h-4" />;
      case 'property_shown':
        return <Eye className="w-4 h-4" />;
      case 'property_sold':
      case 'property_rented':
        return <DollarSign className="w-4 h-4" />;
      case 'status_changed':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'property_created':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'property_updated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'property_deleted':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'property_hidden':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'property_shown':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'property_sold':
      case 'property_rented':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'status_changed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityTitle = (actionType: string) => {
    if (currentLanguage === 'ar') {
      switch (actionType) {
        case 'property_created': return 'إنشاء عقار';
        case 'property_updated': return 'تحديث عقار';
        case 'property_deleted': return 'حذف عقار';
        case 'property_hidden': return 'إخفاء عقار';
        case 'property_shown': return 'إظهار عقار';
        case 'property_sold': return 'بيع عقار';
        case 'property_rented': return 'تأجير عقار';
        case 'status_changed': return 'تغيير حالة';
        default: return 'نشاط';
      }
    } else if (currentLanguage === 'tr') {
      switch (actionType) {
        case 'property_created': return 'Mülk Oluşturuldu';
        case 'property_updated': return 'Mülk Güncellendi';
        case 'property_deleted': return 'Mülk Silindi';
        case 'property_hidden': return 'Mülk Gizlendi';
        case 'property_shown': return 'Mülk Gösterildi';
        case 'property_sold': return 'Mülk Satıldı';
        case 'property_rented': return 'Mülk Kiralandı';
        case 'status_changed': return 'Durum Değişti';
        default: return 'Etkinlik';
      }
    } else {
      switch (actionType) {
        case 'property_created': return 'Property Created';
        case 'property_updated': return 'Property Updated';
        case 'property_deleted': return 'Property Deleted';
        case 'property_hidden': return 'Property Hidden';
        case 'property_shown': return 'Property Shown';
        case 'property_sold': return 'Property Sold';
        case 'property_rented': return 'Property Rented';
        case 'status_changed': return 'Status Changed';
        default: return 'Activity';
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = currentLanguage === 'ar' ? ar : currentLanguage === 'tr' ? tr : enUS;
    
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale 
    });
  };

  const getActivityDetails = (activity: ActivityLog) => {
    const details = activity.action_details || {};
    
    if (currentLanguage === 'ar') {
      switch (activity.action_type) {
        case 'property_created':
          return `تم إنشاء عقار جديد: ${details.property_title || 'غير محدد'}`;
        case 'property_updated':
          return `تم تحديث العقار: ${details.property_title || 'غير محدد'}`;
        case 'property_deleted':
          return `تم حذف العقار: ${details.property_title || 'غير محدد'}`;
        case 'property_hidden':
          return `تم إخفاء العقار: ${details.property_title || 'غير محدد'}`;
        case 'property_shown':
          return `تم إظهار العقار: ${details.property_title || 'غير محدد'}`;
        case 'property_sold':
          return `تم بيع العقار: ${details.property_title || 'غير محدد'}`;
        case 'property_rented':
          return `تم تأجير العقار: ${details.property_title || 'غير محدد'}`;
        case 'status_changed':
          return `تم تغيير حالة العقار: ${details.property_title || 'غير محدد'} من ${details.old_status || ''} إلى ${details.new_status || ''}`;
        default:
          return details.property_title || 'نشاط غير محدد';
      }
    } else {
      switch (activity.action_type) {
        case 'property_created':
          return `Created property: ${details.property_title || 'Unknown'}`;
        case 'property_updated':
          return `Updated property: ${details.property_title || 'Unknown'}`;
        case 'property_deleted':
          return `Deleted property: ${details.property_title || 'Unknown'}`;
        case 'property_hidden':
          return `Hidden property: ${details.property_title || 'Unknown'}`;
        case 'property_shown':
          return `Shown property: ${details.property_title || 'Unknown'}`;
        case 'property_sold':
          return `Sold property: ${details.property_title || 'Unknown'}`;
        case 'property_rented':
          return `Rented property: ${details.property_title || 'Unknown'}`;
        case 'status_changed':
          return `Changed status of: ${details.property_title || 'Unknown'} from ${details.old_status || ''} to ${details.new_status || ''}`;
        default:
          return details.property_title || 'Unknown activity';
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              {currentLanguage === 'ar' ?
                `سجل أنشطة ${userName}` :
                currentLanguage === 'tr' ?
                `${userName} Etkinlik Günlüğü` :
                `${userName}'s Activity Log`}
            </DialogTitle>
            {/* Temporary button for testing - remove in production */}
            {activities.length === 0 && (
              <Button onClick={handleSeedData} variant="outline" size="sm">
                {currentLanguage === 'ar' ? 'إضافة بيانات تجريبية' : 'Add Sample Data'}
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="ml-2">
                {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </span>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">
                {currentLanguage === 'ar' ?
                  'لا توجد أنشطة مسجلة لهذا المستخدم' :
                  'No activities recorded for this user'}
              </div>
              <div className="space-y-2">
                <Button onClick={handleCreateTable} variant="outline" size="sm">
                  {currentLanguage === 'ar' ? 'إصلاح صلاحيات الجدول' : 'Fix Table Permissions'}
                </Button>
                <div className="text-xs text-gray-400 max-w-md text-center">
                  {currentLanguage === 'ar' ?
                    'يبدو أن هناك مشكلة في صلاحيات الجدول. اضغط لإصلاحها.' :
                    'There seems to be a permissions issue with the table. Click to fix it.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.action_type)}`}>
                      {getActivityIcon(activity.action_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getActivityColor(activity.action_type)}>
                          {getActivityTitle(activity.action_type)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {getActivityDetails(activity)}
                      </p>
                      
                      {activity.action_details?.price && (
                        <div className="text-xs text-gray-500">
                          {currentLanguage === 'ar' ? 'السعر: ' : 'Price: '}
                          {activity.action_details.price} {activity.action_details.currency || 'EUR'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < activities.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserActivityDialog;
