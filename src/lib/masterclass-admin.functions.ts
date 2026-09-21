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

/** Saves or updates the Google Meet joining link for a masterclass. */
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

/** Marks a registration as paid and sends the joining-link email. */
export const confirmMasterclassPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), resend: z.boolean().optional() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: reg, error: regError } = await supabaseAdmin
      .from("masterclass_registrations")
      .select("id, masterclass, full_name, email, payment_status")
      .eq("id", data.id)
      .maybeSingle();

    if (regError || !reg) {
      return { ok: false as const, error: "Registration not found." };
    }

    const key = reg.masterclass ?? "green-job-readiness";

    const { data: session } = await supabaseAdmin
      .from("masterclass_sessions")
      .select("meet_link")
      .eq("masterclass", key)
      .maybeSingle();

    const meetLink = session?.meet_link?.trim();
    if (!meetLink) {
      return {
        ok: false as const,
        error: "Add the Google Meet link for this masterclass first, then mark the payment as paid.",
      };
    }

    if (!data.resend) {
      const { error: updateError } = await supabaseAdmin
        .from("masterclass_registrations")
        .update({ payment_status: "paid", paid_at: new Date().toISOString(), paid_by: context.userId })
        .eq("id", reg.id);

      if (updateError) {
        console.error("marking paid failed", updateError);
        return { ok: false as const, error: "Could not save the payment status. Please try again." };
      }
    }

    const sent = await sendConfirmation({
      registrationId: data.resend ? `${reg.id}-resend-${Date.now()}` : reg.id,
      masterclass: key,
      fullName: reg.full_name,
      email: reg.email,
      meetLink,
    });

    if (sent.sent) {
      await supabaseAdmin
        .from("masterclass_registrations")
        .update({ confirmation_email_sent_at: new Date().toISOString() })
        .eq("id", reg.id);
    }

    return { ok: true as const, emailSent: sent.sent, emailNote: sent.reason ?? null };
  });

async function sendConfirmation(input: {
  registrationId: string;
  masterclass: string;
  fullName: string;
  email: string;
  meetLink: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const { MASTERCLASS, DIGITAL_CAREER_COMPASS } = await import("@/lib/masterclass");
  const session = input.masterclass === "digital-career-compass" ? DIGITAL_CAREER_COMPASS : MASTERCLASS;

  const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");

  try {
    const result = await sendTemplateEmail("masterclass-confirmation", input.email, {
      templateData: {
        fullName: input.fullName,
        masterclassTitle: session.title,
        date: session.date,
        time: session.time,
        venue: session.venue,
        meetLink: input.meetLink,
      },
      idempotencyKey: `masterclass-confirmation-${input.registrationId}`,
    });

    if (result.sent) return { sent: true };
    return {
      sent: false,
      reason: "this address previously bounced or unsubscribed, so email cannot be delivered to it",
    };
  } catch (error) {
    console.error("masterclass confirmation email failed", error);
    const code =
      error != null && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    if (code === "domain_not_verified") {
      return { sent: false, reason: "the sending domain is still being verified" };
    }
    if (code === "emails_disabled") {
      return { sent: false, reason: "email sending is currently switched off for this project" };
    }
    return { sent: false, reason: "the email service returned an error" };
  }
}
