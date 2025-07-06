
import { useState } from "react";
import { useContactSubjects } from "@/hooks/useContactSubjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialForm = { name_ar: "", name_en: "", name_tr: "" };

export default function ContactSubjectsManagement() {
  const { currentLanguage } = useLanguage();
  const { data: subjects, isLoading, refetch } = useContactSubjects();
  const { toast } = useToast();

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const t = (key: string) => {
    // Temporary translation function
    if (currentLanguage === "ar") {
      if (key === "add") return "إضافة";
      if (key === "save") return "حفظ";
      if (key === "cancel") return "إلغاء";
      if (key === "edit") return "تعديل";
      if (key === "delete") return "حذف";
      if (key === "actions") return "الإجراءات";
      if (key === "active") return "نشط";
      if (key === "inactive") return "غير نشط";
      if (key === "arabic") return "بالعربية";
      if (key === "english") return "بالإنجليزية";
      if (key === "turkish") return "بالتركية";
      if (key === "contactSubjects") return "مواضيع التواصل";
      if (key === "newSubject") return "إضافة موضوع جديد";
    }
    if (currentLanguage === "tr") {
      if (key === "add") return "Ekle";
      if (key === "save") return "Kaydet";
      if (key === "cancel") return "İptal";
      if (key === "edit") return "Düzenle";
      if (key === "delete") return "Sil";
      if (key === "actions") return "İşlemler";
      if (key === "active") return "Aktif";
      if (key === "inactive") return "Pasif";
      if (key === "arabic") return "Arapça";
      if (key === "english") return "İngilizce";
      if (key === "turkish") return "Türkçe";
      if (key === "contactSubjects") return "İletişim Konuları";
      if (key === "newSubject") return "Yeni Konu Ekle";
    }
    // Default to English
    if (key === "add") return "Add";
    if (key === "save") return "Save";
    if (key === "cancel") return "Cancel";
    if (key === "edit") return "Edit";
    if (key === "delete") return "Delete";
    if (key === "actions") return "Actions";
    if (key === "active") return "Active";
    if (key === "inactive") return "Inactive";
    if (key === "arabic") return "Arabic";
    if (key === "english") return "English";
    if (key === "turkish") return "Turkish";
    if (key === "contactSubjects") return "Contact Subjects";
    if (key === "newSubject") return "Add New Subject";
    return key;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (subject: any) => {
    setEditingId(subject.id);
    setForm({
      name_ar: subject.name_ar,
      name_en: subject.name_en,
      name_tr: subject.name_tr,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from("contact_subjects")
          .update({ ...form })
          .eq("id", editingId);
        if (error) throw error;
        toast({
          title: t("save"),
          description: t("edit") + " " + t("contactSubjects") + " " + t("active").toLowerCase(),
        });
      } else {
        // Insert
        const { error } = await supabase
          .from("contact_subjects")
          .insert([{ ...form, is_active: true }]);
        if (error) throw error;
        toast({
          title: t("add"),
          description: t("contactSubjects") + " " + t("active").toLowerCase(),
        });
      }
      setForm(initialForm);
      setEditingId(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("contact_subjects")
        .update({ is_active: false })
        .eq("id", id);
      if (error) throw error;
      toast({
        title: t("delete"),
        description: t("contactSubjects") + " " + t("inactive").toLowerCase(),
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Delete failed",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t("contactSubjects")}</h2>
      {/* Add or Edit Form */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end mb-4">
        <Input
          name="name_ar"
          value={form.name_ar}
          onChange={handleInputChange}
          placeholder={t("arabic")}
          className="md:w-[215px]"
        />
        <Input
          name="name_en"
          value={form.name_en}
          onChange={handleInputChange}
          placeholder={t("english")}
          className="md:w-[215px]"
        />
        <Input
          name="name_tr"
          value={form.name_tr}
          onChange={handleInputChange}
          placeholder={t("turkish")}
          className="md:w-[215px]"
        />
        <Button
          onClick={handleSave}
          disabled={saving || (!form.name_ar && !form.name_en && !form.name_tr)}
          className="mt-2 md:mt-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? t("save") : t("add")}
        </Button>
        {editingId && (
          <Button variant="outline" onClick={handleCancel} className="mt-2 md:mt-0">{t("cancel")}</Button>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("arabic")}</TableHead>
              <TableHead>{t("english")}</TableHead>
              <TableHead>{t("turkish")}</TableHead>
              <TableHead>{t("active")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Loader2 className="w-5 h-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {subjects && subjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">{t("noData") || "No data"}</TableCell>
              </TableRow>
            )}
            {subjects && subjects.map((subject: any) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name_ar}</TableCell>
                <TableCell>{subject.name_en}</TableCell>
                <TableCell>{subject.name_tr}</TableCell>
                <TableCell>
                  <Badge variant={subject.is_active ? "default" : "secondary"}>
                    {subject.is_active ? t("active") : t("inactive")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(subject)}>
                      <Edit className="w-4 h-4" /> {t("edit")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(subject.id)}
                      disabled={deletingId === subject.id}
                      className="text-red-600"
                    >
                      {deletingId === subject.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      {t("delete")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
