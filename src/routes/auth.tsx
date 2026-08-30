import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Student Sign In & Sign Up | S-STC Applicant Portal" },
      {
        name: "description",
        content:
          "Create your S-STC applicant account or sign in to continue your application to SustainaSpace Training Center.",
      },
      { property: "og:title", content: "S-STC Applicant Portal" },
      {
        property: "og:description",
        content: "Create an account or sign in to start and track your S-STC application.",
      },
      { property: "og:url", content: "https://sstc.co.ke/auth" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/auth" }],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const landing = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return "/application" as const;
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();
    return role ? ("/admin" as const) : ("/application" as const);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) navigate({ to: await landing(), replace: true });
    });
  }, [navigate, landing]);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent. Check your inbox.");
        setMode("signin");
        return;
      }

      if (mode === "signup") {
        if (!fullName.trim()) throw new Error("Please enter your full name.");
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim(), phone: phone.trim() },
          },
        });
        if (error) throw error;
        toast.success("Account created. Let's start your application.");
        navigate({ to: "/application" });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      toast.success("Welcome back.");
      navigate({ to: "/application" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px] md:pt-[140px]">
        <div className="container-max px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-xl">
            <h1 className="mb-4 font-display text-display-lg text-primary">
              {mode === "signup"
                ? "Create your applicant account"
                : mode === "forgot"
                  ? "Reset your password"
                  : "Sign in to your application"}
            </h1>
            <p className="mb-8 text-body-md text-on-surface-variant">
              {mode === "signup"
                ? "Your account saves your progress so you can complete the application in your own time."
                : mode === "forgot"
                  ? "Enter the email you registered with and we will send you a reset link."
                  : "Continue an application, upload documents or check your admission status."}
            </p>

            <form
              onSubmit={onSubmit}
              className="space-y-5 rounded-lg border border-outline-variant/30 bg-surface p-8 shadow-sm"
            >
              {mode === "signup" && (
                <>
                  <Field label="Full name">
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-input"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Phone number">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                      autoComplete="tel"
                    />
                  </Field>
                </>
              )}

              <Field label="Email address">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  autoComplete="email"
                />
              </Field>

              {mode !== "forgot" && (
                <Field label="Password">
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                </Field>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
              >
                {busy
                  ? "Please wait…"
                  : mode === "signup"
                    ? "Create account"
                    : mode === "forgot"
                      ? "Send reset link"
                      : "Sign in"}
              </button>

              <div className="flex flex-wrap justify-between gap-3 pt-2 text-body-sm">
                {mode === "signin" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-secondary hover:underline"
                    >
                      Create an account
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-on-surface-variant hover:underline"
                    >
                      Forgot password?
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-secondary hover:underline"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </form>

            <p className="mt-6 text-body-sm text-on-surface-variant">
              Need help? Email{" "}
              <a className="text-secondary hover:underline" href="mailto:admissions@sstc.co.ke">
                admissions@sstc.co.ke
              </a>{" "}
              or read <Link className="text-secondary hover:underline" to="/apply">how to apply</Link>.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}
