import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  Home, 
  Activity, 
  Clipboard,
  Building,
  Users, 
  MapPin, 
  Star, 
  Languages, 
  Settings, 
  Megaphone, 
  Info, 
  Phone, 
  Mail, 
  Clock, 
  FileX, 
  Shield, 
  Network,
  ClipboardList
} from "lucide-react";
import AdminStats from "@/components/admin/AdminStats";
import ReportsManagement from "@/components/admin/ReportsManagement";
import ReportTypesManagement from "@/components/admin/ReportTypesManagement";
import PropertyManagement from "@/components/admin/PropertyManagement";
import PropertyActivitiesManagement from "@/components/admin/PropertyActivitiesManagement";
import PropertyLimitsManagement from "@/components/admin/PropertyLimitsManagement";
import PropertyTypesAndLayoutsManagement from "@/components/admin/PropertyTypesAndLayoutsManagement";
import EnhancedUserManagement from "@/components/admin/EnhancedUserManagement";
import CitiesManagement from "@/components/admin/CitiesManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import LanguageManagement from "@/components/admin/LanguageManagement";
import SiteSettings from "@/components/admin/SiteSettings";
import AnnouncementBarManagement from "@/components/admin/AnnouncementBarManagement";
import AboutPageManagement from "@/components/admin/AboutPageManagement";
import ContactSettings from "@/components/admin/ContactSettings";
import ContactSubjectsManagement from "@/components/admin/ContactSubjectsManagement";
import TrialSettings from "@/components/admin/TrialSettings";
import TermsManagement from "@/components/admin/TermsManagement";
import SuspensionSettings from "@/components/admin/SuspensionSettings";
import AdminManagement from "@/components/admin/AdminManagement";
import PendingApprovals from "@/components/admin/PendingApprovals";
import EnhancedSuspensionSettings from "@/components/admin/EnhancedSuspensionSettings";

const Admin = () => {
  const { currentLanguage } = useLanguage();
  const { profile, loading: profileLoading } = useUserProfile();
  const { isAdmin, isLoading: adminCheckLoading } = useAdminCheck();
  const [activeTab, setActiveTab] = useState("statistics");
  
  // Add user management hook for pending approvals
  const {
    pendingUsers,
    loading: userManagementLoading,
    toggleApproval,
    rejectUser,
    approveAllPending
  } = useUserManagement();

  // Loading states
  const isLoading = profileLoading || adminCheckLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile?.is_admin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 font-bold text-2xl">
          {currentLanguage === 'ar' ? 'غير مصرح لك بالدخول إلى هذه الصفحة' : 
           currentLanguage === 'tr' ? 'Bu sayfaya erişim yetkiniz yok' : 
           'You are not authorized to access this page'}
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      id: "statistics",
      label: currentLanguage === 'ar' ? "الإحصائيات" : currentLanguage === 'tr' ? "İstatistikler" : "Statistics",
      icon: BarChart3,
      component: <AdminStats />
    },
    {
      id: "reports",
      label: currentLanguage === 'ar' ? "التقارير" : currentLanguage === 'tr' ? "Raporlar" : "Reports",
      icon: AlertTriangle,
      component: <ReportsManagement />
    },
    {
      id: "report-types",
      label: currentLanguage === 'ar' ? "أنواع التقارير" : currentLanguage === 'tr' ? "Rapor Türleri" : "Report Types",
      icon: FileText,
      component: <ReportTypesManagement />
    },
    {
      id: "properties",
      label: currentLanguage === 'ar' ? "العقارات" : currentLanguage === 'tr' ? "Emlaklar" : "Properties",
      icon: Home,
      component: <PropertyManagement />
    },
    {
      id: "property-activities",
      label: currentLanguage === 'ar' ? "أنشطة العقارات" : currentLanguage === 'tr' ? "Emlak Etkinlikleri" : "Property Activities",
      icon: Activity,
      component: <PropertyActivitiesManagement />
    },
    {
      id: "property-limits",
      label: currentLanguage === 'ar' ? "حدود العقارات" : currentLanguage === 'tr' ? "Emlak Limitleri" : "Property Limits",
      icon: Clipboard,
      component: <PropertyLimitsManagement />
    },
    {
      id: "property-types-layouts",
      label: currentLanguage === 'ar' ? "أنواع العقارات وتقسيماتها" : currentLanguage === 'tr' ? "Emlak Türleri ve Düzenleri" : "Property Types & Layouts",
      icon: Building,
      component: <PropertyTypesAndLayoutsManagement />
    },
    {
      id: "users",
      label: currentLanguage === 'ar' ? "المستخدمون" : currentLanguage === 'tr' ? "Kullanıcılar" : "Users",
      icon: Users,
      component: <EnhancedUserManagement />
    },
    {
      id: "cities-districts",
      label: currentLanguage === 'ar' ? "المدن والأحياء" : currentLanguage === 'tr' ? "Şehirler ve İlçeler" : "Cities & Districts",
      icon: MapPin,
      component: <CitiesManagement />
    },
    {
      id: "reviews",
      label: currentLanguage === 'ar' ? "المراجعات" : currentLanguage === 'tr' ? "Değerlendirmeler" : "Reviews",
      icon: Star,
      component: <ReviewsManagement />
    },
    {
      id: "languages",
      label: currentLanguage === 'ar' ? "اللغات" : currentLanguage === 'tr' ? "Diller" : "Languages",
      icon: Languages,
      component: <LanguageManagement />
    },
    {
      id: "site-settings",
      label: currentLanguage === 'ar' ? "إعدادات الموقع" : currentLanguage === 'tr' ? "Site Ayarları" : "Site Settings",
      icon: Settings,
      component: <SiteSettings />
    },
    {
      id: "announcement-bar",
      label: currentLanguage === 'ar' ? "شريط الإعلانات" : currentLanguage === 'tr' ? "Duyuru Çubuğu" : "Announcement Bar",
      icon: Megaphone,
      component: <AnnouncementBarManagement />
    },
    {
      id: "about-page",
      label: currentLanguage === 'ar' ? "صفحة من نحن" : currentLanguage === 'tr' ? "Hakkımızda Sayfası" : "About Us Page",
      icon: Info,
      component: <AboutPageManagement />
    },
    {
      id: "contact-settings",
      label: currentLanguage === 'ar' ? "إعدادات الاتصال" : currentLanguage === 'tr' ? "İletişim Ayarları" : "Contact Settings",
      icon: Phone,
      component: <ContactSettings />
    },
    {
      id: "contact-subjects",
      label: currentLanguage === 'ar' ? "مواضيع الاتصال" : currentLanguage === 'tr' ? "İletişim Konuları" : "Contact Subjects",
      icon: Mail,
      component: <ContactSubjectsManagement />
    },
    {
      id: "trial-settings",
      label: currentLanguage === 'ar' ? "إعدادات التجربة" : currentLanguage === 'tr' ? "Deneme Ayarları" : "Trial Settings",
      icon: Clock,
      component: <TrialSettings />
    },
    {
      id: "terms",
      label: currentLanguage === 'ar' ? "الشروط والأحكام" : currentLanguage === 'tr' ? "Şartlar ve Koşullar" : "Terms & Conditions",
      icon: FileX,
      component: <TermsManagement />
    },
    {
      id: "enhanced-suspension-settings",
      label: currentLanguage === 'ar' ? "إعدادات الحظر المحسنة" : currentLanguage === 'tr' ? "Gelişmiş Askıya Alma Ayarları" : "Enhanced Suspension Settings",
      icon: Shield,
      component: <EnhancedSuspensionSettings />
    },
    {
      id: "admin-management",
      label: currentLanguage === 'ar' ? "إدارة المدراء" : currentLanguage === 'tr' ? "Yönetici Yönetimi" : "Admin Management",
      icon: Network,
      component: <AdminManagement />
    },
    {
      id: "pending-approvals",
      label: currentLanguage === 'ar' ? "الموافقات المعلقة" : currentLanguage === 'tr' ? "Bekleyen Onaylar" : "Pending Approvals",
      icon: ClipboardList,
      component: <PendingApprovals 
        pendingUsers={pendingUsers}
        onApprove={toggleApproval}
        onReject={rejectUser}
        onApproveAll={approveAllPending}
        loading={userManagementLoading}
      />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {currentLanguage === 'ar' ? 'لوحة التحكم الإدارية' : 
                   currentLanguage === 'tr' ? 'Yönetim Paneli' : 
                   'Admin Dashboard'}
                </CardTitle>
                <CardDescription>
                  {currentLanguage === 'ar' ? 'إدارة شاملة لجميع جوانب النظام' :
                   currentLanguage === 'tr' ? 'Sistemin tüm yönlerinin kapsamlı yönetimi' :
                   'Comprehensive management of all system aspects'}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {currentLanguage === 'ar' ? 'مدير' : currentLanguage === 'tr' ? 'Yönetici' : 'Admin'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 h-auto p-2">
            {menuItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex flex-col items-center justify-center h-20 p-3 border rounded-lg transition-all hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-center"
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs leading-tight">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {menuItems.map((item) => (
            <TabsContent key={item.id} value={item.id} className="space-y-6">
              {item.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
