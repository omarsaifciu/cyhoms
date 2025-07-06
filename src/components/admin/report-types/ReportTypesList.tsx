
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useReportTypes } from "@/hooks/useReportTypes";
import { useToast } from "@/hooks/use-toast";

interface ReportType {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  description_ar?: string;
  description_en?: string;
  description_tr?: string;
  is_active: boolean;
  display_order: number;
}

interface ReportTypesListProps {
  reportTypes: ReportType[];
  category: 'property' | 'user';
  loading: boolean;
  onEdit: (reportType: ReportType) => void;
  onRefresh: () => void;
}

const ReportTypesList = ({ reportTypes, category, loading, onEdit, onRefresh }: ReportTypesListProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { 
    updatePropertyReportType, 
    updateUserReportType, 
    deletePropertyReportType, 
    deleteUserReportType 
  } = useReportTypes();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleStatus = async (reportType: ReportType) => {
    const updateFunction = category === 'property' ? updatePropertyReportType : updateUserReportType;
    const result = await updateFunction(reportType.id, { is_active: !reportType.is_active });
    
    if (result.success) {
      toast({
        title: currentLanguage === 'ar' ? 'تم التحديث' : 'Updated',
        description: currentLanguage === 'ar' ? 'تم تحديث حالة النوع بنجاح' : 'Report type status updated successfully',
      });
      onRefresh();
    } else {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ أثناء التحديث' : 'An error occurred while updating',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const deleteFunction = category === 'property' ? deletePropertyReportType : deleteUserReportType;
    const result = await deleteFunction(id);
    
    if (result.success) {
      toast({
        title: currentLanguage === 'ar' ? 'تم الحذف' : 'Deleted',
        description: currentLanguage === 'ar' ? 'تم حذف النوع بنجاح' : 'Report type deleted successfully',
      });
      onRefresh();
    } else {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting',
        variant: 'destructive',
      });
    }
    setDeletingId(null);
  };

  const getLocalizedName = (reportType: ReportType) => {
    if (currentLanguage === 'ar') return reportType.name_ar;
    if (currentLanguage === 'tr') return reportType.name_tr;
    return reportType.name_en;
  };

  const getLocalizedDescription = (reportType: ReportType) => {
    if (currentLanguage === 'ar') return reportType.description_ar;
    if (currentLanguage === 'tr') return reportType.description_tr;
    return reportType.description_en;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">
          {currentLanguage === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reportTypes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {currentLanguage === 'ar' ? 'لا توجد أنواع بلاغات' : 'No report types found'}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {currentLanguage === 'ar' ? 'الترتيب' : currentLanguage === 'tr' ? 'Sıra' : 'Order'}
              </TableHead>
              <TableHead>
                {currentLanguage === 'ar' ? 'الاسم' : currentLanguage === 'tr' ? 'İsim' : 'Name'}
              </TableHead>
              <TableHead>
                {currentLanguage === 'ar' ? 'الوصف' : currentLanguage === 'tr' ? 'Açıklama' : 'Description'}
              </TableHead>
              <TableHead>
                {currentLanguage === 'ar' ? 'الحالة' : currentLanguage === 'tr' ? 'Durum' : 'Status'}
              </TableHead>
              <TableHead>
                {currentLanguage === 'ar' ? 'الإجراءات' : currentLanguage === 'tr' ? 'İşlemler' : 'Actions'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportTypes.map((reportType) => (
              <TableRow key={reportType.id}>
                <TableCell>{reportType.display_order}</TableCell>
                <TableCell className="font-medium">
                  {getLocalizedName(reportType)}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {getLocalizedDescription(reportType) || '-'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={reportType.is_active ? "default" : "secondary"}
                    className="flex items-center gap-1 w-fit"
                  >
                    {reportType.is_active ? (
                      <>
                        <Eye className="w-3 h-3" />
                        {currentLanguage === 'ar' ? 'نشط' : currentLanguage === 'tr' ? 'Aktif' : 'Active'}
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        {currentLanguage === 'ar' ? 'غير نشط' : currentLanguage === 'tr' ? 'Pasif' : 'Inactive'}
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(reportType)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(reportType)}
                    >
                      {reportType.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deletingId === reportType.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {currentLanguage === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {currentLanguage === 'ar' ? 
                              'هل أنت متأكد من حذف هذا النوع؟ لا يمكن التراجع عن هذا الإجراء.' :
                              'Are you sure you want to delete this type? This action cannot be undone.'
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(reportType.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {currentLanguage === 'ar' ? 'حذف' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ReportTypesList;
