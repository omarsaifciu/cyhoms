import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserActivity } from '@/hooks/useUserActivity';
import ActivityCard from '@/components/activity/ActivityCard';
import { seedUserActivity } from '@/utils/seedUserActivity';

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

const UserActivity = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { activities, loading, fetchActivities } = useUserActivity(userId);
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleSeedData = async () => {
    if (userId) {
      await seedUserActivity(userId);
      await fetchActivities();
    }
  };

  // Check if current user can view this activity page
  useEffect(() => {
    if (user?.id !== userId) {
      navigate('/');
      return;
    }
  }, [user, userId, navigate]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full p-2">
              {currentLanguage === 'ar' ? (
                <ArrowRight className="w-5 h-5" />
              ) : (
                <ArrowLeft className="w-5 h-5" />
              )}
            </Button>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {currentLanguage === 'ar' ? 'سجل الأنشطة' : currentLanguage === 'tr' ? 'Etkinlik Geçmişi' : 'Activity Log'}
            </h1>
          </div>
          {/* Temporary button for testing - remove in production */}
          {activities.length === 0 && (
            <Button onClick={handleSeedData} variant="outline" size="sm">
              {currentLanguage === 'ar' ? 'إضافة بيانات تجريبية' : 'Add Sample Data'}
            </Button>
          )}
        </div>

        {/* User Info */}
        {userProfile && (
          <Card className="mb-8 shadow-lg border bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-accent to-brand-accent/80 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userProfile.full_name || userProfile.username}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ar' ? 'إجمالي الأنشطة:' : 'Total Activities:'} {activities.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activities List */}
        <div className="space-y-4">
          {activities.length === 0 ? (
            <Card className="shadow-lg border bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-8 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {currentLanguage === 'ar' ? 'لا توجد أنشطة' : 'No Activities'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentLanguage === 'ar' ? 'لم يتم تسجيل أي أنشطة بعد.' : 'No activities have been recorded yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivity;
