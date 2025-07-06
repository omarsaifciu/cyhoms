
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReports } from '@/hooks/useReports';
import { useReportTypes } from '@/hooks/useReportTypes';
import { useToast } from '@/hooks/use-toast';

interface ReportUserDialogProps {
  userId: string;
  userName?: string;
  children?: React.ReactNode;
}

const ReportUserDialog = ({ userId, userName, children }: ReportUserDialogProps) => {
  const { currentLanguage } = useLanguage();
  const { reportUser, loading } = useReports();
  const { userReportTypes } = useReportTypes();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType || !reason.trim()) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    const result = await reportUser(userId, {
      report_type: reportType,
      reason: reason.trim()
    });

    if (result.success) {
      toast({
        title: currentLanguage === 'ar' ? 'تم الإرسال' : 'Submitted',
        description: currentLanguage === 'ar' ? 'تم إرسال البلاغ بنجاح' : 'Report submitted successfully',
      });
      setOpen(false);
      setReportType('');
      setReason('');
    } else {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: result.error || (currentLanguage === 'ar' ? 'حدث خطأ' : 'An error occurred'),
        variant: 'destructive',
      });
    }
  };

  const getLocalizedName = (type: any) => {
    if (currentLanguage === 'ar') return type.name_ar;
    if (currentLanguage === 'tr') return type.name_tr;
    return type.name_en;
  };

  const getLocalizedDescription = (type: any) => {
    if (currentLanguage === 'ar') return type.description_ar;
    if (currentLanguage === 'tr') return type.description_tr;
    return type.description_en;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Flag className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'إبلاغ' : 'Report'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            {currentLanguage === 'ar' ? 'إبلاغ عن المستخدم' : 'Report User'}
            {userName && (
              <span className="text-sm font-normal text-gray-600">
                ({userName})
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {currentLanguage === 'ar' 
              ? 'يرجى اختيار سبب البلاغ وتقديم التفاصيل' 
              : 'Please select a reason and provide details for your report'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {currentLanguage === 'ar' ? 'نوع البلاغ' : 'Report Type'}
            </Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  currentLanguage === 'ar' ? 'اختر نوع البلاغ' :
                  currentLanguage === 'tr' ? 'Rapor türünü seçin' :
                  'Select report type'
                } />
              </SelectTrigger>
              <SelectContent>
                {userReportTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{getLocalizedName(type)}</span>
                      {getLocalizedDescription(type) && (
                        <span className="text-xs text-muted-foreground">
                          {getLocalizedDescription(type)}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              {currentLanguage === 'ar' ? 'تفاصيل البلاغ' : 'Report Details'}
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={currentLanguage === 'ar' ? 'يرجى شرح سبب البلاغ بالتفصيل...' : 'Please explain your report in detail...'}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 
                (currentLanguage === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...') :
                (currentLanguage === 'ar' ? 'إرسال البلاغ' : 'Submit Report')
              }
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserDialog;
