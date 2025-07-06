
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useContactSubjects } from "@/hooks/useContactSubjects";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const ContactForm = () => {
    const { t, currentLanguage } = useLanguage();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { settings, loading: settingsLoading } = useSiteSettings();

    // جلب مواضيع التواصل
    const { data: subjects, isLoading: subjectsLoading } = useContactSubjects();

    const formSchema = useMemo(() => z.object({
        name: z.string().min(2, { message: t('nameMin') }),
        email: z.string().email({ message: t('emailInvalid') }),
        subject: z.string().min(1, { message: t('subjectMin') }), // يلتقط عدم الاختيار
        message: z.string().min(10, { message: t('messageMin') }),
        attachment: z.any().optional(),
    }), [t]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
            attachment: undefined,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        
        if (settingsLoading) {
            toast({
                title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
                description: currentLanguage === 'ar' ? 'الإعدادات لا تزال قيد التحميل. يرجى المحاولة مرة أخرى بعد لحظات قليلة.' : 'Settings are still loading. Please try again in a few moments.',
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        if (!settings?.supportEmail) {
            toast({
                title: currentLanguage === 'ar' ? 'خطأ في الإعدادات' : 'Configuration Error',
                description: currentLanguage === 'ar' ? 'لم يتم تكوين بريد الدعم الفني في إعدادات الموقع. يرجى الاتصال بمسؤول الموقع.' : 'Support email is not configured in site settings. Please contact the site administrator.',
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            let attachmentPath: string | null = null;
            let attachmentFileName: string | null = null;
            const fileList = values.attachment as FileList | undefined;

            if (fileList && fileList.length > 0) {
                const file = fileList[0];
                attachmentFileName = file.name;
                const path = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
                attachmentPath = path;

                const { error: uploadError } = await supabase.storage
                    .from('contact_attachments')
                    .upload(path, file);

                if (uploadError) {
                    toast({
                        title: t('error'),
                        description: t('fileUploadFailed') || 'File upload failed.',
                        variant: 'destructive',
                    });
                    setIsSubmitting(false);
                    return;
                }
            }

            const { data, error } = await supabase.functions.invoke('send-contact-email', {
                body: {
                    name: values.name,
                    email: values.email,
                    subject: values.subject,
                    message: values.message,
                    recipientEmail: settings.supportEmail, // استخدام الإيميل من الإعدادات
                    attachmentPath,
                    attachmentFileName,
                },
            });

            if (error) {
                console.error("Edge function error:", error);
                throw new Error(error.message || "Failed to send email");
            }

            if (data?.error) {
                console.error("Email service error:", data.error);
                throw new Error(data.error);
            }
            
            toast({
                title: t('formSubmittedTitle'),
                description: t('formSubmittedDesc'),
            });
            form.reset();

        } catch (error: any) {
            console.error("Contact form submission error:", error);

            // Provide more specific error messages
            let errorMessage = currentLanguage === 'ar'
                ? 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى في وقت لاحق.'
                : 'An error occurred while sending your message. Please try again later.';

            if (error.message.includes('timeout')) {
                errorMessage = currentLanguage === 'ar'
                    ? 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.'
                    : 'Request timeout. Please try again.';
            } else if (error.message.includes('configuration')) {
                errorMessage = currentLanguage === 'ar'
                    ? 'خدمة البريد الإلكتروني غير متاحة حالياً. يرجى المحاولة لاحقاً.'
                    : 'Email service is currently unavailable. Please try again later.';
            } else if (error.message.includes('required fields')) {
                errorMessage = currentLanguage === 'ar'
                    ? 'يرجى ملء جميع الحقول المطلوبة.'
                    : 'Please fill in all required fields.';
            }

            toast({
                title: currentLanguage === 'ar' ? 'خطأ في الإرسال' : 'Send Error',
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // helper to get option label for current language
    const getSubjectLabel = (subject: any) => {
      if (currentLanguage === "ar") return subject.name_ar;
      if (currentLanguage === "tr") return subject.name_tr;
      return subject.name_en;
    };

    // helper: placeholder option text per language
    const subjectPlaceholderOption = () => {
      if (currentLanguage === "ar") return "اختر موضوعًا";
      if (currentLanguage === "tr") return "Bir konu seçin";
      return "Select a subject";
    };

    return (
        <div className="bg-white dark:bg-[#181c23] rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-[#232535] h-full transition-colors duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-cairo">{t('contactFormTitle')}</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{t('contactFormSubtitle')}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
                    {/* الحقول */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="dark:text-gray-200">{t('name')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('namePlaceholder')} {...field} className="dark:bg-[#23293d] dark:text-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="dark:text-gray-200">{t('email')}</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder={'you@example.com'} {...field} className="dark:bg-[#23293d] dark:text-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* SUBJECT FIELD - Dropdown / Select */}
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-200">{t('subject')}</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={subjectsLoading}
                              >
                                <SelectTrigger className="dark:bg-[#23293d] dark:text-white">
                                  <SelectValue placeholder={subjectPlaceholderOption()} />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-[#23293d] dark:text-white">
                                  {subjectsLoading && (
                                    <div className="flex items-center justify-center p-2">
                                      <Loader2 className="animate-spin w-5 h-5" />
                                      <span className="ml-2">{t("loading")}</span>
                                    </div>
                                  )}
                                  {subjects && subjects.length > 0 && subjects.map((subj) => (
                                    <SelectItem key={subj.id} value={getSubjectLabel(subj)} className="dark:text-white dark:hover:bg-[#23293d]">
                                      {getSubjectLabel(subj)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="attachment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="dark:text-gray-200">{t('attachment')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        className="dark:bg-[#23293d] dark:text-white file:dark:text-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="dark:text-gray-200">{t('yourMessage')}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={t('messagePlaceholder')} rows={5} {...field} className="dark:bg-[#23293d] dark:text-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-foreground text-base py-6 transition-all duration-300 transform hover:scale-105">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('sendMessage')}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ContactForm;
