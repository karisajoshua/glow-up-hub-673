/**
 * Server-only masterclass payment confirmation.
 *
 * This is the single place where a registration becomes "paid" and the session
 * joining link is released. It is provider-agnostic on purpose: the admin
 * confirmation uses provider "manual" today, and future M-Pesa / PayPal
 * webhooks can call `markRegistrationPaid` with their own provider, reference
 * and event id once they have independently verified the transaction.
 *
 * Never import this module from client/browser code.
 */

export type PaymentProvider = "manual" | "mpesa" | "paypal";

export interface MarkPaidInput {
  registrationId: string;
  provider: PaymentProvider;
  /** Who confirmed it (admin user id) — null for automated provider callbacks. */
  confirmedBy?: string | null;
  /** Provider transaction reference (M-Pesa receipt, PayPal capture id, …). */
  reference?: string | null;
  /**
   * Unique provider event id. When supplied, processing is idempotent: a
   * repeated callback with the same id is recognised and no second email goes
   * out.
   */
  providerEventId?: string | null;
  amount?: number | null;
  currency?: string | null;
  payload?: unknown;
  /** Force a fresh confirmation email even if one was already sent. */
  resendEmail?: boolean;
}

export type MarkPaidResult =
  | { ok: false; error: string }
  | {
      ok: true;
      alreadyProcessed: boolean;
      emailSent: boolean;
      emailNote: string | null;
    };

export async function markRegistrationPaid(input: MarkPaidInput): Promise<MarkPaidResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // 1. Registration must exist.
  const { data: reg, error: regError } = await supabaseAdmin
    .from("masterclass_registrations")
    .select("id, masterclass, full_name, email, payment_status, confirmation_email_sent_at")
    .eq("id", input.registrationId)
    .maybeSingle();

  if (regError || !reg) return { ok: false, error: "Registration not found." };

  const masterclass = reg.masterclass ?? "green-job-readiness";

  // 2. Idempotency: a provider event we have already processed is a no-op.
  if (input.providerEventId) {
    const { data: existing } = await supabaseAdmin
      .from("masterclass_payment_events")
      .select("id, processed_at")
      .eq("provider", input.provider)
      .eq("provider_event_id", input.providerEventId)
      .maybeSingle();

    if (existing?.processed_at) {
      return { ok: true, alreadyProcessed: true, emailSent: false, emailNote: null };
    }
  }

  // 3. The masterclass session must exist and have a joining link configured.
  const { data: session } = await supabaseAdmin
    .from("masterclass_sessions")
    .select("meet_link")
    .eq("masterclass", masterclass)
    .maybeSingle();

  if (!session) {
    return { ok: false, error: "That masterclass session does not exist yet." };
  }

  const meetLink = session.meet_link?.trim();
  if (!meetLink) {
    return {
      ok: false,
      error:
        "Add the Google Calendar / Meet link for this masterclass session first, then confirm the payment.",
    };
  }

  const alreadyPaid = (reg.payment_status ?? "pending") === "paid";

  // 4/5. Record the payment.
  if (!alreadyPaid) {
    const { error: updateError } = await supabaseAdmin
      .from("masterclass_registrations")
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
        paid_by: input.confirmedBy ?? null,
        payment_provider: input.provider,
        payment_reference: input.reference ?? null,
      })
      .eq("id", reg.id);

    if (updateError) {
      console.error("marking registration paid failed", updateError);
      return { ok: false, error: "Could not save the payment status. Please try again." };
    }
  }

  if (input.providerEventId) {
    await supabaseAdmin.from("masterclass_payment_events").upsert(
      {
        provider: input.provider,
        provider_event_id: input.providerEventId,
        registration_id: reg.id,
        status: "processed",
        amount: input.amount ?? null,
        currency: input.currency ?? null,
        payload: (input.payload ?? null) as never,
        processed_at: new Date().toISOString(),
      },
      { onConflict: "provider,provider_event_id" },
    );
  }

  // 6/8. Send the joining email once — unless an explicit resend is requested.
  if (reg.confirmation_email_sent_at && !input.resendEmail) {
    return { ok: true, alreadyProcessed: alreadyPaid, emailSent: false, emailNote: null };
  }

  const sent = await sendJoiningEmail({
    registrationId: input.resendEmail ? `${reg.id}-resend-${Date.now()}` : reg.id,
    masterclass,
    fullName: reg.full_name,
    email: reg.email,
    meetLink,
  });

  // 7. Record delivery.
  if (sent.sent) {
    await supabaseAdmin
      .from("masterclass_registrations")
      .update({ confirmation_email_sent_at: new Date().toISOString() })
      .eq("id", reg.id);
  }

  return {
    ok: true,
    alreadyProcessed: alreadyPaid,
    emailSent: sent.sent,
    emailNote: sent.reason ?? null,
  };
}

async function sendJoiningEmail(input: {
  registrationId: string;
  masterclass: string;
  fullName: string;
  email: string;
  meetLink: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const { MASTERCLASS, DIGITAL_CAREER_COMPASS } = await import("@/lib/masterclass");
  const session =
    input.masterclass === "digital-career-compass" ? DIGITAL_CAREER_COMPASS : MASTERCLASS;

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
      reason:
        "this address previously bounced or unsubscribed, so email cannot be delivered to it",
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
