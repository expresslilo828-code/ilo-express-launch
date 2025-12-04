import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DiagnosticPage = () => {
  const [diagnostics, setDiagnostics] = useState<any>({
    envVars: {},
    session: null,
    adminCheck: null,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results: any = {
      timestamp: new Date().toISOString(),
      envVars: {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "❌ MISSING",
        VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "✅ SET" : "❌ MISSING",
      },
      session: null,
      adminCheck: null,
      localStorage: {},
    };

    // Check session
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      results.session = session ? {
        user_id: session.user.id,
        email: session.user.email,
        expires_at: session.expires_at,
      } : "No session found";
      
      if (error) {
        results.session = `Error: ${error.message}`;
      }

      // Check admin status if session exists
      if (session) {
        try {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .eq('is_active', true)
            .maybeSingle();

          results.adminCheck = adminData ? {
            id: adminData.id,
            email: adminData.email,
            full_name: adminData.full_name,
            is_active: adminData.is_active,
          } : "No admin record found";

          if (adminError) {
            results.adminCheck = `Error: ${adminError.message}`;
          }
        } catch (err: any) {
          results.adminCheck = `Exception: ${err.message}`;
        }
      }
    } catch (err: any) {
      results.session = `Exception: ${err.message}`;
    }

    // Check localStorage
    try {
      const storageKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || key.includes('supabase')
      );
      results.localStorage = storageKeys.length > 0 
        ? `Found ${storageKeys.length} Supabase keys` 
        : "No Supabase keys found";
    } catch (err: any) {
      results.localStorage = `Cannot access localStorage: ${err.message}`;
    }

    setDiagnostics(results);
  };

  const getStatusBadge = (value: any) => {
    if (typeof value === 'string') {
      if (value.includes('✅') || value.toLowerCase().includes('found')) {
        return <Badge variant="default" className="bg-green-500">OK</Badge>;
      }
      if (value.includes('❌') || value.toLowerCase().includes('missing') || value.toLowerCase().includes('no ')) {
        return <Badge variant="destructive">ERROR</Badge>;
      }
      if (value.toLowerCase().includes('error') || value.toLowerCase().includes('exception')) {
        return <Badge variant="destructive">ERROR</Badge>;
      }
    }
    if (value && typeof value === 'object') {
      return <Badge variant="default" className="bg-green-500">OK</Badge>;
    }
    return <Badge variant="secondary">UNKNOWN</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-lilo-beige/10 to-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Diagnostic Report</CardTitle>
            <CardDescription>
              System status check for Lilo Express Admin
              <br />
              <small>Last updated: {new Date(diagnostics.timestamp).toLocaleString()}</small>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Environment Variables */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                Environment Variables
                {getStatusBadge(diagnostics.envVars.VITE_SUPABASE_URL)}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span>VITE_SUPABASE_URL:</span>
                  <span className="font-semibold">{diagnostics.envVars.VITE_SUPABASE_URL}</span>
                </div>
                <div className="flex justify-between">
                  <span>VITE_SUPABASE_PUBLISHABLE_KEY:</span>
                  <span className="font-semibold">{diagnostics.envVars.VITE_SUPABASE_PUBLISHABLE_KEY}</span>
                </div>
              </div>
            </div>

            {/* Session Status */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                Session Status
                {getStatusBadge(diagnostics.session)}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(diagnostics.session, null, 2)}
                </pre>
              </div>
            </div>

            {/* Admin Check */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                Admin Status
                {getStatusBadge(diagnostics.adminCheck)}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(diagnostics.adminCheck, null, 2)}
                </pre>
              </div>
            </div>

            {/* LocalStorage Status */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                LocalStorage Status
                {getStatusBadge(diagnostics.localStorage)}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                {diagnostics.localStorage}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button onClick={runDiagnostics} variant="default">
                🔄 Refresh Diagnostics
              </Button>
              <Button onClick={() => window.location.href = '/login'} variant="outline">
                🔑 Go to Login
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                🏠 Go Home
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Troubleshooting Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>If environment variables show ❌ MISSING, they are not configured in Vercel</li>
                <li>If session is "No session found", you need to log in first</li>
                <li>If admin check shows "No admin record found", your user is not in the admin_users table</li>
                <li>If localStorage shows "No Supabase keys", clear your browser cache and try again</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiagnosticPage;
