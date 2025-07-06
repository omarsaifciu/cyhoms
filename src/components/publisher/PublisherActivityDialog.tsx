import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Home, 
  Edit, 
  EyeOff, 
  Eye,
  DollarSign, 
  Trash2, 
  Calendar,
  Activity,
  LogIn,
  LogOut,
  Image
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, tr, enUS } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface PublisherActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const PublisherActivityDialog = ({
  open,
  onOpenChange
}: PublisherActivityDialogProps) => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user?.id) {
      fetchUserActivities();
    }
  }, [open, user?.id]);

  const fetchUserActivities = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = async () => {
    if (!user?.id) return;

    try {
      // Call the function to add sample data
      const { error } = await supabase.rpc('add_sample_activity_data', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Error adding sample data:', error);
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ?
            'حدث خطأ أثناء إضافة البيانات التجريبية' :
            'Error adding sample data',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: currentLanguage === 'ar' ? 'تم بنجاح' : 'Success',
        description: currentLanguage === 'ar' ?
          'تم إضافة البيانات التجريبية بنجاح' :
          'Sample data added successfully'
      });

      // Refresh the activities
      await fetchUserActivities();
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ?
          'حدث خطأ أثناء إضافة البيانات التجريبية' :
          'Error adding sample data',
        variant: 'destructive'
      });
    }
  };

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'property_created': return <Home className="w-4 h-4" />;
      case 'property_updated': return <Edit className="w-4 h-4" />;
      case 'property_deleted': return <Trash2 className="w-4 h-4" />;
      case 'property_hidden': return <EyeOff className="w-4 h-4" />;
      case 'property_shown': return <Eye className="w-4 h-4" />;
      case 'property_sold': 
      case 'property_rented': return <DollarSign className="w-4 h-4" />;
      case 'status_changed': return <Activity className="w-4 h-4" />;
      case 'price_changed': return <DollarSign className="w-4 h-4" />;
      case 'images_updated': return <Image className="w-4 h-4" />;
      case 'login': return <LogIn className="w-4 h-4" />;
      case 'logout': return <LogOut className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'property_created': return 'bg-green-100 text-green-800 border-green-200';
      case 'property_updated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'property_deleted': return 'bg-red-100 text-red-800 border-red-200';
      case 'property_hidden': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'property_shown': return 'bg-green-100 text-green-800 border-green-200';
      case 'property_sold': 
      case 'property_rented': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'status_changed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'price_changed': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'images_updated': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'login': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'logout': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
        case 'status_changed': return 'تغيير الحالة';
        case 'price_changed': return 'تغيير السعر';
        case 'images_updated': return 'تحديث الصور';
        case 'login': return 'تسجيل دخول';
        case 'logout': return 'تسجيل خروج';
        default: return 'نشاط';
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
        case 'price_changed': return 'Price Changed';
        case 'images_updated': return 'Images Updated';
        case 'login': return 'Login';
        case 'logout': return 'Logout';
        default: return 'Activity';
      }
    }
  };

  const getActivityDetails = (activity: ActivityLog) => {
    const details = activity.action_details || {};
    const propertyTitle = details.property_title || activity.property_title || 'Unknown Property';

    if (currentLanguage === 'ar') {
      switch (activity.action_type) {
        case 'property_created':
          return `تم إنشاء عقار جديد: ${propertyTitle}`;
        case 'property_updated':
          const changes = details.changes ? details.changes.join(', ') : 'تحديثات عامة';
          return `تم تحديث العقار: ${propertyTitle} (${changes})`;
        case 'property_deleted':
          return `تم حذف العقار: ${propertyTitle}`;
        case 'property_hidden':
          return `تم إخفاء العقار: ${propertyTitle}`;
        case 'property_shown':
          return `تم إظهار العقار: ${propertyTitle}`;
        case 'property_sold':
          return `تم بيع العقار: ${propertyTitle}`;
        case 'property_rented':
          return `تم تأجير العقار: ${propertyTitle}`;
        case 'status_changed':
          return `تم تغيير حالة العقار: ${propertyTitle} من ${details.old_status || 'غير محدد'} إلى ${details.new_status || 'غير محدد'}`;
        case 'price_changed':
          return `تم تغيير سعر العقار: ${propertyTitle}`;
        case 'images_updated':
          return `تم تحديث صور العقار: ${propertyTitle}`;
        case 'login':
          return 'تم تسجيل الدخول';
        case 'logout':
          return 'تم تسجيل الخروج';
        default:
          return `نشاط: ${activity.action_type}`;
      }
    } else {
      switch (activity.action_type) {
        case 'property_created':
          return `Created new property: ${propertyTitle}`;
        case 'property_updated':
          const changes = details.changes ? details.changes.join(', ') : 'general updates';
          return `Updated property: ${propertyTitle} (${changes})`;
        case 'property_deleted':
          return `Deleted property: ${propertyTitle}`;
        case 'property_hidden':
          return `Hidden property: ${propertyTitle}`;
        case 'property_shown':
          return `Shown property: ${propertyTitle}`;
        case 'property_sold':
          return `Sold property: ${propertyTitle}`;
        case 'property_rented':
          return `Rented property: ${propertyTitle}`;
        case 'status_changed':
          return `Changed property status: ${propertyTitle} from ${details.old_status || 'unknown'} to ${details.new_status || 'unknown'}`;
        case 'price_changed':
          return `Changed property price: ${propertyTitle}`;
        case 'images_updated':
          return `Updated property images: ${propertyTitle}`;
        case 'login':
          return 'Logged in';
        case 'logout':
          return 'Logged out';
        default:
          return `Activity: ${activity.action_type}`;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              {currentLanguage === 'ar' ?
                'سجل أنشطتي' :
                'My Activity Log'}
            </DialogTitle>
            {activities.length === 0 && (
              <Button onClick={addSampleData} variant="outline" size="sm">
                {currentLanguage === 'ar' ? 'إضافة بيانات تجريبية' : 'Add Sample Data'}
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentLanguage === 'ar' ? 'لا توجد أنشطة' : 'No Activities'}
              </h3>
              <p className="text-gray-600">
                {currentLanguage === 'ar' ? 'لم يتم تسجيل أي أنشطة بعد.' : 'No activities have been recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-4 p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
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

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublisherActivityDialog;
