import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePropertyManagement } from "@/hooks/usePropertyManagement";
import PropertyForm from "@/components/seller/PropertyForm";
import SellerProperties from "@/components/seller/SellerProperties";
import { AlertCircle, Plus, Home, Ban, Clock } from "lucide-react";
import { Property } from "@/types/property";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PendingApprovalCard from "@/components/ui/PendingApprovalCard";

const SellerDashboard = () => {
  const { t, currentLanguage } = useLanguage();
  const { profile, loading: profileLoading } = useUserProfile();
  const { properties, loading: propertiesLoading, refetch: fetchProperties } = usePropertyManagement();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { toast } = useToast();
  const navigate = useNavigate();

  // عرض التوست مرة واحدة فقط لكل تحميل
  const shownToast = useRef(false);

  useEffect(() => {
    if (
      profile &&
      profile.is_suspended &&
      !profileLoading &&
      !settingsLoading &&
      !shownToast.current
    ) {
      const title =
        currentLanguage === 'ar' ? (settings.suspensionTitleAr || 'الحساب موقوف')
        : currentLanguage === 'tr' ? (settings.suspensionTitleTr || 'Hesap Askıya Alındı')
        : (settings.suspensionTitleEn || 'Account Suspended');

      const message =
        currentLanguage === 'ar'
          ? (settings.suspensionMessageAr || "تم إيقاف حسابك ولا يمكنك إدارة أي عقار.")
          : currentLanguage === 'tr'
          ? (settings.suspensionMessageTr || "Hesabınız askıya alındı و artık işlem yapamazsınız.")
          : (settings.suspensionMessageEn || "Your account is suspended. You cannot manage properties.");

      toast({
        title,
        description: message,
        variant: "destructive",
      });

      shownToast.current = true;
    }
  }, [profile, profileLoading, settings, settingsLoading, currentLanguage, toast]);

  // Get suspension messages with language fallback
  const getSuspensionTitle = () => {
    if (currentLanguage === 'ar' && settings.suspensionTitleAr) return settings.suspensionTitleAr;
    if (currentLanguage === 'tr' && settings.suspensionTitleTr) return settings.suspensionTitleTr;
    if (currentLanguage === 'en' && settings.suspensionTitleEn) return settings.suspensionTitleEn;

    return settings.suspensionTitleEn || settings.suspensionTitleAr || settings.suspensionTitleTr ||
      (currentLanguage === 'ar' ? 'تم إيقاف الحساب' :
        currentLanguage === 'tr' ? 'Hesap Askıya Alındı' : 'Account Suspended');
  };

  const getSuspensionMessage = () => {
    if (currentLanguage === 'ar' && settings.suspensionMessageAr) return settings.suspensionMessageAr;
    if (currentLanguage === 'tr' && settings.suspensionMessageTr) return settings.suspensionMessageTr;
    if (currentLanguage === 'en' && settings.suspensionMessageEn) return settings.suspensionMessageEn;

    return settings.suspensionMessageEn || settings.suspensionMessageAr || settings.suspensionMessageTr ||
      (currentLanguage === 'ar' ? 'تم إيقاف حسابك. يرجى مراجعة شروط الاستخدام أو التواصل مع الدعم.' :
        currentLanguage === 'tr' ? 'Hesabınız askıya alındı. Lütfen hizmet şartlarımızı inceleyin veya destek ile iletişime geçin.' :
          'Your account has been suspended. Please review our terms of service or contact support.');
  };

  const getTermsLinkText = () => {
    return currentLanguage === 'ar' ? 'سياسة الخصوصية والأحكام والشروط' :
      currentLanguage === 'tr' ? 'Gizlilik Politikası ve Şartlar' :
        'Privacy Policy & Terms and Conditions';
  };

  // Get pending approval messages from settings
  const getPendingApprovalTitle = () => {
    if (currentLanguage === 'ar' && settings.pendingApprovalTitleAr) return settings.pendingApprovalTitleAr;
    if (currentLanguage === 'tr' && settings.pendingApprovalTitleTr) return settings.pendingApprovalTitleTr;
    if (currentLanguage === 'en' && settings.pendingApprovalTitleEn) return settings.pendingApprovalTitleEn;

    return settings.pendingApprovalTitleEn || settings.pendingApprovalTitleAr || settings.pendingApprovalTitleTr ||
      (currentLanguage === 'ar' ? 'حسابك قيد المراجعة' :
        currentLanguage === 'tr' ? 'Hesabınız İnceleniyor' : 'Account Under Review');
  };

  const getPendingApprovalMessage = () => {
    if (currentLanguage === 'ar' && settings.pendingApprovalMessageAr) return settings.pendingApprovalMessageAr;
    if (currentLanguage === 'tr' && settings.pendingApprovalMessageTr) return settings.pendingApprovalMessageTr;
    if (currentLanguage === 'en' && settings.pendingApprovalMessageEn) return settings.pendingApprovalMessageEn;

    return settings.pendingApprovalMessageEn || settings.pendingApprovalMessageAr || settings.pendingApprovalMessageTr ||
      (currentLanguage === 'ar' ? 'شكراً لتسجيلك في منصتنا! حسابك الآن قيد المراجعة من قبل الإدارة، لا يمكنك نشر أي عقار حتى تتم الموافقة.' :
        currentLanguage === 'tr' ? 'Platformumuza kaydolduğunuz için teşekkür ederiz! Hesabınız şu anda yönetim tarafından inceleniyor.' :
          'Thank you for registering on our platform! Your account is now under review by management.');
  };

  const getPendingApprovalNote = () => {
    return currentLanguage === 'ar' ? 'إذا كنت تعتقد أن هناك تأخيراً، يمكنك التواصل مع الدعم.' :
      currentLanguage === 'tr' ? 'Gecikme olduğunu düşünüyorsanız, destek ile iletişime geçebilirsiniz.' :
        'If you think there is a delay, you can contact support.';
  };

  const getCannotPublishText = () => {
    return currentLanguage === 'ar' ? 'لا يمكنك نشر عقار حالياً' :
      currentLanguage === 'tr' ? 'Şu anda ilan yayınlayamazsınız' :
        'You cannot publish properties now';
  };

  // Filter properties created by current user
  const userProperties = properties.filter(property => property.created_by === profile?.id);

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
    setShowAddForm(false);
  };

  const handleFormSuccess = () => {
    setEditingProperty(null);
    setShowAddForm(false);
  };

  if (profileLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#181926] bg-gray-50 transition-colors">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if user is suspended - Enhanced suspension screen
  if (profile?.is_suspended) {
    const isTemporarilySuspended = profile.suspension_end_date;
    
    return (
      <div className="flex justify-center items-center min-h-[70vh] py-[69px] px-[15px] my-0">
        <div className="w-full max-w-md">
          <div className="rounded-3xl shadow-2xl border-0 bg-white/95 dark:bg-[#232433]/95 backdrop-blur-xl px-8 py-10 flex flex-col items-center transition-all duration-300 hover:shadow-3xl" style={{
            boxShadow: '0 8px 32px 0 rgba(220, 38, 38, 0.15)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.90) 100%)'
          }}>
            {/* Animated Icon */}
            <div className="relative mb-6 flex items-center justify-center">
              <span className="absolute -inset-4 rounded-full bg-red-500/20 blur-xl animate-pulse" />
              <span className="relative flex items-center justify-center p-6 rounded-full shadow-lg border-2 bg-gradient-to-br from-red-500 to-red-600 border-red-500">
                <Ban className="w-16 h-16 text-white animate-pulse" />
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-center mb-4 tracking-tight bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              {getSuspensionTitle()}
            </h2>

            {/* Message */}
            <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg text-center mb-6 leading-relaxed">
              {getSuspensionMessage()}
            </p>

            {/* Suspension Type Badge */}
            <div className="w-full bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl shadow-inner mb-6 border border-red-100 dark:border-red-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                {isTemporarilySuspended ? (
                  <>
                    <Clock className="w-5 h-5 text-orange-600 animate-spin" />
                    <span className="font-semibold text-orange-700 dark:text-orange-300">
                      {currentLanguage === 'ar' ? 'حظر مؤقت' :
                        currentLanguage === 'tr' ? 'Geçici Askıya Alma' : 'Temporary Suspension'}
                    </span>
                  </>
                ) : (
                  <>
                    <Ban className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      {currentLanguage === 'ar' ? 'حظر دائم' :
                        currentLanguage === 'tr' ? 'Kalıcı Askıya Alma' : 'Permanent Suspension'}
                    </span>
                  </>
                )}
              </div>
              
              {isTemporarilySuspended && (
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                  {currentLanguage === 'ar' ? 'سيتم إلغاء الحظر تلقائياً في: ' :
                    currentLanguage === 'tr' ? 'Otomatik olarak kaldırılacak: ' :
                    'Will be automatically lifted on: '}
                  <span className="font-medium">
                    {new Date(profile.suspension_end_date).toLocaleDateString(
                      currentLanguage === 'ar' ? 'ar-EG' :
                      currentLanguage === 'tr' ? 'tr-TR' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        calendar: 'gregory' // Force Gregorian calendar for Arabic
                      }
                    )}
                  </span>
                </p>
              )}
            </div>

            {/* Suspension Reason */}
            {profile.suspension_reason && (
              <div className="w-full bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl mb-6">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  {currentLanguage === 'ar' ? 'سبب الحظر:' :
                    currentLanguage === 'tr' ? 'Askıya Alma Nedeni:' : 'Suspension Reason:'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {profile.suspension_reason}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <Button
                variant="outline"
                asChild
                className="w-full"
              >
                <Link to="/terms">
                  {getTermsLinkText()}
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => {
                  supabase.auth.signOut();
                  navigate('/');
                }}
                className="w-full text-gray-500"
              >
                {currentLanguage === 'ar' ? 'تسجيل الخروج' :
                  currentLanguage === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
              </Button>
            </div>

            {/* Floating Particles Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-2 h-2 bg-red-400 rounded-full animate-bounce opacity-60" />
              <div className="absolute bottom-20 right-10 w-1 h-1 bg-red-500 rounded-full animate-bounce delay-300 opacity-50" />
              <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping delay-700 opacity-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is approved - Use the new PendingApprovalCard component
  if (profile && profile.is_approved === false) {
    return (
      <PendingApprovalCard
        title={getPendingApprovalTitle()}
        message={getPendingApprovalMessage()}
        note={getPendingApprovalNote()}
        cannotPublish={getCannotPublishText()}
      />
    );
  }

  // Check if user is agent, property owner, real estate office, or partner_and_site_owner
  if (
    !profile ||
    (
      profile.user_type !== 'agent' &&
      profile.user_type !== 'property_owner' &&
      profile.user_type !== 'real_estate_office' &&
      profile.user_type !== 'partner_and_site_owner'
    )
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#181926] bg-gray-50 transition-colors p-4 pt-20">
        <Card className="max-w-md bg-white dark:bg-[#232433] border-0 shadow-2xl transition-colors">
          <CardHeader className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600 dark:text-red-400">
              {t('unauthorized')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('unauthorizedSellerPage')}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <p className="mb-2">
                {currentLanguage === 'ar' ? 'نوع المستخدم الحالي:' :
                 currentLanguage === 'tr' ? 'Mevcut kullanıcı türü:' :
                 'Current user type:'} <strong>{profile?.user_type || 'غير محدد'}</strong>
              </p>
              <p>
                {currentLanguage === 'ar' ? 'الأنواع المسموحة: وسيط، مالك عقار، مكتب عقاري، شريك' :
                 currentLanguage === 'tr' ? 'İzin verilen türler: Acente, Mülk sahibi, Emlak ofisi, Ortak' :
                 'Allowed types: Agent, Property Owner, Real Estate Office, Partner'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col p-4 py-24 relative overflow-hidden transition-all duration-500"
      style={{
        background: `
          linear-gradient(135deg,
            color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent),
            color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 2%, transparent)
          ),
          linear-gradient(to bottom right,
            #fafbff 0%,
            #f1f5f9 50%,
            #e2e8f0 100%
          )
        `,
        // Dark mode background
        ...(typeof window !== 'undefined' && document.documentElement.classList.contains('dark') && {
          background: `
            linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent),
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent)
            ),
            linear-gradient(to bottom right,
              #0f172a 0%,
              #1e293b 50%,
              #334155 100%
            )
          `
        })
      }}
    >
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient overlays */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent) 0%,
              transparent 50%,
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent) 100%
            )`
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-10 dark:opacity-15"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent),
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 6%, transparent)
            )`
          }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 opacity-8 dark:opacity-12"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 6%, transparent),
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 5%, transparent)
            )`
          }}
        />

        {/* Subtle floating particles */}
        <div
          className="absolute top-32 right-1/4 w-3 h-3 rounded-full animate-bounce opacity-20 dark:opacity-30"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 25%, transparent)' }}
        />
        <div
          className="absolute bottom-40 left-1/3 w-2 h-2 rounded-full animate-bounce delay-300 opacity-15 dark:opacity-25"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 20%, transparent)' }}
        />
        <div
          className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full animate-ping delay-700 opacity-25 dark:opacity-35"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 30%, transparent)' }}
        />

        {/* Additional atmospheric elements */}
        <div
          className="absolute top-10 right-10 w-32 h-32 rounded-full blur-2xl animate-pulse delay-200 opacity-5 dark:opacity-8"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 5%, transparent),
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent)
            )`
          }}
        />
        <div
          className="absolute bottom-32 left-10 w-40 h-40 rounded-full blur-3xl animate-pulse delay-800 opacity-4 dark:opacity-6"
          style={{
            background: `linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent),
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent)
            )`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                {t('sellerDashboard')}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {t('manageYourProperties')}
              </p>
            </div>

            {!showAddForm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:brightness-95"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
                }}
              >
                <Plus className="w-4 h-4" />
                {t('addNewProperty')}
              </Button>
            )}
          </div>
        </div>

        {showAddForm ? (
          <PropertyForm
            onCancel={handleCancelEdit}
            onSuccess={handleFormSuccess}
            editingProperty={editingProperty}
          />
        ) : (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('totalProperties')}
                  </CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProperties.length}</div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('availableProperties')}
                  </CardTitle>
                  <Home className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {userProperties.filter(p => p.status === 'available').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('rentedProperties')}
                  </CardTitle>
                  <Home className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {userProperties.filter(p => p.status === 'rented').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Properties List */}
            <SellerProperties
              properties={userProperties}
              loading={propertiesLoading}
              onEditProperty={handleEditProperty}
              onRefresh={fetchProperties}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
