import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const masterclassKey = z.enum(["green-job-readiness", "digital-career-compass"]);

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !isAdmin) throw new Error("Forbidden");
}

/** Saves or updates the Google Calendar / Meet link for a masterclass session. */
export const setMasterclassMeetLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        masterclass: masterclassKey,
        meet_link: z.string().trim().max(500),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const link = data.meet_link.trim();
    if (link && !/^https?:\/\//i.test(link)) {
      return { ok: false as const, error: "Enter a full link starting with https://" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("masterclass_sessions")
      .upsert(
        { masterclass: data.masterclass, meet_link: link || null },
        { onConflict: "masterclass" },
      );

    if (error) {
      console.error("saving meet link failed", error);
      return { ok: false as const, error: "Could not save the link. Please try again." };
    }
    return { ok: true as const };
  });

/**
 * Marks a registration as paid and releases the session joining link by email.
 * Shares the same server-side confirmation path future M-Pesa / PayPal
 * webhooks will use.
 */
export const confirmMasterclassPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        resend: z.boolean().optional(),
        reference: z.string().trim().max(120).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const { markRegistrationPaid } = await import("@/lib/masterclass-payments.server");

    const result = await markRegistrationPaid({
      registrationId: data.id,
      provider: "manual",
      confirmedBy: context.userId,
      reference: data.reference ?? null,
      resendEmail: data.resend === true,
    });

    if (!result.ok) return { ok: false as const, error: result.error };

    return {
      ok: true as const,
      emailSent: result.emailSent,
      emailNote: result.emailNote,
    };
  });
