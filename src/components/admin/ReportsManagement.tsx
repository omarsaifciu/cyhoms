import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Users, Home, Eye, MessageSquare, RefreshCw, ExternalLink, User, MapPin, Euro, Bed, Bath, Square } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';

const ReportsManagement = () => {
  const { currentLanguage } = useLanguage();
  const { fetchPropertyReports, fetchUserReports, updateReportStatus, loading } = useReports();
  const [propertyReports, setPropertyReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsRefreshing(true);
    console.log('Loading reports...');
    
    const [propertyData, userData] = await Promise.all([
      fetchPropertyReports(),
      fetchUserReports()
    ]);
    
    console.log('Property reports data:', propertyData);
    console.log('User reports data:', userData);
    
    setPropertyReports(propertyData.data || []);
    setUserReports(userData.data || []);
    setIsRefreshing(false);
  };

  const handleStatusUpdate = async (reportId: string, isUserReport = false) => {
    if (!newStatus) return;

    const result = await updateReportStatus(reportId, newStatus, adminNotes, isUserReport);
    if (result.success) {
      loadReports();
      setSelectedReport(null);
      setAdminNotes('');
      setNewStatus('');
      alert(currentLanguage === 'ar' ? 'تم تحديث حالة البلاغ بنجاح' : 'Report status updated successfully');
    } else {
      alert('حدث خطأ أثناء تحديث البلاغ');
    }
  };

  const handleUserClick = (username: string) => {
    if (username) {
      window.open(`/user/${username}`, '_blank');
    }
  };

  const handlePropertyClick = (propertyId: string) => {
    if (propertyId) {
      window.open(`/property/${propertyId}`, '_blank');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'destructive',
      reviewed: 'secondary',
      resolved: 'default',
      dismissed: 'outline'
    };

    const labels = {
      pending: currentLanguage === 'ar' ? 'معلق' : 'Pending',
      reviewed: currentLanguage === 'ar' ? 'تمت المراجعة' : 'Reviewed',
      resolved: currentLanguage === 'ar' ? 'تم الحل' : 'Resolved',
      dismissed: currentLanguage === 'ar' ? 'مرفوض' : 'Dismissed'
    };

    return (
      <Badge variant={variants[status] as any}>
        {labels[status]}
      </Badge>
    );
  };

  const getReportTypeLabel = (type: string) => {
    const propertyTypes = {
      inappropriate_content: currentLanguage === 'ar' ? 'محتوى غير مناسب' : 'Inappropriate Content',
      false_information: currentLanguage === 'ar' ? 'معلومات خاطئة' : 'False Information',
      spam: currentLanguage === 'ar' ? 'رسائل مزعجة' : 'Spam',
      fraud: currentLanguage === 'ar' ? 'احتيال' : 'Fraud',
      duplicate: currentLanguage === 'ar' ? 'إعلان مكرر' : 'Duplicate Listing',
      other: currentLanguage === 'ar' ? 'أخرى' : 'Other'
    };

    const userTypes = {
      inappropriate_behavior: currentLanguage === 'ar' ? 'سلوك غير مناسب' : 'Inappropriate Behavior',
      fake_listings: currentLanguage === 'ar' ? 'إعلانات وهمية' : 'Fake Listings',
      scam: currentLanguage === 'ar' ? 'نصب واحتيال' : 'Scam',
      harassment: currentLanguage === 'ar' ? 'مضايقة' : 'Harassment',
      fraud: currentLanguage === 'ar' ? 'احتيال' : 'Fraud',
      other: currentLanguage === 'ar' ? 'أخرى' : 'Other'
    };

    return propertyTypes[type] || userTypes[type] || type;
  };

  const getAvatarFallback = (name: string) => {
    if (name) {
      return name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const formatPrice = (price: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const pendingPropertyReports = propertyReports.filter(report => report.status === 'pending');
  const pendingUserReports = userReports.filter(report => report.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentLanguage === 'ar' ? 'إدارة البلاغات' : 'Reports Management'}
          </h2>
          <p className="text-gray-600">
            {currentLanguage === 'ar' ? 'مراجعة ومعالجة البلاغات المرسلة' : 'Review and manage submitted reports'}
          </p>
        </div>
        <Button 
          onClick={loadReports} 
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {currentLanguage === 'ar' ? 'بلاغات العقارات المعلقة' : 'Pending Property Reports'}
              </p>
              <p className="text-2xl font-bold">{pendingPropertyReports.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {currentLanguage === 'ar' ? 'بلاغات المستخدمين المعلقة' : 'Pending User Reports'}
              </p>
              <p className="text-2xl font-bold">{pendingUserReports.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Home className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {currentLanguage === 'ar' ? 'إجمالي بلاغات العقارات' : 'Total Property Reports'}
              </p>
              <p className="text-2xl font-bold">{propertyReports.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {currentLanguage === 'ar' ? 'إجمالي بلاغات المستخدمين' : 'Total User Reports'}
              </p>
              <p className="text-2xl font-bold">{userReports.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="property-reports" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="property-reports">
            <Home className="w-4 h-4 mr-2" />
            {currentLanguage === 'ar' ? 'بلاغات العقارات' : 'Property Reports'}
            {pendingPropertyReports.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingPropertyReports.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="user-reports">
            <Users className="w-4 h-4 mr-2" />
            {currentLanguage === 'ar' ? 'بلاغات المستخدمين' : 'User Reports'}
            {pendingUserReports.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingUserReports.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="property-reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentLanguage === 'ar' ? 'بلاغات العقارات' : 'Property Reports'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'ar' ? 'قائمة بجميع البلاغات المرسلة للعقارات' : 'List of all property reports submitted'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-2 text-gray-500">
                    {currentLanguage === 'ar' ? 'جارٍ تحميل البلاغات...' : 'Loading reports...'}
                  </p>
                </div>
              ) : propertyReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>{currentLanguage === 'ar' ? 'لا توجد بلاغات للعقارات' : 'No property reports found'}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {propertyReports.map((report) => (
                    <Card key={report.id} className="border-l-4 border-l-red-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {getReportTypeLabel(report.report_type)}
                            </Badge>
                            {getStatusBadge(report.status)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(report.created_at).toLocaleDateString(
                              currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
                              { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>
                        </div>

                        {/* Reporter Info */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {currentLanguage === 'ar' ? 'المُبلِغ:' : 'Reporter:'}
                          </h4>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={report.profiles?.avatar_url} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {getAvatarFallback(report.profiles?.full_name || report.profiles?.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {report.profiles?.full_name || report.profiles?.username || 'Unknown User'}
                                </span>
                                {report.profiles?.username && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUserClick(report.profiles.username)}
                                    className="p-1 h-auto text-blue-600 hover:text-blue-800"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              {report.profiles?.username && (
                                <p className="text-sm text-gray-500">@{report.profiles.username}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Reported Property */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            {currentLanguage === 'ar' ? 'العقار المُبلغ عنه:' : 'Reported Property:'}
                          </h4>
                          {report.properties ? (
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="flex gap-4">
                                {/* Property Image */}
                                <div className="flex-shrink-0">
                                  <img
                                    src={report.properties.cover_image || report.properties.images?.[0] || "/placeholder.svg"}
                                    alt={report.properties.title}
                                    className="w-24 h-24 object-cover rounded-lg border border-orange-300"
                                  />
                                </div>
                                
                                {/* Property Details */}
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-semibold text-gray-900 text-lg">
                                      {report.properties.title}
                                    </h5>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handlePropertyClick(report.property_id)}
                                      className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-100"
                                    >
                                      <Eye className="w-4 h-4" />
                                      {currentLanguage === 'ar' ? 'عرض العقار' : 'View Property'}
                                    </Button>
                                  </div>
                                  
                                  {/* Property Info */}
                                  <div className="space-y-2">
                                    {report.properties.city && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{report.properties.city}{report.properties.district && `, ${report.properties.district}`}</span>
                                      </div>
                                    )}
                                    
                                    {report.properties.price && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Euro className="w-4 h-4" />
                                        <span className="font-medium text-green-600">
                                          {formatPrice(report.properties.price, report.properties.currency)}
                                        </span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      {report.properties.bedrooms && (
                                        <div className="flex items-center gap-1">
                                          <Bed className="w-4 h-4" />
                                          <span>{report.properties.bedrooms}</span>
                                        </div>
                                      )}
                                      {report.properties.bathrooms && (
                                        <div className="flex items-center gap-1">
                                          <Bath className="w-4 h-4" />
                                          <span>{report.properties.bathrooms}</span>
                                        </div>
                                      )}
                                      {report.properties.area && (
                                        <div className="flex items-center gap-1">
                                          <Square className="w-4 h-4" />
                                          <span>{report.properties.area}m²</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {currentLanguage === 'ar' ? 'عقار محذوف أو غير متاح' : 'Deleted or Unavailable Property'}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    ID: {report.property_id}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <Separator className="my-4" />

                        {/* Report Details */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {currentLanguage === 'ar' ? 'تفاصيل البلاغ:' : 'Report Details:'}
                          </h4>
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-3 border">
                            {report.reason}
                          </p>
                        </div>

                        {/* Admin Actions */}
                        {report.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-4 border-t">
                            <Select value={newStatus} onValueChange={setNewStatus}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder={currentLanguage === 'ar' ? 'تغيير الحالة' : 'Change Status'} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="reviewed">{currentLanguage === 'ar' ? 'تمت المراجعة' : 'Reviewed'}</SelectItem>
                                <SelectItem value="resolved">{currentLanguage === 'ar' ? 'تم الحل' : 'Resolved'}</SelectItem>
                                <SelectItem value="dismissed">{currentLanguage === 'ar' ? 'مرفوض' : 'Dismissed'}</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => handleStatusUpdate(report.id, false)}
                              disabled={!newStatus}
                              size="sm"
                            >
                              {currentLanguage === 'ar' ? 'تحديث' : 'Update'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentLanguage === 'ar' ? 'بلاغات المستخدمين' : 'User Reports'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'ar' ? 'قائمة بجميع البلاغات المرسلة ضد المستخدمين' : 'List of all user reports submitted'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-2 text-gray-500">
                    {currentLanguage === 'ar' ? 'جارٍ تحميل البلاغات...' : 'Loading reports...'}
                  </p>
                </div>
              ) : userReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>{currentLanguage === 'ar' ? 'لا توجد بلاغات للمستخدمين' : 'No user reports found'}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userReports.map((report) => (
                    <Card key={report.id} className="border-l-4 border-l-red-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {getReportTypeLabel(report.report_type)}
                            </Badge>
                            {getStatusBadge(report.status)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(report.created_at).toLocaleDateString(
                              currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
                              { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>
                        </div>

                        {/* Reporter Info */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {currentLanguage === 'ar' ? 'المُبلِغ:' : 'Reporter:'}
                          </h4>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={report.reporter_profile?.avatar_url} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {getAvatarFallback(report.reporter_profile?.full_name || report.reporter_profile?.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {report.reporter_profile?.full_name || report.reporter_profile?.username || 'Unknown User'}
                                </span>
                                {report.reporter_profile?.username && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUserClick(report.reporter_profile.username)}
                                    className="p-1 h-auto text-blue-600 hover:text-blue-800"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              {report.reporter_profile?.username && (
                                <p className="text-sm text-gray-500">@{report.reporter_profile.username}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Reported User */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {currentLanguage === 'ar' ? 'المستخدم المُبلغ عنه:' : 'Reported User:'}
                          </h4>
                          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={report.reported_profile?.avatar_url} />
                              <AvatarFallback className="bg-red-100 text-red-600">
                                {getAvatarFallback(report.reported_profile?.full_name || report.reported_profile?.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {report.reported_profile?.full_name || report.reported_profile?.username || 'Unknown User'}
                                </span>
                                {report.reported_profile?.username && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUserClick(report.reported_profile.username)}
                                    className="p-1 h-auto text-red-600 hover:text-red-800"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              {report.reported_profile?.username && (
                                <p className="text-sm text-gray-500">@{report.reported_profile.username}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Report Details */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {currentLanguage === 'ar' ? 'تفاصيل البلاغ:' : 'Report Details:'}
                          </h4>
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-3 border">
                            {report.reason}
                          </p>
                        </div>

                        {/* Admin Actions */}
                        {report.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-4 border-t">
                            <Select value={newStatus} onValueChange={setNewStatus}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder={currentLanguage === 'ar' ? 'تغيير الحالة' : 'Change Status'} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="reviewed">{currentLanguage === 'ar' ? 'تمت المراجعة' : 'Reviewed'}</SelectItem>
                                <SelectItem value="resolved">{currentLanguage === 'ar' ? 'تم الحل' : 'Resolved'}</SelectItem>
                                <SelectItem value="dismissed">{currentLanguage === 'ar' ? 'مرفوض' : 'Dismissed'}</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => handleStatusUpdate(report.id, true)}
                              disabled={!newStatus}
                              size="sm"
                            >
                              {currentLanguage === 'ar' ? 'تحديث' : 'Update'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;
