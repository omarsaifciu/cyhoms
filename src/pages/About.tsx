
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Building, Users, Target, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const { t, currentLanguage } = useLanguage();
  const { settings: siteSettings } = useSiteSettings();
  const navigate = useNavigate();

  const getLocalizedContent = (ar: string, en: string, tr: string) => {
    if (currentLanguage === 'ar') return ar;
    if (currentLanguage === 'tr') return tr;
    return en;
  };
  
  const siteName = (currentLanguage === 'ar' ? siteSettings?.siteNameAr : currentLanguage === 'tr' ? siteSettings?.siteNameTr : siteSettings?.siteNameEn) || t('cyprusRentals');
  
  const getLocalizedSetting = (keyPrefix: string, fallback: string) => {
    const langSuffix = currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    const key = `${keyPrefix}${langSuffix}` as keyof typeof siteSettings;
    const value = siteSettings?.[key];
    // This check ensures we only return strings, fixing the error.
    if (typeof value === 'string' && value) {
        return value;
    }
    return fallback;
  };

  const pageTitle = getLocalizedSetting('aboutPageTitle', getLocalizedContent('من نحن', 'About Us', 'Hakkımızda'));
  const pageSubtitleUnformatted = getLocalizedSetting('aboutPageSubtitle', getLocalizedContent(`تعرف على قصة ${siteName} ورؤيتنا في سوق العقارات.`, `Learn about ${siteName}'s story and our vision in the real estate market.`, `${siteName}'un hikayesini ve emlak piyasasındaki vizyonumuzu öğrenin.`));
  const pageSubtitle = pageSubtitleUnformatted.replace('{siteName}', siteName);


  const ourMissionTitle = getLocalizedSetting('aboutMissionTitle', getLocalizedContent('مهمتنا', 'Our Mission', 'Misyonumuz'));
  const ourMissionText = getLocalizedSetting('aboutMissionText', getLocalizedContent(
    'مهمتنا هي تبسيط عملية العثور على العقار المثالي في قبرص، سواء كان للإيجار، البيع، أو لسكن الطلاب. نحن نسعى لتقديم منصة شفافة وموثوقة تجمع بين أصحاب العقارات والباحثين عنها بكل سهولة.',
    'Our mission is to simplify the process of finding the perfect property in Cyprus, whether for rent, sale, or student housing. We strive to provide a transparent and reliable platform that easily connects property owners with seekers.',
    'Misyonumuz, Kıbrıs\'ta kiralık, satılık veya öğrenci konutu olsun, mükemmel mülkü bulma sürecini basitleştirmektir. Mülk sahiplerini ve arayanları kolayca bir araya getiren şeffaf ve güvenilir bir platform sağlamaya çalışıyoruz.'
  ));

  const ourVisionTitle = getLocalizedSetting('aboutVisionTitle', getLocalizedContent('رؤيتنا', 'Our Vision', 'Vizyonumuz'));
  const ourVisionText = getLocalizedSetting('aboutVisionText', getLocalizedContent(
    'رؤيتنا هي أن نكون البوابة العقارية الرائدة في قبرص، معروفين بتميزنا في الخدمة، وموثوقية قوائمنا، وابتكارنا التكنولوجي الذي يجعل تجربة البحث عن العقارات سلسة وممتعة.',
    'Our vision is to be the leading real estate portal in Cyprus, known for our service excellence, the reliability of our listings, and our technological innovation that makes the property search experience seamless and enjoyable.',
    'Vizyonumuz, hizmet mükemmelliğimiz, listelerimizin güvenilirliği ve mülk arama deneyimini sorunsuz ve keyifli hale getiren teknolojik yeniliklerimizle tanınan Kıbrıs\'ın önde gelen emlak portalı olmaktır.'
  ));
  
  const teamTitle = getLocalizedSetting('aboutTeamTitle', getLocalizedContent('تعرف على فريقنا', 'Meet Our Team', 'Ekibimizle Tanışın'));
  const teamText = getLocalizedSetting('aboutTeamText', getLocalizedContent(
    'نحن فريق من الخبراء المتحمسين لمساعدتك في كل خطوة. من المطورين إلى خبراء العقارات، كلنا هنا لخدمتك.',
    'We are a team of passionate experts dedicated to helping you every step of the way. From developers to real estate experts, we are all here to serve you.',
    'Her adımda size yardımcı olmaya adanmış tutkulu uzmanlardan oluşan bir ekibiz. Geliştiricilerden emlak uzmanlarına kadar hepimiz size hizmet etmek için buradayız.'
  ));
  
  let teamMembersData = [];
  try {
    if (siteSettings?.aboutTeamMembers && siteSettings.aboutTeamMembers.trim() !== '') {
      const parsed = JSON.parse(siteSettings.aboutTeamMembers);
      if (Array.isArray(parsed)) {
        teamMembersData = parsed;
      } else {
        console.warn("Team members data is not an array, using default data");
      }
    }
  } catch (error) {
    console.error("Error parsing team members from settings:", error);
    console.error("Raw data:", siteSettings?.aboutTeamMembers);
  }

  const teamMembers = teamMembersData.length > 0
    ? teamMembersData.map((member: any) => ({
        name: getLocalizedContent(member.name_ar, member.name_en, member.name_tr),
        role: getLocalizedContent(member.role_ar, member.role_en, member.role_tr),
        avatar: member.avatar || '/placeholder.svg'
      }))
    : [
      { name: getLocalizedContent('أحمد علي', 'Ahmed Ali', 'Ahmet Ali'), role: getLocalizedContent('المدير التنفيذي', 'CEO', 'CEO'), avatar: '/placeholder.svg' },
      { name: getLocalizedContent('فاطمة خان', 'Fatima Khan', 'Fatma Han'), role: getLocalizedContent('مديرة التسويق', 'Marketing Director', 'Pazarlama Direktörü'), avatar: '/placeholder.svg' },
      { name: getLocalizedContent('جان سميث', 'John Smith', 'John Smith'), role: getLocalizedContent('كبير المطورين', 'Lead Developer', 'Baş Geliştirici'), avatar: '/placeholder.svg' },
    ];


  return (
    <div className="bg-white dark:bg-[#222636] min-h-screen mt-8 transition-colors duration-300">
      <header className="bg-brand-accent-light dark:bg-[#181c23] py-20 animate-fade-in transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full p-2 md:p-3 shrink-0 px-[16px] py-[8px] bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border-white/30 dark:border-slate-600/50 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100">
              {currentLanguage === 'ar' ? (
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex-1 text-gray-900 dark:text-white truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="text-center">
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
              {pageSubtitle}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="grid md:grid-cols-2 gap-12 items-center animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent-light dark:bg-[#232535] rounded-full animate-scale-in" style={{animationDelay: '0.4s'}}>
                <Target className="w-8 h-8 text-brand-accent" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white animate-fade-in" style={{animationDelay: '0.5s'}}>{ourMissionTitle}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-200 leading-relaxed animate-fade-in" style={{animationDelay: '0.6s'}}>
              {ourMissionText}
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent-light dark:bg-[#232535] rounded-full animate-scale-in" style={{animationDelay: '0.4s'}}>
                <Building className="w-8 h-8 text-brand-accent" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white animate-fade-in" style={{animationDelay: '0.5s'}}>{ourVisionTitle}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-200 leading-relaxed animate-fade-in" style={{animationDelay: '0.6s'}}>
              {ourVisionText}
            </p>
          </div>
        </section>

        <section className="mt-20 text-center animate-fade-in" style={{animationDelay: '0.5s'}}>
          <div className="flex justify-center items-center gap-4">
             <div className="p-3 bg-brand-accent-light dark:bg-[#232535] rounded-full animate-scale-in" style={{animationDelay: '0.6s'}}>
                <Users className="w-8 h-8 text-brand-accent" />
              </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white animate-fade-in" style={{animationDelay: '0.7s'}}>{teamTitle}</h2>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.8s'}}>
            {teamText}
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 dark:bg-[#181c23] rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl animate-scale-in" style={{animationDelay: `${index * 150 + 900}ms`}}>
                <img className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 dark:bg-[#232535]" src={member.avatar} alt={member.name} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-brand-accent dark:text-brand-accent">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
