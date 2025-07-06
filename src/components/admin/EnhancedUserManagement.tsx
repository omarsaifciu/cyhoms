import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Search, Grid3X3, List, Download, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTable from "./UsersTable";
import UserCard from "./UserCard";
import PendingApprovals from "./PendingApprovals";
import { useUserManagement } from "@/hooks/useUserManagement";

const EnhancedUserManagement = () => {
  const { currentLanguage } = useLanguage();
  const { users, pendingUsers, loading, fetchUsers, toggleApproval, toggleVerification, rejectUser, updateUserType, deleteUser, approveAllPending, toggleSuspension } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.whatsapp_number?.includes(searchTerm);
        
      const matchesUserType = userTypeFilter === "all" || user.user_type === userTypeFilter;
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "approved" && user.is_approved) ||
        (statusFilter === "pending" && !user.is_approved) ||
        (statusFilter === "verified" && user.is_verified) ||
        (statusFilter === "suspended" && user.is_suspended) ||
        (statusFilter === "trial_active" && user.is_trial_active);
        
      return matchesSearch && matchesUserType && matchesStatus;
    });
  }, [users, searchTerm, userTypeFilter, statusFilter]);

  const handleOpenProfile = (username: string) => {
    window.open(`/user/${username}`, '_blank');
  };

  const handleExportUsers = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'WhatsApp', 'Type', 'Status', 'Verified', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.full_name || 'Not specified',
        user.email,
        user.phone || '',
        user.whatsapp_number || '',
        user.user_type,
        user.is_approved ? 'Approved' : 'Pending',
        user.is_verified ? 'Yes' : 'No',
        new Date(user.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentLanguage === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-muted-foreground">
            {currentLanguage === 'ar' 
              ? 'مراجعة وإدارة حسابات المستخدمين والطلبات المعلقة' 
              : 'Review and manage user accounts and pending requests'
            }
          </p>
        </div>
        <Button onClick={fetchUsers} variant="outline">
          {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            {currentLanguage === 'ar' ? 'الطلبات المعلقة' : 'Pending Requests'}
            {pendingUsers.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingUsers.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            {currentLanguage === 'ar' ? 'جميع المستخدمين' : 'All Users'}
            <Badge variant="outline" className="ml-1">
              {users.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingApprovals
            pendingUsers={pendingUsers}
            onApprove={toggleApproval}
            onReject={rejectUser}
            onApproveAll={approveAllPending}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <CardTitle>
                    {currentLanguage === 'ar' ? 'قائمة المستخدمين' : 'Users List'}
                    <span className="text-sm font-normal text-gray-500 mr-2">
                      ({filteredUsers.length} {currentLanguage === 'ar' ? 'مستخدم' : 'users'})
                    </span>
                  </CardTitle>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  
                  {/* Export Button */}
                  <Button
                    onClick={handleExportUsers}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {currentLanguage === 'ar' ? 'تصدير' : 'Export'}
                  </Button>
                </div>
              </div>
              
              <CardDescription>
                {currentLanguage === 'ar' 
                  ? 'إدارة جميع المستخدمين المسجلين في الموقع' 
                  : 'Manage all registered users on the platform'
                }
              </CardDescription>

              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={currentLanguage === 'ar' ? 'البحث بالاسم أو البريد الإلكتروني أو الهاتف أو الواتساب...' : 'Search by name, email, phone, or WhatsApp...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder={currentLanguage === 'ar' ? 'نوع المستخدم' : 'User Type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{currentLanguage === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                      <SelectItem value="client">{currentLanguage === 'ar' ? 'عميل' : 'Client'}</SelectItem>
                      <SelectItem value="agent">{currentLanguage === 'ar' ? 'وسيط' : 'Agent'}</SelectItem>
                      <SelectItem value="support">{currentLanguage === 'ar' ? 'دعم فني' : 'Support'}</SelectItem>
                      <SelectItem value="property_owner">{currentLanguage === 'ar' ? 'مالك عقار' : 'Property Owner'}</SelectItem>
                      <SelectItem value="real_estate_office">{currentLanguage === 'ar' ? 'مكتب عقارات' : 'Real Estate Office'}</SelectItem>
                      <SelectItem value="partner_and_site_owner">{currentLanguage === 'ar' ? 'شريك ومالك الموقع' : 'Partner & Site Owner'}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={currentLanguage === 'ar' ? 'الحالة' : 'Status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{currentLanguage === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                      <SelectItem value="approved">{currentLanguage === 'ar' ? 'موافق عليه' : 'Approved'}</SelectItem>
                      <SelectItem value="pending">{currentLanguage === 'ar' ? 'في انتظار الموافقة' : 'Pending'}</SelectItem>
                      <SelectItem value="verified">{currentLanguage === 'ar' ? 'موثق' : 'Verified'}</SelectItem>
                      <SelectItem value="suspended">{currentLanguage === 'ar' ? 'موقوف' : 'Suspended'}</SelectItem>
                      <SelectItem value="trial_active">{currentLanguage === 'ar' ? 'تجربة مجانية نشطة' : 'Trial Active'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-2 text-gray-500">
                    {currentLanguage === 'ar' ? 'جارٍ تحميل المستخدمين...' : 'Loading users...'}
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm || userTypeFilter !== "all" || statusFilter !== "all" ? 
                      (currentLanguage === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found') :
                      (currentLanguage === 'ar' ? 'لا توجد مستخدمين' : 'No users found')
                    }
                  </p>
                </div>
              ) : viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onToggleApproval={toggleApproval}
                      onToggleVerification={toggleVerification}
                      onUpdateUserType={updateUserType}
                      onDeleteUser={deleteUser}
                      onTrialUpdated={fetchUsers}
                      onToggleSuspension={toggleSuspension}
                      onOpenProfile={handleOpenProfile}
                    />
                  ))}
                </div>
              ) : (
                <UsersTable
                  users={filteredUsers}
                  onToggleApproval={toggleApproval}
                  onToggleVerification={toggleVerification}
                  onUpdateUserType={updateUserType}
                  onDeleteUser={deleteUser}
                  onTrialUpdated={fetchUsers}
                  onToggleSuspension={toggleSuspension}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedUserManagement;
