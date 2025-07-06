
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSuspensionManagement } from "@/hooks/useSuspensionManagement";
import { Ban, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SuspensionDialogProps {
  userId: string;
  userName: string;
  onSuspensionUpdated: () => void;
  trigger?: React.ReactNode;
}

const SuspensionDialog = ({ userId, userName, onSuspensionUpdated, trigger }: SuspensionDialogProps) => {
  const { currentLanguage } = useLanguage();
  const { suspendUser, loading } = useSuspensionManagement();
  const [open, setOpen] = useState(false);
  const [suspensionType, setSuspensionType] = useState<'temporary' | 'permanent'>('temporary');
  const [duration, setDuration] = useState('1_day');
  const [reasonAr, setReasonAr] = useState('');
  const [reasonEn, setReasonEn] = useState('');
  const [reasonTr, setReasonTr] = useState('');

  const handleSuspend = async () => {
    const reasons = {
      ar: reasonAr.trim(),
      en: reasonEn.trim(),
      tr: reasonTr.trim()
    };
    
    // التحقق من وجود سبب واحد على الأقل
    if (!reasons.ar && !reasons.en && !reasons.tr) {
      return;
    }

    const result = await suspendUser(userId, suspensionType, duration, reasons);
    if (result.success) {
      setOpen(false);
      setReasonAr('');
      setReasonEn('');
      setReasonTr('');
      onSuspensionUpdated();
    }
  };

  const t = {
    ar: {
      suspendUser: 'حظر المستخدم',
      suspensionType: 'نوع الحظر',
      temporary: 'مؤقت',
      permanent: 'دائم',
      duration: 'مدة الحظر',
      reason: 'سبب الحظر',
      reasonPlaceholder: 'اكتب سبب الحظر...',
      confirm: 'تأكيد الحظر',
      cancel: 'إلغاء',
      suspending: 'جارٍ الحظر...',
      reasonInArabic: 'السبب بالعربية',
      reasonInEnglish: 'السبب بالإنجليزية',
      reasonInTurkish: 'السبب بالتركية',
      languages: 'اللغات',
      durations: {
        '1_day': 'يوم واحد',
        '1_week': 'أسبوع واحد',
        '1_month': 'شهر واحد',
        '3_months': 'ثلاثة أشهر',
        '6_months': 'ستة أشهر',
        '1_year': 'سنة واحدة'
      }
    },
    en: {
      suspendUser: 'Suspend User',
      suspensionType: 'Suspension Type',
      temporary: 'Temporary',
      permanent: 'Permanent',
      duration: 'Suspension Duration',
      reason: 'Suspension Reason',
      reasonPlaceholder: 'Enter suspension reason...',
      confirm: 'Confirm Suspension',
      cancel: 'Cancel',
      suspending: 'Suspending...',
      reasonInArabic: 'Reason in Arabic',
      reasonInEnglish: 'Reason in English',
      reasonInTurkish: 'Reason in Turkish',
      languages: 'Languages',
      durations: {
        '1_day': 'One Day',
        '1_week': 'One Week',
        '1_month': 'One Month',
        '3_months': 'Three Months',
        '6_months': 'Six Months',
        '1_year': 'One Year'
      }
    },
    tr: {
      suspendUser: 'Kullanıcıyı Askıya Al',
      suspensionType: 'Askıya Alma Türü',
      temporary: 'Geçici',
      permanent: 'Kalıcı',
      duration: 'Askıya Alma Süresi',
      reason: 'Askıya Alma Nedeni',
      reasonPlaceholder: 'Askıya alma nedenini girin...',
      confirm: 'Askıya Almayı Onayla',
      cancel: 'İptal',
      suspending: 'Askıya Alınıyor...',
      reasonInArabic: 'Arapça Neden',
      reasonInEnglish: 'İngilizce Neden',
      reasonInTurkish: 'Türkçe Neden',
      languages: 'Diller',
      durations: {
        '1_day': 'Bir Gün',
        '1_week': 'Bir Hafta',
        '1_month': 'Bir Ay',
        '3_months': 'Üç Ay',
        '6_months': 'Altı Ay',
        '1_year': 'Bir Yıl'
      }
    }
  };

  const translations = t[currentLanguage];
  const hasReason = reasonAr.trim() || reasonEn.trim() || reasonTr.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Ban className="w-3 h-3 mr-1" />
            {translations.suspendUser}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-500" />
            {translations.suspendUser}: {userName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="suspensionType">{translations.suspensionType}</Label>
            <Select value={suspensionType} onValueChange={(value: 'temporary' | 'permanent') => setSuspensionType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temporary">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {translations.temporary}
                  </div>
                </SelectItem>
                <SelectItem value="permanent">
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4" />
                    {translations.permanent}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {suspensionType === 'temporary' && (
            <div>
              <Label htmlFor="duration">{translations.duration}</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(translations.durations).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>{translations.reason}</Label>
            <Tabs defaultValue="ar" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ar" className="mt-4">
                <Label htmlFor="reasonAr">{translations.reasonInArabic}</Label>
                <Textarea
                  id="reasonAr"
                  value={reasonAr}
                  onChange={(e) => setReasonAr(e.target.value)}
                  placeholder="اكتب سبب الحظر بالعربية..."
                  className="min-h-[80px] mt-2"
                />
              </TabsContent>
              
              <TabsContent value="en" className="mt-4">
                <Label htmlFor="reasonEn">{translations.reasonInEnglish}</Label>
                <Textarea
                  id="reasonEn"
                  value={reasonEn}
                  onChange={(e) => setReasonEn(e.target.value)}
                  placeholder="Enter suspension reason in English..."
                  className="min-h-[80px] mt-2"
                />
              </TabsContent>
              
              <TabsContent value="tr" className="mt-4">
                <Label htmlFor="reasonTr">{translations.reasonInTurkish}</Label>
                <Textarea
                  id="reasonTr"
                  value={reasonTr}
                  onChange={(e) => setReasonTr(e.target.value)}
                  placeholder="Askıya alma nedenini Türkçe girin..."
                  className="min-h-[80px] mt-2"
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {translations.cancel}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSuspend}
              disabled={loading || !hasReason}
            >
              {loading ? translations.suspending : translations.confirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuspensionDialog;
