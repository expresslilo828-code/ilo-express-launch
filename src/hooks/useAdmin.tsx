import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

type AdminUser = Tables<'admin_users'>;

export interface AdminAuthState {
  user: User | null;
  adminUser: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const useAdmin = (): AdminAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (userId: string) => {
    try {
      // Method 1: Check using Secure RPC function (Bypasses RLS)
      const { data: isRpcAdmin, error: rpcError } = await supabase
        .rpc('is_admin', { user_id: userId });

      if (rpcError) {
        console.error("Admin check failed:", rpcError.message);
      }

      // Method 2: Get Admin Details (Subject to RLS)
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error("Admin data fetch failed:", adminError.message);
      }

      // Determine final status
      const isUserAdmin = isRpcAdmin === true || !!adminData;

      if (isUserAdmin) {
        setIsAdmin(true);
        setAdminUser(adminData as AdminUser | null);

        // Update last login if we have the record
        if (adminData) {
          supabase
            .from('admin_users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', adminData.id)
            .then(({ error }) => {
              if (error) console.error("Last login update failed:", error.message);
            });
        }
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }

    } catch (error) {
      console.error("Admin verification error:", error instanceof Error ? error.message : 'Unknown error');
      setIsAdmin(false);
      setAdminUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // 1. Get initial session
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await checkAdminStatus(session.user.id);
          } else {
            setUser(null);
            setAdminUser(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          if (session?.user) {
            setUser(session.user);
            await checkAdminStatus(session.user.id);
          } else {
            setUser(null);
            setAdminUser(null);
            setIsAdmin(false);
          }

          setLoading(false);
        });

        return subscription;
      } catch (error) {
        console.error("Auth initialization failed:", error instanceof Error ? error.message : 'Unknown error');
        if (mounted) setLoading(false);
        return null;
      }
    };

    let subscription: { unsubscribe: () => void } | null = null;

    initialize().then(sub => {
      subscription = sub;
    });

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out failed:", error.message);
      }
    } catch (error) {
      console.error("Sign out error:", error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return {
    user,
    adminUser,
    isAdmin,
    loading,
    signOut
  };
};