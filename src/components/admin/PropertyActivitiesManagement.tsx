
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Eye, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertyActivity {
  id: string;
  property_id: string;
  action_type: string;
  action_details: any;
  performed_at: string;
  property_title: string;
  property_owner_id: string;
  performer_name: string;
  performer_email: string;
  owner_name: string;
  owner_email: string;
}

interface UserProfile {
  id: string;
  full_name: string;
}

const PropertyActivitiesManagement = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [activities, setActivities] = useState<PropertyActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // First get activities data
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('property_activities')
        .select('*')
        .order('performed_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      if (!activitiesData || activitiesData.length === 0) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Get all unique user IDs with proper filtering
      const performerIds = activitiesData.map(a => a.performed_by).filter(Boolean);
      const ownerIds = activitiesData.map(a => a.property_owner_id).filter(Boolean);
      const userIds = [...new Set([...performerIds, ...ownerIds])];

      // Get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.warn('Could not fetch profiles:', profilesError);
      }

      // Get auth users for emails - using a simpler approach
      const authUsersMap = new Map<string, string>();
      try {
        const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
        if (!authError && authResponse?.users) {
          authResponse.users.forEach((user: any) => {
            if (user?.id && user?.email && userIds.includes(user.id)) {
              authUsersMap.set(user.id, user.email);
            }
          });
        }
      } catch (error) {
        console.warn('Could not fetch auth users:', error);
      }

      // Combine data
      const activitiesWithUserInfo = activitiesData.map(activity => {
        const performerProfile = profiles?.find((p: UserProfile) => p.id === activity.performed_by);
        const ownerProfile = profiles?.find((p: UserProfile) => p.id === activity.property_owner_id);
        const performerEmail = authUsersMap.get(activity.performed_by) || 'غير متوفر';
        const ownerEmail = authUsersMap.get(activity.property_owner_id) || 'غير متوفر';

        return {
          ...activity,
          performer_name: performerProfile?.full_name || 'غير معروف',
          performer_email: performerEmail,
          owner_name: ownerProfile?.full_name || 'غير معروف',
          owner_email: ownerEmail
        };
      });

      setActivities(activitiesWithUserInfo);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحميل الأنشطة' : 'Failed to load activities'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case 'deleted':
        return currentLanguage === 'ar' ? 'حذف العقار' : 'Property Deleted';
      case 'status_changed':
        return currentLanguage === 'ar' ? 'تغيير الحالة' : 'Status Changed';
      case 'created':
        return currentLanguage === 'ar' ? 'إنشاء العقار' : 'Property Created';
      default:
        return actionType;
    }
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'status_changed':
        return 'bg-green-100 text-green-800';
      case 'created':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'deleted':
        return <Trash2 className="w-4 h-4" />;
      case 'status_changed':
        return <CheckCircle className="w-4 h-4" />;
      case 'created':
        return <Eye className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'gregory' // Force Gregorian calendar for Arabic
    });
  };

  const getStatusChangeDetails = (actionDetails: any) => {
    if (actionDetails?.old_status && actionDetails?.new_status) {
      const oldStatus = actionDetails.old_status === 'available' 
        ? (currentLanguage === 'ar' ? 'متاح' : 'Available')
        : actionDetails.old_status === 'sold'
        ? (currentLanguage === 'ar' ? 'مباع' : 'Sold')
        : actionDetails.old_status === 'pending'
        ? (currentLanguage === 'ar' ? 'مخفي' : 'Hidden')
        : (currentLanguage === 'ar' ? 'مؤجر' : 'Rented');
      
      const newStatus = actionDetails.new_status === 'available' 
        ? (currentLanguage === 'ar' ? 'متاح' : 'Available')
        : actionDetails.new_status === 'sold'
        ? (currentLanguage === 'ar' ? 'مباع' : 'Sold')
        : actionDetails.new_status === 'pending'
        ? (currentLanguage === 'ar' ? 'مخفي' : 'Hidden')
        : (currentLanguage === 'ar' ? 'مؤجر' : 'Rented');

      return `${oldStatus} → ${newStatus}`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentLanguage === 'ar' ? 'أنشطة العقارات' : 'Property Activities'}
          </h2>
          <p className="text-gray-600">
            {currentLanguage === 'ar' ? 'تتبع جميع العمليات على العقارات' : 'Track all property operations'}
          </p>
        </div>
        <Button
          onClick={fetchActivities}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentLanguage === 'ar' ? 'سجل الأنشطة' : 'Activity Log'}
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' ? 'جميع العمليات المنفذة على العقارات' : 'All operations performed on properties'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-500">
                {currentLanguage === 'ar' ? 'جارٍ تحميل الأنشطة...' : 'Loading activities...'}
              </p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {currentLanguage === 'ar' ? 'لا توجد أنشطة' : 'No activities found'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{currentLanguage === 'ar' ? 'نوع العملية' : 'Action Type'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'عنوان العقار' : 'Property Title'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'تفاصيل' : 'Details'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'مالك العقار' : 'Property Owner'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'منفذ العملية' : 'Performed By'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'تاريخ العملية' : 'Date'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Badge className={`flex items-center gap-1 ${getActionTypeColor(activity.action_type)}`}>
                        {getActionIcon(activity.action_type)}
                        {getActionTypeLabel(activity.action_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {activity.property_title || (currentLanguage === 'ar' ? 'غير محدد' : 'Not specified')}
                    </TableCell>
                    <TableCell>
                      {activity.action_type === 'status_changed' && (
                        <span className="text-sm text-gray-600">
                          {getStatusChangeDetails(activity.action_details)}
                        </span>
                      )}
                      {activity.action_type === 'deleted' && (
                        <span className="text-sm text-red-600">
                          {currentLanguage === 'ar' ? 'تم حذف العقار نهائياً' : 'Property permanently deleted'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {activity.owner_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.owner_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {activity.performer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.performer_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(activity.performed_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyActivitiesManagement;
