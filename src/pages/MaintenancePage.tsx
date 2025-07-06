
import { Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MaintenancePage = () => {
  const { currentLanguage } = useLanguage();

  const title = currentLanguage === 'ar' ? 'تحت الصيانة' : 'Under Maintenance';
  const message = currentLanguage === 'ar' ? 'موقعنا يخضع حاليًا للصيانة المجدولة. سنعود قريبًا. شكرا لصبرك.' : 'Our site is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="animate-fade-in max-w-2xl">
        <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-brand-accent opacity-20 rounded-full animate-pulse"></div>
            <Wrench className="relative h-24 w-24 text-brand-accent p-4" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {message}
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
