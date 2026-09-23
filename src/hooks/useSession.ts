import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    try {
      void supabase.auth
        .getSession()
        .then(({ data }) => {
          if (!active) return;
          setSession(data.session);
          setLoading(false);
        })
        .catch((error: unknown) => {
          console.error("Unable to read the current session", error);
          if (active) setLoading(false);
        });

      const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
        if (!active) return;
        setSession(next);
        setLoading(false);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    } catch (error) {
      // Public pages must remain available if the auth service is temporarily
      // unavailable or its browser configuration has not loaded yet.
      console.error("Unable to initialise authentication", error);
      setLoading(false);
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  return { session, loading, user: session?.user ?? null };
}

export function useIsAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(null);
      return;
    }
    let active = true;
    try {
      void supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle()
        .then(
          ({ data }) => {
            if (active) setIsAdmin(Boolean(data));
          },
          (error: unknown) => {
            console.error("Unable to check the account role", error);
            if (active) setIsAdmin(false);
          },
        );
    } catch (error) {
      console.error("Unable to initialise the account role check", error);
      setIsAdmin(false);
    }
    return () => {
      active = false;
    };
  }, [userId]);

  return isAdmin;
}
