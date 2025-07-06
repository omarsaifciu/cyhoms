
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('ProtectedAdminRoute: Checking admin status for:', user.email);
        
        // التحقق من الأدمن الأساسي أولاً
        if (user.email === 'omar122540@gmail.com') {
          console.log('ProtectedAdminRoute: Primary admin detected');
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // التحقق من جدول admin_management باستخدام type assertion
        const { data, error } = await supabase
          .from('admin_management' as any)
          .select('*')
          .eq('admin_email', user.email)
          .eq('is_active', true)
          .single();

        console.log('ProtectedAdminRoute: Admin management query result:', { data, error });

        if (error && error.code !== 'PGRST116') {
          console.error('ProtectedAdminRoute: Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!data;
          console.log('ProtectedAdminRoute: Admin status determined:', adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('ProtectedAdminRoute: Error in admin check:', error);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('ProtectedAdminRoute: Redirecting to login. User:', !!user, 'IsAdmin:', isAdmin);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
