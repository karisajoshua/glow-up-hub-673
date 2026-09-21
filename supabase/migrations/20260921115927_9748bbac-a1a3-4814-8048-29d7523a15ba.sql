ALTER TABLE public.masterclass_registrations
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS paid_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz;

ALTER TABLE public.masterclass_registrations
  ADD CONSTRAINT masterclass_registrations_payment_status_check
  CHECK (payment_status IN ('pending','paid'));

CREATE TABLE public.masterclass_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masterclass text NOT NULL UNIQUE,
  meet_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.masterclass_sessions TO authenticated;
GRANT ALL ON public.masterclass_sessions TO service_role;

ALTER TABLE public.masterclass_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view masterclass sessions"
ON public.masterclass_sessions FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_masterclass_sessions_updated_at
BEFORE UPDATE ON public.masterclass_sessions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.masterclass_sessions (masterclass, meet_link)
VALUES ('green-job-readiness', NULL), ('digital-career-compass', NULL);