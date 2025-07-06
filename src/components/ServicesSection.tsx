
import { Search, Star, Heart, Shield, Clock, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesSection = () => {
  const { t, currentLanguage } = useLanguage();

  const services = [
    {
      icon: Search,
      title: currentLanguage === 'ar' ? 'بحث متقدم' : 
             currentLanguage === 'tr' ? 'Gelişmiş Arama' : 
             'Advanced Search',
      description: currentLanguage === 'ar' ? 'أدوات بحث قوية للعثور على العقار المثالي' : 
                   currentLanguage === 'tr' ? 'Mükemmel mülkü bulmak için güçlü arama araçları' : 
                   'Powerful search tools to find your perfect property',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-[#23283b]/70'
    },
    {
      icon: Shield,
      title: currentLanguage === 'ar' ? 'عقارات موثقة' : 
             currentLanguage === 'tr' ? 'Doğrulanmış Mülkler' : 
             'Verified Properties',
      description: currentLanguage === 'ar' ? 'جميع العقارات محققة ومضمونة الجودة' : 
                   currentLanguage === 'tr' ? 'Tüm mülkler doğrulanmış ve kalite garantili' : 
                   'All properties are verified and quality guaranteed',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-[#203529]/70'
    },
    {
      icon: Clock,
      title: currentLanguage === 'ar' ? 'دعم سريع' : 
             currentLanguage === 'tr' ? 'Hızlı Destek' : 
             'Quick Support',
      description: currentLanguage === 'ar' ? 'فريق دعم متاح 24/7 لمساعدتك' : 
                   currentLanguage === 'tr' ? 'Size yardımcı olmak için 7/24 destek ekibi' : 
                   '24/7 support team available to help you',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-[#301c36]/70'
    },
    {
      icon: Star,
      title: currentLanguage === 'ar' ? 'تقييمات حقيقية' : 
             currentLanguage === 'tr' ? 'Gerçek Değerlendirmeler' : 
             'Real Reviews',
      description: currentLanguage === 'ar' ? 'تقييمات صادقة من مستأجرين حقيقيين' : 
                   currentLanguage === 'tr' ? 'Gerçek kiracılardan dürüst değerlendirmeler' : 
                   'Honest reviews from real tenants',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-[#3d3120]/70'
    },
    {
      icon: Heart,
      title: currentLanguage === 'ar' ? 'خدمة شخصية' : 
             currentLanguage === 'tr' ? 'Kişiselleştirilmiş Hizmet' : 
             'Personal Service',
      description: currentLanguage === 'ar' ? 'نهتم بكل التفاصيل لجعل تجربتك مميزة' : 
                   currentLanguage === 'tr' ? 'Deneyiminizi özel kılmak için her detayla ilgileniyoruz' : 
                   'We care about every detail to make your experience special',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50 dark:bg-[#3d1f2e]/70'
    },
    {
      icon: Award,
      title: currentLanguage === 'ar' ? 'أفضل الأسعار' : 
             currentLanguage === 'tr' ? 'En İyi Fiyatlar' : 
             'Best Prices',
      description: currentLanguage === 'ar' ? 'أسعار تنافسية وعروض حصرية' : 
                   currentLanguage === 'tr' ? 'Rekabetçi fiyatlar ve özel teklifler' : 
                   'Competitive prices and exclusive deals',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50 dark:bg-[#212647]/70'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#181926] dark:via-[#232433] dark:to-[#181926] transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {currentLanguage === 'ar' ? 'لماذا تختارنا؟' : 
             currentLanguage === 'tr' ? 'Neden Bizi Seçmelisiniz?' : 
             'Why Choose Us?'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {currentLanguage === 'ar' ? 'نقدم خدمات متميزة تجعل رحلة البحث عن العقار تجربة ممتعة وسهلة' : 
             currentLanguage === 'tr' ? 'Mülk arama yolculuğunuzu keyifli ve kolay hale getiren üstün hizmetler sunuyoruz' : 
             'We provide exceptional services that make your property search journey enjoyable and easy'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${service.bgColor} rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 dark:border-[#232433]/60`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 group-hover:bg-clip-text transition-all duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
