
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteSettings } from "@/types/siteSettings";
import { Textarea } from "@/components/ui/textarea";
import SiteAssetUploader from "./SiteAssetUploader";

interface NotFoundPageSettingsProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  t: (key: string) => string;
}

const NotFoundPageSettings = ({ settings, updateSetting, t }: NotFoundPageSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات صفحة 404 (غير موجود)</CardTitle>
        <CardDescription>
          تحكم في محتوى صفحة الخطأ 404 التي تظهر للزوار عند محاولة الوصول إلى رابط غير موجود.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ar">العربية</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="tr">Türkçe</TabsTrigger>
          </TabsList>
          <TabsContent value="ar" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="notFoundTitleAr">عنوان الصفحة (عربي)</Label>
              <Input
                id="notFoundTitleAr"
                value={settings.notFoundTitleAr || ""}
                onChange={(e) => updateSetting("notFoundTitleAr", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notFoundDescAr">وصف قصير (عربي)</Label>
              <Textarea
                id="notFoundDescAr"
                value={settings.notFoundDescAr || ""}
                onChange={(e) => updateSetting("notFoundDescAr", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notFoundButtonAr">نص زر العودة (عربي)</Label>
              <Input
                id="notFoundButtonAr"
                value={settings.notFoundButtonAr || ""}
                onChange={(e) => updateSetting("notFoundButtonAr", e.target.value)}
              />
            </div>
            <SiteAssetUploader
              label="صورة الصفحة (عربي)"
              value={settings.notFoundSvgAr}
              onValueChange={(url) => updateSetting("notFoundSvgAr", url === null ? "" : url)}
              bucketName="site-assets"
              filePathPrefix="404-ar-"
              t={t}
            />
          </TabsContent>
          <TabsContent value="en" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="notFoundTitleEn">Page Title (English)</Label>
              <Input
                id="notFoundTitleEn"
                value={settings.notFoundTitleEn || ""}
                onChange={(e) => updateSetting("notFoundTitleEn", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notFoundDescEn">Short Description (English)</Label>
              <Textarea
                id="notFoundDescEn"
                value={settings.notFoundDescEn || ""}
                onChange={(e) => updateSetting("notFoundDescEn", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notFoundButtonEn">Button Text (English)</Label>
              <Input
                id="notFoundButtonEn"
                value={settings.notFoundButtonEn || ""}
                onChange={(e) => updateSetting("notFoundButtonEn", e.target.value)}
              />
            </div>
            <SiteAssetUploader
              label="Page Image (English)"
              value={settings.notFoundSvgEn}
              onValueChange={(url) => updateSetting("notFoundSvgEn", url === null ? "" : url)}
              bucketName="site-assets"
              filePathPrefix="404-en-"
              t={t}
            />
          </TabsContent>
          <TabsContent value="tr" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="notFoundTitleTr">Sayfa Başlığı (Türkçe)</Label>
              <Input
                id="notFoundTitleTr"
                value={settings.notFoundTitleTr || ""}
                onChange={(e) => updateSetting("notFoundTitleTr", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notFoundDescTr">Kısa Açıklama (Türkçe)</Label>
              <Textarea
                id="notFoundDescTr"
                value={settings.notFoundDescTr || ""}
                onChange={(e) => updateSetting("notFoundDescTr", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notFoundButtonTr">Düğme Metni (Türkçe)</Label>
              <Input
                id="notFoundButtonTr"
                value={settings.notFoundButtonTr || ""}
                onChange={(e) => updateSetting("notFoundButtonTr", e.target.value)}
              />
            </div>
            <SiteAssetUploader
              label="Sayfa Resmi (Türkçe)"
              value={settings.notFoundSvgTr}
              onValueChange={(url) => updateSetting("notFoundSvgTr", url === null ? "" : url)}
              bucketName="site-assets"
              filePathPrefix="404-tr-"
              t={t}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotFoundPageSettings;
