import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { RefreshCw, Clock, AlertTriangle } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTable from "./UsersTable";
import PendingApprovals from "./PendingApprovals";
import EnhancedUserManagement from "./EnhancedUserManagement";

const UserManagement = () => {
  return <EnhancedUserManagement />;
};

export default UserManagement;
