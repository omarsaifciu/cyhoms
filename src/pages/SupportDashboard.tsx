import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserManagement } from "@/hooks/useUserManagement";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Users, AlertTriangle, BarChart3, Headphones, Settings, FileText, CheckCircle, Home, Star, Clock, Eye } from "lucide-react";

// Import admin components
import ReportsManagement from "@/components/admin/ReportsManagement";
import PendingApprovals from "@/components/admin/PendingApprovals";
import PropertyActivitiesManagement from "@/components/admin/PropertyActivitiesManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";

const SupportDashboard = () => {
  const { currentLanguage } = useLanguage();
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();
  const { users, pendingUsers, loading: userManagementLoading, fetchUsers, toggleApproval, toggleVerification, rejectUser, updateUserType, deleteUser, approveAllPending, toggleSuspension } = useUserManagement();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingApprovals: 0,
    totalReports: 0,
    totalReviews: 0,
    activeUsers: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && profile && profile.user_type !== 'support') {
      navigate('/');
    }
  }, [profile, loading, navigate]);

  // Fetch real statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);

        // Get total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total properties
        const { count: totalProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        // Get pending approvals (users not approved)
        const { count: pendingApprovals } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', false)
          .in('user_type', ['agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner']);

        // Get total reports
        const { count: totalReports } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true });

        // Get total reviews
        const { count: totalReviews } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true });

        // Get active users (users who logged in recently)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: activeUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', thirtyDaysAgo.toISOString());

        setStats({
          totalUsers: totalUsers || 0,
          totalProperties: totalProperties || 0,
          pendingApprovals: pendingApprovals || 0,
          totalReports: totalReports || 0,
          totalReviews: totalReviews || 0,
          activeUsers: activeUsers || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (profile?.user_type === 'support') {
      fetchStats();
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-accent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {currentLanguage === 'ar' ? 'جاري التحميل...' : 
             currentLanguage === 'tr' ? 'Yükleniyor...' : 
             'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!profile || profile.user_type !== 'support') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              {currentLanguage === 'ar' ? 'غير مصرح' : 
               currentLanguage === 'tr' ? 'Yetkisiz' : 
               'Unauthorized'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 dark:text-gray-400">
              {currentLanguage === 'ar' ? 'ليس لديك صلاحية للوصول إلى لوحة الدعم الفني' : 
               currentLanguage === 'tr' ? 'Destek paneline erişim yetkiniz yok' : 
               'You do not have permission to access the support dashboard'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsCards = [
    {
      title: currentLanguage === 'ar' ? 'إجمالي المستخدمين' :
             currentLanguage === 'tr' ? 'Toplam Kullanıcılar' :
             'Total Users',
      value: loadingStats ? '...' : stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: currentLanguage === 'ar' ? 'المستخدمين النشطين' :
             currentLanguage === 'tr' ? 'Aktif Kullanıcılar' :
             'Active Users',
      value: loadingStats ? '...' : stats.activeUsers.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: currentLanguage === 'ar' ? 'الموافقات المعلقة' :
             currentLanguage === 'tr' ? 'Bekleyen Onaylar' :
             'Pending Approvals',
      value: loadingStats ? '...' : stats.pendingApprovals.toLocaleString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: currentLanguage === 'ar' ? 'إجمالي العقارات' :
             currentLanguage === 'tr' ? 'Toplam Mülkler' :
             'Total Properties',
      value: loadingStats ? '...' : stats.totalProperties.toLocaleString(),
      icon: Home,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: currentLanguage === 'ar' ? 'إجمالي التقارير' :
             currentLanguage === 'tr' ? 'Toplam Raporlar' :
             'Total Reports',
      value: loadingStats ? '...' : stats.totalReports.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: currentLanguage === 'ar' ? 'إجمالي التقييمات' :
             currentLanguage === 'tr' ? 'Toplam Değerlendirmeler' :
             'Total Reviews',
      value: loadingStats ? '...' : stats.totalReviews.toLocaleString(),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Headphones className="w-8 h-8 text-brand-accent" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentLanguage === 'ar' ? 'لوحة الدعم الفني' : 
               currentLanguage === 'tr' ? 'Destek Paneli' : 
               'Support Dashboard'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === 'ar' ? 'إدارة طلبات الدعم والمساعدة للمستخدمين' : 
             currentLanguage === 'tr' ? 'Kullanıcı destek taleplerini ve yardımı yönetin' : 
             'Manage user support requests and assistance'}
          </p>
          <Badge variant="secondary" className="mt-2">
            {currentLanguage === 'ar' ? 'دعم فني' : 
             currentLanguage === 'tr' ? 'Destek' : 
             'Support'}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">
              {currentLanguage === 'ar' ? 'إدارة التقارير' :
               currentLanguage === 'tr' ? 'Rapor Yönetimi' :
               'Reports Management'}
            </TabsTrigger>
            <TabsTrigger value="approvals">
              {currentLanguage === 'ar' ? 'الموافقات المعلقة' :
               currentLanguage === 'tr' ? 'Bekleyen Onaylar' :
               'Pending Approvals'}
            </TabsTrigger>
            <TabsTrigger value="activities">
              {currentLanguage === 'ar' ? 'أنشطة العقارات' :
               currentLanguage === 'tr' ? 'Mülk Faaliyetleri' :
               'Property Activities'}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              {currentLanguage === 'ar' ? 'إدارة التقييمات' :
               currentLanguage === 'tr' ? 'Değerlendirme Yönetimi' :
               'Reviews Management'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6">
            <ReportsManagement />
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <PendingApprovals
              pendingUsers={pendingUsers}
              onApprove={toggleApproval}
              onReject={rejectUser}
              onApproveAll={approveAllPending}
              loading={userManagementLoading}
            />
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <PropertyActivitiesManagement />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ReviewsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupportDashboard;
