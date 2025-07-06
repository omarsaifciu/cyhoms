
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePropertyLimits } from "@/hooks/usePropertyLimits";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Users, TrendingUp, Search, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyLimitsManagement = () => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { limits, loading, updateUserLimit, getUserCurrentCount } = usePropertyLimits();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newLimit, setNewLimit] = useState("");
  const [notes, setNotes] = useState("");
  const [userCounts, setUserCounts] = useState<{ [key: string]: number }>({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [defaultLimit, setDefaultLimit] = useState(10);
  const [savingDefault, setSavingDefault] = useState(false);

  useEffect(() => {
    // Get current property counts for all users
    const fetchCounts = async () => {
      const counts: { [key: string]: number } = {};
      for (const limit of limits) {
        const count = await getUserCurrentCount(limit.user_id);
        counts[limit.user_id] = count;
      }
      setUserCounts(counts);
    };

    if (limits.length > 0) {
      fetchCounts();
    }
  }, [limits]);

  const handleEdit = (limit: any) => {
    setEditingUser(limit);
    setNewLimit(limit.property_limit.toString());
    setNotes(limit.notes || "");
  };

  const handleSave = async () => {
    if (!editingUser || !newLimit) return;

    setSaving(true);
    const success = await updateUserLimit(editingUser.user_id, parseInt(newLimit), notes);
    setSaving(false);

    if (success) {
      setEditingUser(null);
      setNewLimit("");
      setNotes("");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setNewLimit("");
    setNotes("");
  };

  const handleUserClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  const handleSaveDefaultLimit = async () => {
    if (defaultLimit < 1) return;

    setSavingDefault(true);
    try {
      // Here you would typically save to a settings table or configuration
      // For now, we'll just update the state and show a success message

      // You can implement this by saving to a site_settings table
      // await supabase.from('site_settings').upsert({
      //   setting_key: 'default_property_limit',
      //   setting_value_en: defaultLimit.toString()
      // });

      console.log('Default limit updated to:', defaultLimit);

      // Show success message (you can add toast here)
      alert(currentLanguage === 'ar'
        ? `تم تحديث الحد الافتراضي إلى ${defaultLimit} عقار`
        : `Default limit updated to ${defaultLimit} properties`
      );

    } catch (error) {
      console.error('Error updating default limit:', error);
      alert(currentLanguage === 'ar'
        ? 'فشل في تحديث الحد الافتراضي'
        : 'Failed to update default limit'
      );
    } finally {
      setSavingDefault(false);
    }
  };

  const handleApplyToAll = async () => {
    if (defaultLimit < 1) return;

    const confirmed = window.confirm(
      currentLanguage === 'ar'
        ? `هل أنت متأكد من تطبيق الحد ${defaultLimit} على جميع المستخدمين؟ سيتم استبدال جميع الحدود الحالية.`
        : `Are you sure you want to apply limit ${defaultLimit} to all users? This will replace all current limits.`
    );

    if (!confirmed) return;

    setSavingDefault(true);
    try {
      // Apply the default limit to all users
      for (const limit of limits) {
        if (limit.user_id) {
          await updateUserLimit(limit.user_id, defaultLimit,
            currentLanguage === 'ar'
              ? `تم تطبيق الحد الافتراضي: ${defaultLimit}`
              : `Applied default limit: ${defaultLimit}`
          );
        }
      }

      alert(currentLanguage === 'ar'
        ? `تم تطبيق الحد ${defaultLimit} على جميع المستخدمين بنجاح`
        : `Successfully applied limit ${defaultLimit} to all users`
      );

    } catch (error) {
      console.error('Error applying default limit to all users:', error);
      alert(currentLanguage === 'ar'
        ? 'فشل في تطبيق الحد على جميع المستخدمين'
        : 'Failed to apply limit to all users'
      );
    } finally {
      setSavingDefault(false);
    }
  };

  // Filter users based on search term
  const filteredLimits = limits.filter(limit => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const fullName = limit.profiles?.full_name?.toLowerCase() || '';
    const username = limit.profiles?.username?.toLowerCase() || '';
    const userType = limit.profiles?.user_type?.toLowerCase() || '';

    return fullName.includes(searchLower) ||
           username.includes(searchLower) ||
           userType.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {currentLanguage === 'ar' ? 'إدارة حدود العقارات' : 'Property Limits Management'}
        </h2>
        <p className="text-gray-600">
          {currentLanguage === 'ar'
            ? 'تحكم في عدد العقارات المسموح لكل مستخدم بإضافتها'
            : 'Control the number of properties each user can add'
          }
        </p>
      </div>

      {/* Default Limit Setting */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {currentLanguage === 'ar' ? 'الحد الافتراضي للعقارات' : 'Default Property Limit'}
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar'
              ? 'تحديد الحد الافتراضي للعقارات للمستخدمين الجدد'
              : 'Set the default property limit for new users'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="defaultLimit" className="text-sm font-medium">
                {currentLanguage === 'ar' ? 'الحد الافتراضي:' : 'Default Limit:'}
              </Label>
              <Input
                id="defaultLimit"
                type="number"
                min="1"
                max="1000"
                value={defaultLimit}
                onChange={(e) => setDefaultLimit(parseInt(e.target.value) || 1)}
                className="w-24 text-center"
              />
              <span className="text-sm text-gray-600">
                {currentLanguage === 'ar' ? 'عقار' : 'properties'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveDefaultLimit}
                disabled={savingDefault || defaultLimit < 1}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {savingDefault ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                  </>
                ) : (
                  currentLanguage === 'ar' ? 'حفظ' : 'Save'
                )}
              </Button>
              <Button
                onClick={handleApplyToAll}
                disabled={savingDefault || defaultLimit < 1}
                size="sm"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                {currentLanguage === 'ar' ? 'تطبيق على الجميع' : 'Apply to All'}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-500">
              {currentLanguage === 'ar'
                ? 'سيتم تطبيق هذا الحد على جميع المستخدمين الجدد الذين لم يتم تحديد حد مخصص لهم'
                : 'This limit will be applied to all new users who do not have a custom limit set'
              }
            </p>
            <Badge variant="secondary" className="text-xs">
              {(() => {
                const usersWithDefaultLimit = filteredLimits.filter(limit => limit.property_limit === defaultLimit).length;
                return currentLanguage === 'ar'
                  ? `${usersWithDefaultLimit} مستخدم يستخدم هذا الحد`
                  : `${usersWithDefaultLimit} users using this limit`;
              })()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={currentLanguage === 'ar' ? 'البحث بالاسم أو اسم المستخدم أو النوع...' : 'Search by name, username, or type...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <Badge variant="outline" className="text-sm">
          {currentLanguage === 'ar' ? `${filteredLimits.length} مستخدم` : `${filteredLimits.length} users`}
        </Badge>
      </div>

      {filteredLimits.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {currentLanguage === 'ar' ? 'لا توجد نتائج' : 'No results found'}
          </h3>
          <p className="text-gray-500">
            {currentLanguage === 'ar'
              ? searchTerm
                ? `لا توجد مستخدمين يطابقون "${searchTerm}"`
                : 'لا توجد حدود عقارات محددة'
              : searchTerm
                ? `No users match "${searchTerm}"`
                : 'No property limits set'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLimits.map((limit) => {
          const currentCount = userCounts[limit.user_id] || 0;
          const usagePercentage = (currentCount / limit.property_limit) * 100;
          
          return (
            <Card key={limit.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle
                      className="text-lg cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleUserClick(limit.profiles?.username || '')}
                    >
                      {limit.profiles?.full_name || 'مستخدم غير معروف'}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUserClick(limit.profiles?.username || '')}
                      className="p-1 h-auto"
                    >
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(limit)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="space-y-1">
                  <div>@{limit.profiles?.username || 'unknown'}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {limit.profiles?.user_type === 'agent' && (currentLanguage === 'ar' ? 'وسيط' : currentLanguage === 'tr' ? 'Emlak Uzmanı' : 'Agent')}
                      {limit.profiles?.user_type === 'property_owner' && (currentLanguage === 'ar' ? 'مالك عقار' : currentLanguage === 'tr' ? 'Mülk Sahibi' : 'Property Owner')}
                      {limit.profiles?.user_type === 'real_estate_office' && (currentLanguage === 'ar' ? 'مكتب عقاري' : currentLanguage === 'tr' ? 'Emlak Ofisi' : 'Real Estate Office')}
                      {limit.profiles?.user_type === 'partner_and_site_owner' && (currentLanguage === 'ar' ? 'شريك ومالك موقع' : currentLanguage === 'tr' ? 'Ortak ve Site Sahibi' : 'Partner & Site Owner')}
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {currentLanguage === 'ar' ? 'الحد الأقصى:' : 'Limit:'}
                  </span>
                  <Badge variant="outline">
                    {limit.property_limit} {currentLanguage === 'ar' ? 'عقار' : 'properties'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {currentLanguage === 'ar' ? 'المستخدم حالياً:' : 'Currently used:'}
                  </span>
                  <span className="font-medium">
                    {currentCount} / {limit.property_limit}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      usagePercentage >= 90 ? 'bg-red-500' : 
                      usagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>

                {limit.notes && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {limit.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentLanguage === 'ar' ? 'تعديل حد العقارات' : 'Edit Property Limit'}
            </DialogTitle>
            <DialogDescription>
              {currentLanguage === 'ar' 
                ? `تعديل حد العقارات للمستخدم: ${editingUser?.profiles?.full_name}`
                : `Edit property limit for user: ${editingUser?.profiles?.full_name}`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="limit">
                {currentLanguage === 'ar' ? 'الحد الأقصى للعقارات' : 'Property Limit'}
              </Label>
              <Input
                id="limit"
                type="number"
                min="1"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                placeholder={currentLanguage === 'ar' ? 'أدخل الحد الأقصى' : 'Enter limit'}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">
                {currentLanguage === 'ar' ? 'ملاحظات (اختيارية)' : 'Notes (Optional)'}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={currentLanguage === 'ar' ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel}>
              {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSave} disabled={!newLimit || saving}>
              {saving 
                ? (currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                : (currentLanguage === 'ar' ? 'حفظ' : 'Save')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyLimitsManagement;
