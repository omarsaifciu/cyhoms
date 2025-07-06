
import ContactDetails from "@/components/contact/ContactDetails";
import ContactForm from "@/components/contact/ContactForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
    const { t, currentLanguage } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50/50 dark:bg-[#222636] min-h-screen transition-colors duration-300">
            <div className="container mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                {/* Header with back button */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
                    <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full p-2 md:p-3 shrink-0 px-[16px] py-[8px]">
                        {currentLanguage === 'ar' ? (
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                    </Button>
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex-1 text-gray-900 dark:text-white truncate">
                        {t('contactPageTitle')}
                    </h1>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-200">
                        {t('contactPageSubtitle')}
                    </p>
                </motion.div>

                <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="h-full"
                    >
                        <ContactDetails />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="h-full"
                    >
                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
