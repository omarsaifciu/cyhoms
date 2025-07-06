import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteSettings } from "@/types/siteSettings";
import TeamMemberManager from "./TeamMemberManager";

interface AboutPageSettingsProps {
    settings: Partial<SiteSettings>;
    updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
    t: (key: string) => string;
    currentLanguage: 'ar' | 'en' | 'tr';
}

const AboutPageSettings = ({ settings, updateSetting, t, currentLanguage }: AboutPageSettingsProps) => {

    const renderMultiLangInput = (key: keyof SiteSettings, label: string) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
            <Label className="md:col-span-3 text-base font-semibold">{label}</Label>
            <div>
                <Label htmlFor={`${key}En`}>English</Label>
                <Input
                    id={`${key}En`}
                    value={settings[`${key}En` as keyof SiteSettings] as string || ''}
                    onChange={(e) => updateSetting(`${key}En` as keyof SiteSettings, e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor={`${key}Ar`}>العربية</Label>
                <Input
                    id={`${key}Ar`}
                    value={settings[`${key}Ar` as keyof SiteSettings] as string || ''}
                    onChange={(e) => updateSetting(`${key}Ar` as keyof SiteSettings, e.target.value)}
                    dir="rtl"
                />
            </div>
            <div>
                <Label htmlFor={`${key}Tr`}>Türkçe</Label>
                <Input
                    id={`${key}Tr`}
                    value={settings[`${key}Tr` as keyof SiteSettings] as string || ''}
                    onChange={(e) => updateSetting(`${key}Tr` as keyof SiteSettings, e.target.value)}
                />
            </div>
        </div>
    );
    
    const renderMultiLangTextarea = (key: keyof SiteSettings, label: string) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
            <Label className="md:col-span-3 text-base font-semibold">{label}</Label>
            <div>
                <Label htmlFor={`${key}En`}>English</Label>
                <Textarea
                    id={`${key}En`}
                    value={settings[`${key}En` as keyof SiteSettings] as string || ''}
                    onChange={(e) => updateSetting(`${key}En` as keyof SiteSettings, e.target.value)}
                    rows={4}
                />
            </div>
            <div>
                <Label htmlFor={`${key}Ar`}>العربية</Label>
                <Textarea
                    id={`${key}Ar`}
                    value={settings[`${key}Ar` as keyof SiteSettings] as string || ''}
                    onChange={(e) => updateSetting(`${key}Ar` as keyof SiteSettings, e.target.value)}
                    dir="rtl"
                    rows={4}
                />
            </div>
            <div>
                <Label htmlFor={`${key}Tr`}>Türkçe</Label>
                <Textarea
                    id={`${key}Tr`}
                    value={settings[`${key}Tr` as keyof SiteSettings] as string || ''}
                    onChange={(e) => updateSetting(`${key}Tr` as keyof SiteSettings, e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );


    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('siteSettings.aboutPageTitle')}</CardTitle>
                <CardDescription>{t('siteSettings.aboutPageDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {renderMultiLangInput('aboutPageTitle' as any, t('siteSettings.about.pageTitle'))}
                {renderMultiLangTextarea('aboutPageSubtitle' as any, t('siteSettings.about.pageSubtitle'))}
                {renderMultiLangInput('aboutMissionTitle' as any, t('siteSettings.about.missionTitle'))}
                {renderMultiLangTextarea('aboutMissionText' as any, t('siteSettings.about.missionText'))}
                {renderMultiLangInput('aboutVisionTitle' as any, t('siteSettings.about.visionTitle'))}
                {renderMultiLangTextarea('aboutVisionText' as any, t('siteSettings.about.visionText'))}
                {renderMultiLangInput('aboutTeamTitle' as any, t('siteSettings.about.teamTitle'))}
                {renderMultiLangTextarea('aboutTeamText' as any, t('siteSettings.about.teamText'))}

                <TeamMemberManager
                    value={settings.aboutTeamMembers || JSON.stringify([
                        { "id": "1", "name_ar": "أحمد علي", "name_en": "Ahmed Ali", "name_tr": "Ahmet Ali", "role_ar": "المدير التنفيذي", "role_en": "CEO", "role_tr": "CEO", "avatar": "/placeholder.svg" },
                        { "id": "2", "name_ar": "فاطمة خان", "name_en": "Fatima Khan", "name_tr": "Fatma Han", "role_ar": "مديرة التسويق", "role_en": "Marketing Director", "role_tr": "Pazarlama Direktörü", "avatar": "/placeholder.svg" },
                        { "id": "3", "name_ar": "جان سميث", "name_en": "John Smith", "name_tr": "John Smith", "role_ar": "كبير المطورين", "role_en": "Lead Developer", "role_tr": "Baş Geliştirici", "avatar": "/placeholder.svg" }
                    ])}
                    onChange={(value) => updateSetting('aboutTeamMembers', value)}
                    t={t}
                />
            </CardContent>
        </Card>
    );
}
export default AboutPageSettings;
