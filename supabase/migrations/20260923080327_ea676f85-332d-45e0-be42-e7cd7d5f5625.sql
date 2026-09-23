-- 1. Widen payment status vocabulary for future providers
ALTER TABLE public.masterclass_registrations
  DROP CONSTRAINT IF EXISTS masterclass_registrations_payment_status_check;
ALTER TABLE public.masterclass_registrations
  ADD CONSTRAINT masterclass_registrations_payment_status_check
  CHECK (payment_status IN ('pending','paid','failed','refunded'));

-- 2. Provider attribution on each registration (nullable; admin confirmations use 'manual')
ALTER TABLE public.masterclass_registrations
  ADD COLUMN IF NOT EXISTS payment_provider text,
  ADD COLUMN IF NOT EXISTS payment_reference text;
ALTER TABLE public.masterclass_registrations
  DROP CONSTRAINT IF EXISTS masterclass_registrations_payment_provider_check;
ALTER TABLE public.masterclass_registrations
  ADD CONSTRAINT masterclass_registrations_payment_provider_check
  CHECK (payment_provider IS NULL OR payment_provider IN ('manual','mpesa','paypal'));

-- 3. Idempotency ledger for future provider webhooks
CREATE TABLE IF NOT EXISTS public.masterclass_payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('manual','mpesa','paypal')),
  provider_event_id text NOT NULL,
  registration_id uuid REFERENCES public.masterclass_registrations(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'received',
  amount numeric,
  currency text,
  payload jsonb,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS masterclass_payment_events_provider_event_unique
  ON public.masterclass_payment_events (provider, provider_event_id);

GRANT ALL ON public.masterclass_payment_events TO service_role;

ALTER TABLE public.masterclass_payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view masterclass payment events"
ON public.masterclass_payment_events FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.masterclass_payment_events TO authenticated;

CREATE TRIGGER set_masterclass_payment_events_updated_at
BEFORE UPDATE ON public.masterclass_payment_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Store the Green Job Readiness session link on its session record
INSERT INTO public.masterclass_sessions (masterclass, meet_link)
VALUES ('green-job-readiness', 'https://calendar.app.google/57NqqX1hB5RkWE57A')
ON CONFLICT (masterclass) DO UPDATE
  SET meet_link = COALESCE(NULLIF(public.masterclass_sessions.meet_link, ''), EXCLUDED.meet_link);
