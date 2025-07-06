
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Trash2, Eye, EyeOff, Edit } from "lucide-react";
import { useTermsManagement } from "@/hooks/useTermsManagement";
import { NewTermsForm, TermsAndConditions } from "@/types/terms";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const TermsManagement = () => {
  const { currentLanguage } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTerm, setEditingTerm] = useState<TermsAndConditions | null>(null);
  const [formData, setFormData] = useState<NewTermsForm>({
    title_ar: '',
    title_en: '',
    title_tr: '',
    content_ar: '',
    content_en: '',
    content_tr: '',
    is_active: false
  });
  
  const {
    terms,
    loading,
    isAdmin,
    submitting,
    user,
    addTerms,
    updateTerms,
    deleteTerms,
    toggleActiveStatus
  } = useTermsManagement();

  const resetForm = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      title_tr: '',
      content_ar: '',
      content_en: '',
      content_tr: '',
      is_active: false
    });
    setShowAddForm(false);
    setEditingTerm(null);
  };

  const handleEdit = (term: TermsAndConditions) => {
    setEditingTerm(term);
    setFormData({
      title_ar: term.title_ar || '',
      title_en: term.title_en || '',
      title_tr: term.title_tr || '',
      content_ar: term.content_ar || '',
      content_en: term.content_en || '',
      content_tr: term.content_tr || '',
      is_active: term.is_active
    });
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    if (editingTerm) {
      success = await updateTerms(editingTerm.id, formData);
    } else {
      success = await addTerms(formData);
    }
    
    if (success) {
      resetForm();
    }
  };

  const getDisplayTitle = (term: any) => {
    if (currentLanguage === 'ar' && term.title_ar) return term.title_ar;
    if (currentLanguage === 'tr' && term.title_tr) return term.title_tr;
    if (currentLanguage === 'en' && term.title_en) return term.title_en;
    return term.title_en || term.title_ar || term.title_tr || 'بدون عنوان';
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          {currentLanguage === 'ar' ? 'يجب تسجيل الدخول للوصول إلى الإدارة' : 'Please login to access admin panel'}
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          {currentLanguage === 'ar' ? 'لا تملك صلاحيات الإدارة' : 'You do not have admin privileges'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentLanguage === 'ar' ? 'إدارة الأحكام والشروط' : 'Terms & Conditions Management'}
          </h2>
          <p className="text-gray-600">
            {currentLanguage === 'ar' ? 'إضافة وتعديل وحذف الأحكام والشروط' : 'Add, edit, and delete terms and conditions'}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {currentLanguage === 'ar' ? 'إضافة أحكام وشروط جديدة' : 'Add New Terms'}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingTerm) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTerm 
                ? (currentLanguage === 'ar' ? 'تعديل الأحكام والشروط' : 'Edit Terms & Conditions')
                : (currentLanguage === 'ar' ? 'إضافة أحكام وشروط جديدة' : 'Add New Terms & Conditions')
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{currentLanguage === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'}</Label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                    placeholder={currentLanguage === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'}
                  />
                </div>
                <div>
                  <Label>{currentLanguage === 'ar' ? 'العنوان بالإنجليزية' : 'Title in English'}</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                    placeholder={currentLanguage === 'ar' ? 'العنوان بالإنجليزية' : 'Title in English'}
                  />
                </div>
                <div>
                  <Label>{currentLanguage === 'ar' ? 'العنوان بالتركية' : 'Title in Turkish'}</Label>
                  <Input
                    value={formData.title_tr}
                    onChange={(e) => setFormData({...formData, title_tr: e.target.value})}
                    placeholder={currentLanguage === 'ar' ? 'العنوان بالتركية' : 'Title in Turkish'}
                  />
                </div>
              </div>

              {/* Contents */}
              <div className="space-y-4">
                <div>
                  <Label>{currentLanguage === 'ar' ? 'المحتوى بالعربية' : 'Content in Arabic'}</Label>
                  <Textarea
                    value={formData.content_ar}
                    onChange={(e) => setFormData({...formData, content_ar: e.target.value})}
                    placeholder={currentLanguage === 'ar' ? 'المحتوى بالعربية' : 'Content in Arabic'}
                    rows={8}
                  />
                </div>
                <div>
                  <Label>{currentLanguage === 'ar' ? 'المحتوى بالإنجليزية' : 'Content in English'}</Label>
                  <Textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData({...formData, content_en: e.target.value})}
                    placeholder={currentLanguage === 'ar' ? 'المحتوى بالإنجليزية' : 'Content in English'}
                    rows={8}
                  />
                </div>
                <div>
                  <Label>{currentLanguage === 'ar' ? 'المحتوى بالتركية' : 'Content in Turkish'}</Label>
                  <Textarea
                    value={formData.content_tr}
                    onChange={(e) => setFormData({...formData, content_tr: e.target.value})}
                    placeholder={currentLanguage === 'ar' ? 'المحتوى بالتركية' : 'Content in Turkish'}
                    rows={8}
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">
                  {currentLanguage === 'ar' ? 'تفعيل هذه الأحكام والشروط' : 'Activate these terms'}
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...') : 
                   (editingTerm ? 
                    (currentLanguage === 'ar' ? 'تحديث' : 'Update') :
                    (currentLanguage === 'ar' ? 'حفظ' : 'Save')
                   )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Terms List */}
      <Card>
        <CardHeader>
          <CardTitle>{currentLanguage === 'ar' ? 'قائمة الأحكام والشروط' : 'Terms & Conditions List'}</CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' ? 'جميع الأحكام والشروط المضافة في النظام' : 'All terms and conditions in the system'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {terms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {currentLanguage === 'ar' ? 'لا توجد أحكام وشروط' : 'No terms and conditions found'}
                  </p>
                </div>
              ) : (
                terms.map((term) => (
                  <div key={term.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {getDisplayTitle(term)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>
                            {currentLanguage === 'ar' ? 'تم الإنشاء: ' : 'Created: '}
                            {new Date(term.created_at).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            term.is_active 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {term.is_active ? 
                              (currentLanguage === 'ar' ? 'نشط' : 'Active') : 
                              (currentLanguage === 'ar' ? 'غير نشط' : 'Inactive')
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(term)}
                          title={currentLanguage === 'ar' ? 'تعديل' : 'Edit'}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleActiveStatus(term.id, term.is_active)}
                          title={term.is_active ? 
                            (currentLanguage === 'ar' ? 'إلغاء التفعيل' : 'Deactivate') : 
                            (currentLanguage === 'ar' ? 'تفعيل' : 'Activate')
                          }
                        >
                          {term.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteTerms(term.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsManagement;
