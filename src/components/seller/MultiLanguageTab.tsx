
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

interface MultiLanguageTabProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const MultiLanguageTab = ({ formData, setFormData }: MultiLanguageTabProps) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-right">{t('arabic')}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title_ar">{t('titleInArabicRequired')}</Label>
            <Input 
              id="title_ar" 
              value={formData.title_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
              placeholder="أدخل عنوان العقار بالعربية"
              dir="rtl"
            />
          </div>
          <div>
            <Label htmlFor="description_ar">{t('descriptionInArabic')}</Label>
            <Textarea 
              id="description_ar" 
              value={formData.description_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
              placeholder="أدخل وصف العقار بالعربية..."
              rows={3}
              dir="rtl"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">{t('english')}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title_en">{t('titleInEnglishRequired')}</Label>
            <Input 
              id="title_en" 
              value={formData.title_en}
              onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
              placeholder="Enter property title in English"
            />
          </div>
          <div>
            <Label htmlFor="description_en">{t('descriptionInEnglish')}</Label>
            <Textarea 
              id="description_en" 
              value={formData.description_en}
              onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
              placeholder="Enter property description in English..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">{t('turkish')}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title_tr">{t('titleInTurkishRequired')}</Label>
            <Input 
              id="title_tr" 
              value={formData.title_tr}
              onChange={(e) => setFormData(prev => ({ ...prev, title_tr: e.target.value }))}
              placeholder="Türkçe mülk başlığını girin"
            />
          </div>
          <div>
            <Label htmlFor="description_tr">{t('descriptionInTurkish')}</Label>
            <Textarea 
              id="description_tr" 
              value={formData.description_tr}
              onChange={(e) => setFormData(prev => ({ ...prev, description_tr: e.target.value }))}
              placeholder="Türkçe mülk açıklamasını girin..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiLanguageTab;
