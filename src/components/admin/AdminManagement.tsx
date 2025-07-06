
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Mail, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminRecord {
  id: string;
  admin_email: string;
  created_at: string;
  is_active: boolean;
}

const AdminManagement = () => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_management' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type the data properly for our AdminRecord interface
      const typedData: AdminRecord[] = (data || []).map((item: any) => ({
        id: item.id,
        admin_email: item.admin_email,
        created_at: item.created_at,
        is_active: item.is_active
      }));
      
      setAdmins(typedData);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحميل قائمة الأدمن' : 'Failed to load admin list',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email address',
        variant: 'destructive'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdminEmail)) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setAdding(true);

    try {
      const { error } = await supabase
        .from('admin_management' as any)
        .insert([{
          admin_email: newAdminEmail.toLowerCase().trim(),
          created_by: user?.id
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
            description: currentLanguage === 'ar' ? 'هذا البريد الإلكتروني مضاف مسبقاً' : 'This email is already added',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم إضافة الأدمن بنجاح' : 'Admin added successfully'
      });

      setNewAdminEmail("");
      fetchAdmins();
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في إضافة الأدمن' : 'Failed to add admin'),
        variant: 'destructive'
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!confirm(currentLanguage === 'ar' ? `هل أنت متأكد من حذف ${email}؟` : `Are you sure you want to delete ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_management' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم حذف الأدمن بنجاح' : 'Admin deleted successfully'
      });

      fetchAdmins();
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في حذف الأدمن' : 'Failed to delete admin'),
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_management' as any)
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث حالة الأدمن' : 'Admin status updated'
      });

      fetchAdmins();
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحديث الحالة' : 'Failed to update status'),
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {currentLanguage === 'ar' ? 'إدارة الأدمن' : 'Admin Management'}
        </h2>
        <p className="text-gray-600">
          {currentLanguage === 'ar' ? 'إضافة وإدارة حسابات الأدمن' : 'Add and manage admin accounts'}
        </p>
      </div>

      {/* Add Admin Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {currentLanguage === 'ar' ? 'إضافة أدمن جديد' : 'Add New Admin'}
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' 
              ? 'أدخل البريد الإلكتروني لحساب مسجل مسبقاً لتعيينه كأدمن'
              : 'Enter the email address of an existing account to assign admin privileges'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="admin-email">
                {currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder={currentLanguage === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAdmin()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddAdmin} disabled={adding}>
                {adding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {currentLanguage === 'ar' ? 'جارٍ الإضافة...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {currentLanguage === 'ar' ? 'إضافة' : 'Add'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admins List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {currentLanguage === 'ar' ? 'قائمة الأدمن' : 'Admin List'}
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' ? 'جميع حسابات الأدمن المضافة' : 'All added admin accounts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'تاريخ الإضافة' : 'Added Date'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead>{currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {admin.admin_email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.created_at).toLocaleDateString(
                        currentLanguage === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        admin.is_active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.is_active 
                          ? (currentLanguage === 'ar' ? 'نشط' : 'Active')
                          : (currentLanguage === 'ar' ? 'معطل' : 'Inactive')
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleActive(admin.id, admin.is_active)}
                        >
                          {admin.is_active 
                            ? (currentLanguage === 'ar' ? 'تعطيل' : 'Deactivate')
                            : (currentLanguage === 'ar' ? 'تفعيل' : 'Activate')
                          }
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteAdmin(admin.id, admin.admin_email)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {admins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      {currentLanguage === 'ar' ? 'لا توجد حسابات أدمن مضافة' : 'No admin accounts added'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;
