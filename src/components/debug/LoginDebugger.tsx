import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const LoginDebugger = () => {
  const [testUsername, setTestUsername] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testRPCFunction = async () => {
    if (!testUsername.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم المستخدم للاختبار',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Testing RPC function with username:', testUsername);
      
      const { data, error } = await supabase.rpc('get_user_email_by_username', {
        username_input: testUsername.trim()
      });

      const result = {
        username: testUsername,
        rpc_data: data,
        rpc_error: error,
        timestamp: new Date().toISOString()
      };

      console.log('RPC Test Result:', result);
      setResults(result);

      if (error) {
        toast({
          title: 'خطأ في RPC',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'نجح الاختبار',
          description: `تم العثور على الإيميل: ${data || 'لا يوجد'}`,
        });
      }
    } catch (err) {
      console.error('RPC Test Error:', err);
      setResults({
        username: testUsername,
        error: err,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectLogin = async () => {
    if (!testEmail.trim() || !testPassword.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال الإيميل وكلمة المرور',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Testing direct login with email:', testEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail.trim().toLowerCase(),
        password: testPassword
      });

      const result = {
        email: testEmail,
        auth_data: data,
        auth_error: error,
        timestamp: new Date().toISOString()
      };

      console.log('Direct Login Test Result:', result);
      setResults(result);

      if (error) {
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'نجح تسجيل الدخول',
          description: `مرحباً ${data.user?.email}`,
        });
        
        // Sign out immediately for testing
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Direct Login Test Error:', err);
      setResults({
        email: testEmail,
        error: err,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      console.log('Testing Supabase connection...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, user_type')
        .limit(5);

      const result = {
        connection_test: true,
        profiles_data: data,
        profiles_error: error,
        timestamp: new Date().toISOString()
      };

      console.log('Connection Test Result:', result);
      setResults(result);

      if (error) {
        toast({
          title: 'خطأ في الاتصال',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'نجح الاتصال',
          description: `تم العثور على ${data?.length || 0} مستخدمين`,
        });
      }
    } catch (err) {
      console.error('Connection Test Error:', err);
      setResults({
        connection_test: true,
        error: err,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>مُشخص مشاكل تسجيل الدخول - Login Issue Debugger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Test RPC Function */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">اختبار دالة RPC</h3>
            <div className="flex gap-3">
              <Input
                placeholder="اسم المستخدم للاختبار"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                className="flex-1"
              />
              <Button onClick={testRPCFunction} disabled={loading}>
                اختبار RPC
              </Button>
            </div>
          </div>

          {/* Test Direct Login */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">اختبار تسجيل الدخول المباشر</h3>
            <div className="flex gap-3">
              <Input
                placeholder="الإيميل"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="كلمة المرور"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="flex-1"
              />
              <Button onClick={testDirectLogin} disabled={loading}>
                اختبار الدخول
              </Button>
            </div>
          </div>

          {/* Test Connection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">اختبار الاتصال بقاعدة البيانات</h3>
            <Button onClick={testSupabaseConnection} disabled={loading}>
              اختبار الاتصال
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">النتائج</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center p-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">جاري الاختبار...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginDebugger;
