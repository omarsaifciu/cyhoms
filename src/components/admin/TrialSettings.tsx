import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTrialSettings } from "@/hooks/useTrialSettings";
import { useTrialUsers } from "@/hooks/useTrialUsers";
import { useState } from "react";
import { RefreshCw, Clock, User, Mail, Phone } from "lucide-react";
import TrialCountdown from "./TrialCountdown";
import TrialActions from "./TrialActions";

const TrialSettings = () => {
  const { currentLanguage } = useLanguage();
  const { settings, loading, updateSettings, refetch } = useTrialSettings();
  const { trialUsers, loading: usersLoading, refetch: refetchUsers } = useTrialUsers();
  const [trialDays, setTrialDays] = useState(settings?.trial_days || 7);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (enabled: boolean) => {
    console.log('Trial toggle changed to:', enabled);
    setIsUpdating(true);
    try {
      const success = await updateSettings({ is_trial_enabled: enabled });
      if (success) {
        console.log('Trial enabled status updated successfully');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDaysUpdate = async () => {
    setIsUpdating(true);
    try {
      const success = await updateSettings({ trial_days: trialDays });
      if (success) {
        console.log('Trial days updated successfully');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefreshAll = () => {
    refetch();
    refetchUsers();
  };

  const handleTrialEnded = () => {
    refetchUsers();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'seller': return currentLanguage === 'ar' ? 'بائع' : 'Seller';
      case 'property_owner': return currentLanguage === 'ar' ? 'مالك عقار' : 'Property Owner';
      case 'real_estate_office': return currentLanguage === 'ar' ? 'مكتب عقارات' : 'Real Estate Office';
      default: return type;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-500">
              {currentLanguage === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* إعدادات التجربة المجانية */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {currentLanguage === 'ar' ? 'إعدادات فترة التجربة المجانية' : 'Free Trial Settings'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'ar' 
                  ? 'تحكم في إعدادات فترة التجربة المجانية للمستخدمين الجدد'
                  : 'Control free trial settings for new users'
                }
              </CardDescription>
            </div>
            <Button
              onClick={handleRefreshAll}
              variant="outline"
              size="sm"
              disabled={isUpdating}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
              {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">
                {currentLanguage === 'ar' ? 'تفعيل فترة التجربة المجانية' : 'Enable Free Trial'}
              </Label>
              <p className="text-sm text-gray-500">
                {currentLanguage === 'ar' 
                  ? 'عند التفعيل، سيحصل المستخدمون الجدد على فترة تجربة مجانية'
                  : 'When enabled, new users will get a free trial period'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isUpdating && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
              <Switch
                checked={settings?.is_trial_enabled || false}
                onCheckedChange={handleToggle}
                disabled={isUpdating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trialDays">
              {currentLanguage === 'ar' ? 'عدد أيام التجربة المجانية' : 'Trial Days Count'}
            </Label>
            <div className="flex gap-2">
              <Input
                id="trialDays"
                type="number"
                min="1"
                max="30"
                value={trialDays}
                onChange={(e) => setTrialDays(parseInt(e.target.value) || 7)}
                className="w-32"
                disabled={isUpdating}
              />
              <Button 
                onClick={handleDaysUpdate} 
                variant="outline"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : null}
                {currentLanguage === 'ar' ? 'تحديث' : 'Update'}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              {currentLanguage === 'ar' 
                ? 'العدد الحالي: ' + (settings?.trial_days || 7) + ' أيام'
                : 'Current: ' + (settings?.trial_days || 7) + ' days'
              }
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              {currentLanguage === 'ar' ? 'كيف تعمل فترة التجربة المجانية؟' : 'How does the free trial work?'}
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                {currentLanguage === 'ar' 
                  ? '• عند تسجيل البائعين ومالكي العقارات ومكاتب العقارات الجدد، يحصلون على فترة تجربة مجانية'
                  : '• When new sellers, property owners and real estate offices register, they get a free trial period'
                }
              </li>
              <li>
                {currentLanguage === 'ar' 
                  ? '• خلال فترة التجربة، يظهر رقمهم الشخصي في معلومات التواصل'
                  : '• During the trial, their personal contact information is displayed'
                }
              </li>
              <li>
                {currentLanguage === 'ar' 
                  ? '• بعد انتهاء فترة التجربة، يظهر رقم الموقع الأساسي'
                  : '• After the trial expires, the main site contact information is displayed'
                }
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المستخدمين في فترة التجربة المجانية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            {currentLanguage === 'ar' ? 'المستخدمون في فترة التجربة المجانية' : 'Users in Free Trial'}
            <Badge variant="secondary">{trialUsers.length}</Badge>
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' 
              ? 'قائمة بالمستخدمين الذين يستخدمون فترة التجربة المجانية حاليًا مع عداد مفصل للوقت المتبقي'
              : 'List of users currently using the free trial period with detailed countdown timer'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-500">
                {currentLanguage === 'ar' ? 'جارٍ تحميل المستخدمين...' : 'Loading users...'}
              </p>
            </div>
          ) : trialUsers.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {currentLanguage === 'ar' ? 'لا يوجد مستخدمون في فترة التجربة المجانية حاليًا' : 'No users currently in free trial'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{currentLanguage === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                    <TableHead>{currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                    <TableHead>{currentLanguage === 'ar' ? 'الهاتف' : 'Phone'}</TableHead>
                    <TableHead>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</TableHead>
                    <TableHead>{currentLanguage === 'ar' ? 'تاريخ البداية' : 'Start Date'}</TableHead>
                    <TableHead className="text-center">{currentLanguage === 'ar' ? 'الوقت المتبقي' : 'Time Remaining'}</TableHead>
                    <TableHead className="text-center">{currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {user.full_name || (currentLanguage === 'ar' ? 'غير محدد' : 'Not specified')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.phone || (currentLanguage === 'ar' ? 'غير محدد' : 'Not specified')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getUserTypeLabel(user.user_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(user.trial_started_at || user.created_at)}
                      </TableCell>
                      <TableCell className="text-center">
                        <TrialCountdown
                          trialStartedAt={user.trial_started_at || user.created_at}
                          trialDays={settings?.trial_days || 7}
                          userId={user.id}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <TrialActions
                          userId={user.id}
                          userName={user.full_name || user.email}
                          onTrialEnded={handleTrialEnded}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialSettings;
