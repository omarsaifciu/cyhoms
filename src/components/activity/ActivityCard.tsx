import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, EyeOff, Home, DollarSign, Edit, Trash2, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ar, tr, enUS } from 'date-fns/locale';

interface ActivityLog {
  id: string;
  user_id: string;
  property_id?: string;
  action_type: string;
  action_details: any;
  created_at: string;
  property?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    images: string[];
  };
}

interface ActivityCardProps {
  activity: ActivityLog;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'property_hidden':
        return <EyeOff className="w-4 h-4" />;
      case 'property_shown':
        return <Eye className="w-4 h-4" />;
      case 'property_created':
        return <Home className="w-4 h-4" />;
      case 'property_updated':
        return <Edit className="w-4 h-4" />;
      case 'property_deleted':
        return <Trash2 className="w-4 h-4" />;
      case 'property_sold':
        return <DollarSign className="w-4 h-4" />;
      case 'status_changed':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionText = (actionType: string) => {
    const actions = {
      ar: {
        property_hidden: 'تم إخفاء العقار',
        property_shown: 'تم إظهار العقار',
        property_created: 'تم إنشاء عقار جديد',
        property_updated: 'تم تحديث العقار',
        property_deleted: 'تم حذف العقار',
        property_sold: 'تم بيع العقار',
        status_changed: 'تم تغيير حالة العقار',
      },
      tr: {
        property_hidden: 'Mülk gizlendi',
        property_shown: 'Mülk gösterildi',
        property_created: 'Yeni mülk oluşturuldu',
        property_updated: 'Mülk güncellendi',
        property_deleted: 'Mülk silindi',
        property_sold: 'Mülk satıldı',
        status_changed: 'Mülk durumu değiştirildi',
      },
      en: {
        property_hidden: 'Property hidden',
        property_shown: 'Property shown',
        property_created: 'New property created',
        property_updated: 'Property updated',
        property_deleted: 'Property deleted',
        property_sold: 'Property sold',
        status_changed: 'Property status changed',
      }
    };

    return actions[currentLanguage as keyof typeof actions]?.[actionType as keyof typeof actions.ar] || actionType;
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'property_hidden':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'property_shown':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'property_created':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'property_updated':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'property_deleted':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
      case 'property_sold':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
      case 'status_changed':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = currentLanguage === 'ar' ? ar : currentLanguage === 'tr' ? tr : enUS;
    return format(date, 'PPp', { locale });
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ar: {
        available: 'متاح',
        sold: 'مباع',
        rented: 'مؤجر',
        pending: 'قيد المراجعة'
      },
      tr: {
        available: 'Müsait',
        sold: 'Satıldı',
        rented: 'Kiralandı',
        pending: 'İnceleme'
      },
      en: {
        available: 'Available',
        sold: 'Sold',
        rented: 'Rented',
        pending: 'Pending'
      }
    };

    return statusTexts[currentLanguage as keyof typeof statusTexts]?.[status as keyof typeof statusTexts.ar] || status;
  };

  return (
    <Card className="shadow-lg border bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg border ${getActionColor(activity.action_type)}`}>
            {getActionIcon(activity.action_type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {getActionText(activity.action_type)}
              </h3>
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(activity.created_at)}
              </Badge>
            </div>
            
            {/* Show additional details for status changes */}
            {activity.action_type === 'status_changed' && activity.action_details && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {currentLanguage === 'ar' ? 'من' : 'From'} <span className="font-medium">{getStatusText(activity.action_details.old_status)}</span> {currentLanguage === 'ar' ? 'إلى' : 'to'} <span className="font-medium">{getStatusText(activity.action_details.new_status)}</span>
              </div>
            )}
            
            {activity.property && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-3">
                <div className="flex items-center gap-3">
                  {activity.property.images?.[0] && (
                    <img 
                      src={activity.property.images[0]} 
                      alt={activity.property.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {activity.property.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {activity.property.price} {activity.property.currency}
                    </p>
                  </div>
                  {activity.property.id && activity.action_type !== 'property_deleted' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/property/${activity.property?.id}`)}
                    >
                      {currentLanguage === 'ar' ? 'عرض' : currentLanguage === 'tr' ? 'Görüntüle' : 'View'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
