
import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Upload, Loader2, UserPlus } from 'lucide-react';
import { TeamMember } from '@/types/siteSettings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeamMemberManagerProps {
    value: string;
    onChange: (value: string) => void;
    t: (key: string) => string;
}

const TeamMemberManager = ({ value, onChange, t }: TeamMemberManagerProps) => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [uploadingAvatar, setUploadingAvatar] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        try {
            // Handle empty or invalid value
            if (!value || value.trim() === '') {
                setMembers([]);
                return;
            }

            const parsedMembers = JSON.parse(value);

            // Ensure parsedMembers is an array
            if (!Array.isArray(parsedMembers)) {
                console.warn("Team members data is not an array, resetting to empty array");
                setMembers([]);
                return;
            }

            const membersWithIds = parsedMembers.map((m: any) => ({
                id: m.id || crypto.randomUUID(),
                name_ar: m.name_ar || '',
                name_en: m.name_en || '',
                name_tr: m.name_tr || '',
                role_ar: m.role_ar || '',
                role_en: m.role_en || '',
                role_tr: m.role_tr || '',
                avatar: m.avatar || '/placeholder.svg',
            }));
            setMembers(membersWithIds);
        } catch (e) {
            console.error("Failed to parse team members JSON:", e);
            console.error("Value that caused error:", value);
            setMembers([]);
            // Don't show toast error for initial load failures
            if (value && value.trim() !== '' && value !== '[]') {
                toast({
                    title: "Error",
                    description: "Could not load team members. Using default data.",
                    variant: "destructive"
                });
            }
        }
    }, [value, toast]);

    const updateStore = (updatedMembers: TeamMember[]) => {
        onChange(JSON.stringify(updatedMembers));
    };
    
    const handleAddMember = () => {
        const newMember: TeamMember = {
            id: crypto.randomUUID(),
            name_ar: '', name_en: '', name_tr: '',
            role_ar: '', role_en: '', role_tr: '',
            avatar: '/placeholder.svg'
        };
        const updatedMembers = [...members, newMember];
        setMembers(updatedMembers);
        updateStore(updatedMembers);
    };

    const handleUpdateMember = (id: string, field: keyof TeamMember, fieldValue: string) => {
        const updatedMembers = members.map(m => m.id === id ? { ...m, [field]: fieldValue } : m);
        setMembers(updatedMembers);
        updateStore(updatedMembers);
    };

    const handleDeleteMember = (id: string) => {
        const updatedMembers = members.filter(m => m.id !== id);
        setMembers(updatedMembers);
        updateStore(updatedMembers);
    };

    const handleAvatarUpload = async (id: string, file: File) => {
        if (!file) return;
        setUploadingAvatar(id);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `team-avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('property-media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('property-media')
                .getPublicUrl(filePath);

            handleUpdateMember(id, 'avatar', publicUrl);
            toast({ title: t('siteSettings.about.avatarUploadSuccess') });

        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast({ title: t('siteSettings.about.avatarUploadError'), description: error.message, variant: 'destructive' });
        } finally {
            setUploadingAvatar(null);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle>{t('siteSettings.about.teamMembers')}</CardTitle>
                    <CardDescription>{t('siteSettings.about.teamMembersDescription')}</CardDescription>
                </div>
                <Button onClick={handleAddMember} className="w-full md:w-auto">
                    <UserPlus className="mr-2 h-4 w-4" /> {t('siteSettings.about.addMember')}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {members.length === 0 && (
                    <p className="text-center text-gray-500 py-4">{t('siteSettings.about.noMembers')}</p>
                )}
                {members.map(member => (
                    <div key={member.id} className="border p-4 rounded-lg space-y-4 relative bg-gray-50/50">
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-gray-500 hover:bg-red-100 hover:text-red-600" onClick={() => handleDeleteMember(member.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="flex-shrink-0 space-y-2 text-center w-full md:w-auto">
                                <Avatar className="h-24 w-24 mx-auto">
                                    <AvatarImage src={member.avatar} alt={member.name_en} />
                                    <AvatarFallback>{member.name_en?.substring(0, 2) || 'AV'}</AvatarFallback>
                                </Avatar>
                                <input type="file" id={`avatar-upload-${member.id}`} className="hidden" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && handleAvatarUpload(member.id, e.target.files[0])} />
                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <label htmlFor={`avatar-upload-${member.id}`} className="cursor-pointer">
                                        {uploadingAvatar === member.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                        {t('siteSettings.about.uploadAvatar')}
                                    </label>
                                </Button>
                            </div>
                            <div className="flex-grow space-y-4 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Label className="md:col-span-3 font-semibold">{t('siteSettings.about.memberName')}</Label>
                                    <div><Label htmlFor={`name_en_${member.id}`}>English</Label><Input id={`name_en_${member.id}`} value={member.name_en} onChange={(e) => handleUpdateMember(member.id, 'name_en', e.target.value)} /></div>
                                    <div><Label htmlFor={`name_ar_${member.id}`}>العربية</Label><Input id={`name_ar_${member.id}`} value={member.name_ar} dir="rtl" onChange={(e) => handleUpdateMember(member.id, 'name_ar', e.target.value)} /></div>
                                    <div><Label htmlFor={`name_tr_${member.id}`}>Türkçe</Label><Input id={`name_tr_${member.id}`} value={member.name_tr} onChange={(e) => handleUpdateMember(member.id, 'name_tr', e.target.value)} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Label className="md:col-span-3 font-semibold">{t('siteSettings.about.memberRole')}</Label>
                                    <div><Label htmlFor={`role_en_${member.id}`}>English</Label><Input id={`role_en_${member.id}`} value={member.role_en} onChange={(e) => handleUpdateMember(member.id, 'role_en', e.target.value)} /></div>
                                    <div><Label htmlFor={`role_ar_${member.id}`}>العربية</Label><Input id={`role_ar_${member.id}`} value={member.role_ar} dir="rtl" onChange={(e) => handleUpdateMember(member.id, 'role_ar', e.target.value)} /></div>
                                    <div><Label htmlFor={`role_tr_${member.id}`}>Türkçe</Label><Input id={`role_tr_${member.id}`} value={member.role_tr} onChange={(e) => handleUpdateMember(member.id, 'role_tr', e.target.value)} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default TeamMemberManager;
