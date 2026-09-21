-- Validate public masterclass data at the database boundary and prevent duplicate spam.
ALTER TABLE public.masterclass_registrations
  ADD CONSTRAINT masterclass_registrations_masterclass_check
  CHECK (masterclass IN ('green-job-readiness','digital-career-compass')),
  ADD CONSTRAINT masterclass_registrations_email_length_check CHECK (char_length(email) <= 255),
  ADD CONSTRAINT masterclass_registrations_phone_length_check CHECK (char_length(phone) <= 30),
  ADD CONSTRAINT masterclass_registrations_name_length_check CHECK (char_length(full_name) <= 120),
  ADD CONSTRAINT masterclass_registrations_occupation_length_check CHECK (char_length(occupation) <= 160);

CREATE UNIQUE INDEX IF NOT EXISTS masterclass_registration_unique_email
ON public.masterclass_registrations (masterclass, lower(email));
