import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const registrationSchema = z.object({
  masterclass: z.enum(["green-job-readiness", "digital-career-compass"]),
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255),
  occupation: z.string().trim().min(2).max(160),
  heard_about: z.string().trim().max(80).optional().or(z.literal("")),
});

export const registerForMasterclass = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("masterclass_registrations").insert({
      masterclass: data.masterclass,
      full_name: data.full_name,
      phone: data.phone,
      email: data.email,
      occupation: data.occupation,
      heard_about: data.heard_about || null,
    });

    if (error) {
      if (error.code === "23505") {
        return {
          ok: false as const,
          error: "This email is already registered for this masterclass.",
        };
      }
      console.error("masterclass registration failed", error);
      return { ok: false as const, error: "Could not save your registration. Please try again." };
    }

    return { ok: true as const };
  });
