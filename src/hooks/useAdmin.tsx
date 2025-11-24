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
    console.log("🔍 Checking admin status for user:", userId);
    try {
      console.log("📊 Querying admin_users table...");
      console.log("⏱️ Query started at:", new Date().toISOString());

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      console.log("✅ Query completed at:", new Date().toISOString());
      console.log("📦 Query result:", { adminData, adminError });

      if (adminError && adminError.code !== 'PGRST116') {
        console.error("❌ Error fetching admin user data:", adminError);
        setIsAdmin(false);
        setAdminUser(null);
        return;
      }

      const isUserAdmin = !!adminData;

      if (!adminData) {
        console.warn("⚠️ No admin user found in database for this auth user!");
      } else {
        console.log("✅ Admin user found:", adminData);
      }

      console.log("🎯 Is user admin?", isUserAdmin);

      setIsAdmin(isUserAdmin);
      setAdminUser(adminData as AdminUser | null);

      if (adminData) {
        supabase
          .from('admin_users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', adminData.id)
          .then(({ error }) => {
            if (error) {
              console.error("Error updating last login:", error);
            }
          });
      }
    } catch (error) {
      console.error("Error in checkAdminStatus:", error);
      setIsAdmin(false);
      setAdminUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("⏱️ Admin check timed out after 10 seconds");
        setLoading(false);
      }
    }, 10000);

    const initializeSession = async () => {
      try {
        console.log("🔐 Initializing session...");
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Error getting session:", error);
        }

        if (!mounted) return;

        console.log("✅ Session initialized:", session ? "User logged in" : "No session");

        if (session?.user) {
          setUser(session.user);
          await checkAdminStatus(session.user.id);
        } else {
          setUser(null);
          setAdminUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("❌ Error in initializeSession:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("🔄 Auth state changed:", event);

      if (session?.user) {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      } else {
        setUser(null);
        setAdminUser(null);
        setIsAdmin(false);
      }

      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
    } catch (error) {
      console.error("Error in signOut:", error);
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