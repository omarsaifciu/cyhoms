import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart3, Users, Home, Eye, TrendingUp, MapPin } from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminStats";

const AdminStats = () => {
  const { currentLanguage } = useLanguage();
  const { stats, cityStats, loading, calculatePercentageChange } = useAdminStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: currentLanguage === 'ar' ? 'إجمالي العقارات' : 'Total Properties',
      value: stats.totalProperties.toLocaleString(),
      change: calculatePercentageChange(stats.totalProperties, stats.previousMonthProperties),
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      title: currentLanguage === 'ar' ? 'المستخدمين المسجلين' : 'Registered Users',
      value: stats.registeredUsers.toLocaleString(),
      change: calculatePercentageChange(stats.registeredUsers, stats.previousMonthUsers),
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: currentLanguage === 'ar' ? 'عدد المشاهدات الكلي' : 'Total Views',
      value: stats.monthlyVisits.toLocaleString(),
      change: '+15%',
      icon: Eye,
      color: 'bg-purple-500'
    },
    {
      title: currentLanguage === 'ar' ? 'العقارات المؤجرة' : 'Rented Properties',
      value: stats.rentedProperties.toLocaleString(),
      change: calculatePercentageChange(stats.rentedProperties, stats.previousMonthRented),
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className={`text-xs font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change} {currentLanguage === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* City Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {currentLanguage === 'ar' ? 'توزيع العقارات حسب المدينة' : 'Property Distribution by City'}
            </CardTitle>
            <CardDescription>
              {currentLanguage === 'ar' ? 'عدد العقارات في كل مدينة' : 'Number of properties in each city'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cityStats.length > 0 ? (
                cityStats.map((city, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{city.city}</span>
                        <span className="text-sm text-gray-600">{city.properties}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${city.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  {currentLanguage === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {currentLanguage === 'ar' ? 'نشاط الموقع الأخير' : 'Recent Site Activity'}
            </CardTitle>
            <CardDescription>
              {currentLanguage === 'ar' ? 'آخر الأنشطة على الموقع' : 'Latest activities on the website'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">
                  {currentLanguage === 'ar' ? `تم إنشاء ${stats.totalProperties} عقار` : `${stats.totalProperties} properties created`}
                </span>
                <span className="text-xs text-gray-500">
                  {currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">
                  {currentLanguage === 'ar' ? `${stats.registeredUsers} مستخدم مسجل` : `${stats.registeredUsers} registered users`}
                </span>
                <span className="text-xs text-gray-500">
                  {currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">
                  {currentLanguage === 'ar' ? `${stats.rentedProperties} عقار مؤجر` : `${stats.rentedProperties} rented properties`}
                </span>
                <span className="text-xs text-gray-500">
                  {currentLanguage === 'ar' ? 'نشط' : 'Active'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
