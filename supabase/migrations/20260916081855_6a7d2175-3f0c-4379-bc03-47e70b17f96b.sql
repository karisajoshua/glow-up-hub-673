CREATE TABLE public.masterclass_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  occupation TEXT NOT NULL,
  heard_about TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.masterclass_registrations TO authenticated;
GRANT ALL ON public.masterclass_registrations TO service_role;

ALTER TABLE public.masterclass_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view masterclass registrations"
ON public.masterclass_registrations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_masterclass_registrations_updated_at
BEFORE UPDATE ON public.masterclass_registrations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();