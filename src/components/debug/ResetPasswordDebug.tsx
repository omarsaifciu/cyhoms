import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ResetPasswordDebug = () => {
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [sessionInfo, setSessionInfo] = useState<any>({});

  useEffect(() => {
    const gatherDebugInfo = async () => {
      // Get URL parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = searchParams;
      
      const info = {
        fullUrl: window.location.href,
        hash: window.location.hash,
        search: window.location.search,
        hashParams: Object.fromEntries(hashParams.entries()),
        queryParams: Object.fromEntries(queryParams.entries()),
        tokens: {
          accessToken: hashParams.get('access_token') || queryParams.get('access_token'),
          refreshToken: hashParams.get('refresh_token') || queryParams.get('refresh_token'),
          type: hashParams.get('type') || queryParams.get('type'),
        }
      };
      
      setDebugInfo(info);
      
      // Check current session
      try {
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        const { data: user, error: userError } = await supabase.auth.getUser();
        
        setSessionInfo({
          session: session.session ? 'Active' : 'None',
          sessionError: sessionError?.message,
          user: user.user ? user.user.email : 'None',
          userError: userError?.message,
          isAuthenticated: !!user.user
        });
      } catch (error) {
        setSessionInfo({ error: error.message });
      }
    };

    gatherDebugInfo();
  }, [searchParams]);

  const testSetSession = async () => {
    const { accessToken, refreshToken } = debugInfo.tokens || {};
    
    if (!accessToken || !refreshToken) {
      alert('No tokens available to test');
      return;
    }

    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      
      console.log('Set session result:', { data, error });
      alert(`Set session result: ${error ? 'Error: ' + error.message : 'Success'}`);
    } catch (error) {
      console.error('Set session error:', error);
      alert('Set session error: ' + error.message);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password Debug Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-bold">URL Information:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-bold">Session Information:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>
          
          <div className="space-x-2">
            <Button onClick={testSetSession} variant="outline">
              Test Set Session
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordDebug;
