
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Ban, Clock, AlertTriangle, Timer } from 'lucide-react';

interface SuspensionMessageProps {
  userId: string;
}

interface SuspensionData {
  is_suspended: boolean;
  suspension_end_date: string | null;
  suspension_reason: string | null;
  suspension_reason_ar: string | null;
  suspension_reason_en: string | null;
  suspension_reason_tr: string | null;
}

const SuspensionMessage = ({ userId }: SuspensionMessageProps) => {
  const { currentLanguage } = useLanguage();
  const [suspensionData, setSuspensionData] = useState<SuspensionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const fetchSuspensionData = async () => {
      try {
        console.log('=== FETCHING SUSPENSION DATA ===');
        console.log('Fetching data for userId:', userId);

        const { data, error } = await supabase
          .from('profiles')
          .select('is_suspended, suspension_end_date, suspension_reason, suspension_reason_ar, suspension_reason_en, suspension_reason_tr')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('=== FETCH ERROR ===');
          console.error('Error:', error);
          throw error;
        }
        
        console.log('=== FETCH SUCCESS ===');
        console.log('Raw fetched data:', JSON.stringify(data, null, 2));
        console.log('suspension_end_date value:', data?.suspension_end_date);
        console.log('suspension_end_date type:', typeof data?.suspension_end_date);
        console.log('is_suspended:', data?.is_suspended);
        
        // تحليل نوع الحظر بناءً على البيانات المُستلمة
        const hasEndDate = data?.suspension_end_date !== null && 
                          data?.suspension_end_date !== undefined && 
                          data?.suspension_end_date !== '';
        
        console.log('Has end date (is temporary):', hasEndDate);
        
        if (hasEndDate && data?.suspension_end_date) {
          const endDate = new Date(data.suspension_end_date);
          console.log('Parsed end date:', endDate);
          console.log('Is valid date:', !isNaN(endDate.getTime()));
          console.log('End date vs now:', endDate.getTime() > Date.now() ? 'في المستقبل' : 'في الماضي');
        }
        
        setSuspensionData(data);
      } catch (error) {
        console.error('=== SUSPENSION DATA FETCH ERROR ===');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSuspensionData();
    }
  }, [userId]);

  // تحديد نوع الحظر بدقة أكبر مع تسجيل إضافي
  const isTemporary = suspensionData?.suspension_end_date !== null && 
                     suspensionData?.suspension_end_date !== undefined && 
                     suspensionData?.suspension_end_date !== '' &&
                     suspensionData?.suspension_end_date?.trim() !== '';
  
  const suspensionEndDate = isTemporary && suspensionData?.suspension_end_date 
    ? new Date(suspensionData.suspension_end_date)
    : null;

  console.log('=== SUSPENSION TYPE ANALYSIS (RENDER) ===');
  console.log('Raw suspension_end_date:', suspensionData?.suspension_end_date);
  console.log('isTemporary calculated:', isTemporary);
  console.log('suspensionEndDate object:', suspensionEndDate);
  console.log('Is valid date?', suspensionEndDate && !isNaN(suspensionEndDate.getTime()));

  // تحديث العد التنازلي كل ثانية للحظر المؤقت
  useEffect(() => {
    if (!isTemporary || !suspensionEndDate || isNaN(suspensionEndDate.getTime())) {
      setTimeRemaining('');
      return;
    }

    const updateTimeRemaining = () => {
      const now = new Date();
      const diff = suspensionEndDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('انتهى');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let timeString = '';
      if (days > 0) {
        timeString += `${days} ${currentLanguage === 'ar' ? 'يوم' : currentLanguage === 'tr' ? 'gün' : 'days'} `;
      }
      if (hours > 0) {
        timeString += `${hours} ${currentLanguage === 'ar' ? 'ساعة' : currentLanguage === 'tr' ? 'saat' : 'hours'} `;
      }
      if (minutes > 0) {
        timeString += `${minutes} ${currentLanguage === 'ar' ? 'دقيقة' : currentLanguage === 'tr' ? 'dakika' : 'minutes'} `;
      }
      if (seconds > 0 && days === 0) {
        timeString += `${seconds} ${currentLanguage === 'ar' ? 'ثانية' : currentLanguage === 'tr' ? 'saniye' : 'seconds'}`;
      }

      setTimeRemaining(timeString.trim());
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [isTemporary, suspensionEndDate, currentLanguage]);

  if (loading || !suspensionData?.is_suspended) {
    return null;
  }

  // الحصول على السبب باللغة المناسبة
  const getSuspensionReason = () => {
    let reason = '';
    switch (currentLanguage) {
      case 'ar':
        reason = suspensionData.suspension_reason_ar || suspensionData.suspension_reason_en || suspensionData.suspension_reason_tr || suspensionData.suspension_reason || '';
        break;
      case 'tr':
        reason = suspensionData.suspension_reason_tr || suspensionData.suspension_reason_en || suspensionData.suspension_reason_ar || suspensionData.suspension_reason || '';
        break;
      default:
        reason = suspensionData.suspension_reason_en || suspensionData.suspension_reason_ar || suspensionData.suspension_reason_tr || suspensionData.suspension_reason || '';
    }
    return reason;
  };

  const getTitle = () => {
    if (currentLanguage === 'ar') {
      return isTemporary ? 'الحساب موقوف مؤقتاً' : 'الحساب موقوف نهائياً';
    } else if (currentLanguage === 'tr') {
      return isTemporary ? 'Hesap Geçici Olarak Askıya Alındı' : 'Hesap Kalıcı Olarak Askıya Alındı';
    } else {
      return isTemporary ? 'Account Temporarily Suspended' : 'Account Permanently Suspended';
    }
  };

  const getMessage = () => {
    if (currentLanguage === 'ar') {
      return isTemporary 
        ? 'تم إيقاف حسابك مؤقتاً. سيتم إعادة تفعيل حسابك تلقائياً في التاريخ المحدد.'
        : 'تم إيقاف حسابك نهائياً بسبب انتهاك شروط الخدمة. يرجى التواصل مع الدعم إذا كنت تعتقد أن هذا خطأ.';
    } else if (currentLanguage === 'tr') {
      return isTemporary
        ? 'Hesabınız geçici olarak askıya alındı. Hesabınız belirtilen tarihte otomatik olarak yeniden etkinleştirilecek.'
        : 'Hesabınız hizmet şartlarını ihlal ettiği için kalıcı olarak askıya alındı. Bunun bir hata olduğunu düşünüyorsanız lütfen destekle iletişime geçin.';
    } else {
      return isTemporary
        ? 'Your account has been temporarily suspended. Your account will be automatically reactivated on the specified date.'
        : 'Your account has been permanently suspended due to violation of terms of service. Please contact support if you believe this is an error.';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'gregory' // Force Gregorian calendar for Arabic
    }).format(date);
  };

  const reason = getSuspensionReason();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            {isTemporary ? (
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            ) : (
              <Ban className="w-8 h-8 text-red-600 dark:text-red-400" />
            )}
          </div>
          <CardTitle className="text-xl font-bold text-red-800 dark:text-red-300">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* رسالة تنبيه رئيسية */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {getMessage()}
            </AlertDescription>
          </Alert>

          {/* عرض نوع الحظر مع المزيد من التفاصيل */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              {isTemporary ? (
                <Clock className="w-4 h-4 text-orange-600" />
              ) : (
                <Ban className="w-4 h-4 text-red-600" />
              )}
              <div className="text-gray-700 dark:text-gray-300">
                <strong>
                  {currentLanguage === 'ar' ? 'نوع الحظر:' : 
                   currentLanguage === 'tr' ? 'Askıya alma türü:' : 
                   'Suspension Type:'}
                </strong>
                <br />
                <span className={`font-medium ${isTemporary ? 'text-orange-600' : 'text-red-600'}`}>
                  {currentLanguage === 'ar' ? (isTemporary ? 'مؤقت' : 'دائم') : 
                   currentLanguage === 'tr' ? (isTemporary ? 'Geçici' : 'Kalıcı') : 
                   (isTemporary ? 'Temporary' : 'Permanent')}
                </span>
                {/* عرض معلومات إضافية للتشخيص */}
                <div className="text-xs text-gray-500 mt-1">
                  Debug: End Date = {suspensionData?.suspension_end_date || 'null'}
                </div>
              </div>
            </div>
          </div>

          {/* عرض سبب الحظر */}
          {reason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-gray-700 dark:text-gray-300">
                  <strong>
                    {currentLanguage === 'ar' ? 'سبب الحظر:' : 
                     currentLanguage === 'tr' ? 'Askıya alma nedeni:' : 
                     'Suspension Reason:'}
                  </strong>
                  <br />
                  <span className="text-red-700 dark:text-red-300 font-medium">
                    {reason}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* تاريخ انتهاء الحظر المؤقت */}
          {isTemporary && suspensionEndDate && !isNaN(suspensionEndDate.getTime()) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-yellow-600" />
                <div className="text-yellow-800 dark:text-yellow-300">
                  <strong>
                    {currentLanguage === 'ar' ? 'تاريخ إعادة التفعيل:' : 
                     currentLanguage === 'tr' ? 'Yeniden etkinleştirme tarihi:' : 
                     'Reactivation Date:'}
                  </strong>
                  <br />
                  <span className="font-medium">
                    {formatDate(suspensionEndDate)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* العد التنازلي للحظر المؤقت */}
          {isTemporary && timeRemaining && timeRemaining !== 'انتهى' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="w-4 h-4 text-blue-600" />
                <div className="text-blue-800 dark:text-blue-300">
                  <strong>
                    {currentLanguage === 'ar' ? 'الوقت المتبقي:' : 
                     currentLanguage === 'tr' ? 'Kalan süre:' : 
                     'Time Remaining:'}
                  </strong>
                  <br />
                  <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-300">
                    {timeRemaining}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
            {currentLanguage === 'ar' ? 'للمساعدة، يرجى التواصل مع فريق الدعم' : 
             currentLanguage === 'tr' ? 'Yardım için lütfen destek ekibimizle iletişime geçin' : 
             'For assistance, please contact our support team'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuspensionMessage;
