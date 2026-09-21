ALTER TABLE public.masterclass_registrations
  ADD COLUMN IF NOT EXISTS masterclass text NOT NULL DEFAULT 'green-job-readiness';