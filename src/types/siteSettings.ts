
export interface SiteSettings {
  siteNameAr: string;
  siteNameEn: string;
  siteNameTr: string;
  siteDescriptionAr: string;
  siteDescriptionEn: string;
  siteDescriptionTr: string;
  supportEmail: string;
  maxProperties: string;
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  brandAccentColor: string;
  gradientFromColor: string;
  gradientToColor: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;    // New
  whatsappLink?: string;  // New (e.g., wa.me/123)
  linkedinUrl?: string;   // New
  tiktokUrl?: string;     // New
  snapchatUrl?: string;   // New
  pinterestUrl?: string;  // New
  address?: string;
  phoneNumber?: string;
  siteEmailAddress?: string;

  addressAr?: string;
  addressEn?: string;
  addressTr?: string;
  phoneNumberAr?: string;
  phoneNumberEn?: string;
  phoneNumberTr?: string;
  siteEmailAddressAr?: string;
  siteEmailAddressEn?: string;
  siteEmailAddressTr?: string;

  contactAddressEnabled?: boolean;
  contactPhoneEnabled?: boolean;
  contactEmailEnabled?: boolean;
  contactWhatsappEnabled?: boolean;

  // Announcement Bar
  announcementBarEnabled?: boolean;
  announcementBarTextAr?: string;
  announcementBarTextEn?: string;
  announcementBarTextTr?: string;
  announcementBarLink?: string;
  announcementBarBackgroundColor?: string;
  announcementBarTextColor?: string;

  // About Page Settings
  aboutPageTitleAr?: string;
  aboutPageTitleEn?: string;
  aboutPageTitleTr?: string;
  aboutPageSubtitleAr?: string;
  aboutPageSubtitleEn?: string;
  aboutPageSubtitleTr?: string;
  aboutMissionTitleAr?: string;
  aboutMissionTitleEn?: string;
  aboutMissionTitleTr?: string;
  aboutMissionTextAr?: string;
  aboutMissionTextEn?: string;
  aboutMissionTextTr?: string;
  aboutVisionTitleAr?: string;
  aboutVisionTitleEn?: string;
  aboutVisionTitleTr?: string;
  aboutVisionTextAr?: string;
  aboutVisionTextEn?: string;
  aboutVisionTextTr?: string;
  aboutTeamTitleAr?: string;
  aboutTeamTitleEn?: string;
  aboutTeamTitleTr?: string;
  aboutTeamTextAr?: string;
  aboutTeamTextEn?: string;
  aboutTeamTextTr?: string;
  aboutTeamMembers?: string; // JSON string for team members array

  // Suspension Messages
  suspensionTitleAr?: string;
  suspensionTitleEn?: string;
  suspensionTitleTr?: string;
  suspensionMessageAr?: string;
  suspensionMessageEn?: string;
  suspensionMessageTr?: string;

  // Pending Approval Messages
  pendingApprovalTitleAr?: string;
  pendingApprovalTitleEn?: string;
  pendingApprovalTitleTr?: string;
  pendingApprovalMessageAr?: string;
  pendingApprovalMessageEn?: string;
  pendingApprovalMessageTr?: string;

  // Favicon
  faviconUrl?: string;

  // Hero Section
  heroSlideshowEnabled?: boolean;
  heroSlideshowInterval?: number;
  heroTitleAr?: string;
  heroTitleEn?: string;
  heroTitleTr?: string;
  heroDescriptionAr?: string;
  heroDescriptionEn?: string;
  heroDescriptionTr?: string;

  // 404 Page Settings
  notFoundTitleAr?: string;
  notFoundTitleEn?: string;
  notFoundTitleTr?: string;
  notFoundDescAr?: string;
  notFoundDescEn?: string;
  notFoundDescTr?: string;
  notFoundButtonAr?: string;
  notFoundButtonEn?: string;
  notFoundButtonTr?: string;
  notFoundSvgAr?: string;
  notFoundSvgEn?: string;
  notFoundSvgTr?: string;
}

export interface TeamMember {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  role_ar: string;
  role_en: string;
  role_tr: string;
  avatar: string;
}

export const defaultSiteSettings: SiteSettings = {
  siteNameAr: 'منصة ايجار العقارات في قبرص',
  siteNameEn: 'Cyprus Property Rental',
  siteNameTr: 'Kıbrıs Emlak Kiralama',
  siteDescriptionAr: 'أفضل منصة لإيجار العقارات في قبرص',
  siteDescriptionEn: 'Best platform for property rental in Cyprus',
  siteDescriptionTr: 'Kıbrıs\'ta emlak kiralama için en iyi platform',
  supportEmail: 'support@cyprusrental.com',
  maxProperties: '1000',
  registrationEnabled: true,
  maintenanceMode: false,
  brandAccentColor: '#ec489a',
  gradientFromColor: '#ec489a',
  gradientToColor: '#f43f5e',
  facebookUrl: 'https://facebook.com/yourpage',
  instagramUrl: 'https://instagram.com/yourprofile',
  twitterUrl: 'https://twitter.com/yourhandle',
  youtubeUrl: '',     // New
  whatsappLink: '',   // New
  linkedinUrl: '',    // New
  tiktokUrl: '',      // New
  snapchatUrl: '',    // New
  pinterestUrl: '',   // New
  address: '123 Example Street, City, Country',
  addressAr: '', addressEn: '', addressTr: '',
  phoneNumber: '+1234567890',
  phoneNumberAr: '', phoneNumberEn: '', phoneNumberTr: '',
  siteEmailAddress: 'info@example.com',
  siteEmailAddressAr: '', siteEmailAddressEn: '', siteEmailAddressTr: '',
  contactAddressEnabled: true,
  contactPhoneEnabled: true,
  contactEmailEnabled: true,
  contactWhatsappEnabled: true,

  // Default Announcement Bar
  announcementBarEnabled: false,
  announcementBarTextAr: '',
  announcementBarTextEn: '',
  announcementBarTextTr: '',
  announcementBarLink: '',
  announcementBarBackgroundColor: '#3b82f6',
  announcementBarTextColor: '#ffffff',


  // Default About Page Settings
  aboutPageTitleAr: 'من نحن',
  aboutPageTitleEn: 'About Us',
  aboutPageTitleTr: 'Hakkımızda',
  aboutPageSubtitleAr: `تعرف على قصة {siteName} ورؤيتنا في سوق العقارات.`,
  aboutPageSubtitleEn: `Learn about {siteName}'s story and our vision in the real estate market.`,
  aboutPageSubtitleTr: `{siteName}'un hikayesini ve emlak piyasasındaki vizyonumuzu öğrenin.`,
  aboutMissionTitleAr: 'مهمتنا',
  aboutMissionTitleEn: 'Our Mission',
  aboutMissionTitleTr: 'Misyonumuz',
  aboutMissionTextAr: 'مهمتنا هي تبسيط عملية العثور على العقار المثالي في قبرص، سواء كان للإيجار، البيع، أو لسكن الطلاب. نحن نسعى لتقديم منصة شفافة وموثوقة تجمع بين أصحاب العقارات والباحثين عنها بكل سهولة.',
  aboutMissionTextEn: 'Our mission is to simplify the process of finding the perfect property in Cyprus, whether for rent, sale, or student housing. We strive to provide a transparent and reliable platform that easily connects property owners with seekers.',
  aboutMissionTextTr: 'Misyonumuz, Kıbrıs\'ta kiralık, satılık veya öğrenci konutu olsun, mükemmel mülkü bulma sürecini basitleştirmektir. Mülk sahiplerini ve arayanları kolayca bir araya getiren şeffaf ve güvenilir bir platform sağlamaya çalışıyoruz.',
  aboutVisionTitleAr: 'رؤيتنا',
  aboutVisionTitleEn: 'Our Vision',
  aboutVisionTitleTr: 'Vizyonumuz',
  aboutVisionTextAr: 'رؤيتنا هي أن نكون البوابة العقارية الرائدة في قبرص، معروفين بتميزنا في الخدمة، وموثوقية قوائمنا، وابتكارنا التكنولوجي الذي يجعل تجربة البحث عن العقارات سلسة وممتعة.',
  aboutVisionTextEn: 'Our vision is to be the leading real estate portal in Cyprus, known for our service excellence, the reliability of our listings, and our technological innovation that makes the property search experience seamless and enjoyable.',
  aboutVisionTextTr: 'Vizyonumuz, hizmet mükemmelliğimiz, listelerimizin güvenilirliği ve mülk arama deneyimini sorunsuz ve keyifli hale getiren teknolojik yeniliklerimizle tanınan Kıbrıs\'ın önde gelen emlak portalı olmaktır.',
  aboutTeamTitleAr: 'تعرف على فريقنا',
  aboutTeamTitleEn: 'Meet Our Team',
  aboutTeamTitleTr: 'Ekibimizle Tanışın',
  aboutTeamTextAr: 'نحن فريق من الخبراء المتحمسين لمساعدتك في كل خطوة. من المطورين إلى خبراء العقارات، كلنا هنا لخدمتك.',
  aboutTeamTextEn: 'We are a team of passionate experts dedicated to helping you every step of the way. From developers to real estate experts, we are all here to serve you.',
  aboutTeamTextTr: 'Her adımda size yardımcı olmaya adanmış tutkulu uzmanlardan oluşan bir ekibiz. Geliştiricilerden emlak uzmanlarına kadar hepimiz size hizmet etmek için buradayız.',
  aboutTeamMembers: JSON.stringify([
    { "name_ar": "أحمد علي", "name_en": "Ahmed Ali", "name_tr": "Ahmet Ali", "role_ar": "المدير التنفيذي", "role_en": "CEO", "role_tr": "CEO", "avatar": "/placeholder.svg" },
    { "name_ar": "فاطمة خان", "name_en": "Fatima Khan", "name_tr": "Fatma Han", "role_ar": "مديرة التسويق", "role_en": "Marketing Director", "role_tr": "Pazarlama Direktörü", "avatar": "/placeholder.svg" },
    { "name_ar": "جان سميث", "name_en": "John Smith", "name_tr": "John Smith", "role_ar": "كبير المطورين", "role_en": "Lead Developer", "role_tr": "Baş Geliştirici", "avatar": "/placeholder.svg" }
  ], null, 2),
  
  // Default Suspension Messages
  suspensionTitleAr: 'الحساب موقوف',
  suspensionTitleEn: 'Account Suspended',
  suspensionTitleTr: 'Hesap Askıya Alındı',
  suspensionMessageAr: 'تم إيقاف حسابك لانتهاك سياسات الموقع. لا يمكنك إضافة عقارات جديدة أو إدارة العقارات الموجودة. عقاراتك السابقة مخفية عن المستخدمين الآخرين.',
  suspensionMessageEn: 'Your account has been suspended for violating site policies. You cannot add new properties or manage existing ones. Your previous properties are hidden from other users.',
  suspensionMessageTr: 'Site politikalarını ihlal ettiğiniz için hesabınız askıya alındı. Yeni mülk ekleyemez veya mevcut mülkleri yönetemezsiniz. Önceki mülkleriniz diğer kullanıcılardan gizlenmiştir.',

  // Default Pending Approval Messages
  pendingApprovalTitleAr: 'حسابك قيد المراجعة',
  pendingApprovalTitleEn: 'Account Under Review',
  pendingApprovalTitleTr: 'Hesabınız İnceleniyor',
  pendingApprovalMessageAr: 'شكراً لتسجيلك في منصتنا! حسابك الآن قيد المراجعة من قبل الإدارة، لا يمكنك نشر أي عقار حتى تتم الموافقة. سيتم تفعيل حسابك بعد إتمام عملية المراجعة.',
  pendingApprovalMessageEn: 'Thank you for registering on our platform! Your account is now under review by management. You cannot publish any properties until approved. Your account will be activated after the review process is complete.',
  pendingApprovalMessageTr: 'Platformumuza kaydolduğunuz için teşekkür ederiz! Hesabınız şu anda yönetim tarafından incelendiği için herhangi bir mülk yayınlayamazsınız. İnceleme süreci tamamlandıktan sonra hesabınız etkinleştirilecektir.',

  // Default Favicon
  faviconUrl: '/favicon.ico',

  // Hero Section Defaults
  heroSlideshowEnabled: false,
  heroSlideshowInterval: 5, // in seconds
  heroTitleAr: "اكتشف مكانك المثالي",
  heroTitleEn: "Find your perfect place",
  heroTitleTr: "Mükemmel Yerinizi Keşfedin",
  heroDescriptionAr: "انطلق في رحلة استكشاف العقارات الفريدة",
  heroDescriptionEn: "Start your journey of discovering unique properties",
  heroDescriptionTr: "Benzersiz mülkler keşfetmeye başlayın",

  // 404 Page Settings Defaults
  notFoundTitleAr: 'عذراً! الصفحة غير موجودة',
  notFoundTitleEn: 'Oops! Page not found',
  notFoundTitleTr: 'Üzgünüz! Sayfa bulunamadı',
  notFoundDescAr: 'يبدو أنك ضللت الطريق. لا تقلق، يمكنك العودة للبداية.',
  notFoundDescEn: 'It seems you are lost. Do not worry, you can return to the homepage.',
  notFoundDescTr: 'Görünüşe göre kayboldun. Endişelenme, ana sayfaya dönebilirsin.',
  notFoundButtonAr: 'العودة للرئيسية',
  notFoundButtonEn: 'Return to Home',
  notFoundButtonTr: 'Ana Sayfaya Dön',
  notFoundSvgAr: '',
  notFoundSvgEn: '',
  notFoundSvgTr: '',
};

// This type maps SiteSettings keys to their corresponding database keys
export type SiteSettingDBKey = 
  | 'site_name' 
  | 'site_description' 
  | 'support_email' 
  | 'max_properties' 
  | 'registration_enabled' 
  | 'maintenance_mode' 
  | 'brand_accent_color'
  | 'facebook_url'
  | 'instagram_url'
  | 'twitter_url'
  | 'address'
  | 'phone_number'
  | 'site_email_address'
  | 'suspension_title'
  | 'suspension_message'
  | 'pending_approval_title'
  | 'pending_approval_message';

export type SiteSettingsDBMap = {
  [K in keyof SiteSettings]?: SiteSettingDBKey | { ar: SiteSettingDBKey, en: SiteSettingDBKey, tr: SiteSettingDBKey }
};

// Helper type for raw settings from DB
export type RawDbSetting = {
  setting_key: string;
  setting_value_ar: string | null;
  setting_value_en: string | null;
  setting_value_tr: string | null;
};
