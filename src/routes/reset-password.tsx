import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Set a New Password | S-STC" }, { name: "robots", content: "noindex" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("The two passwords do not match.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated.");
    navigate({ to: "/my-application" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px] md:pt-[140px]">
        <div className="container-max px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-md rounded-lg border border-outline-variant/30 bg-surface p-8">
            <h1 className="mb-6 font-display text-headline-md text-primary">Set a new password</h1>
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="label-caps mb-2 block text-on-surface-variant">New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </label>
              <label className="block">
                <span className="label-caps mb-2 block text-on-surface-variant">Confirm password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="form-input"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
              >
                {saving ? "Saving…" : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
