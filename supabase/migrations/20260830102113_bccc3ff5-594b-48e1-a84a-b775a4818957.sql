CREATE TYPE public.app_role AS ENUM ('admin', 'student');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE TYPE public.application_status AS ENUM ('draft','submitted','under_review','accepted','not_accepted','waitlisted');

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.application_status NOT NULL DEFAULT 'draft',
  reference_no TEXT UNIQUE,
  submitted_at TIMESTAMPTZ,
  school TEXT,
  school_other TEXT,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  nationality TEXT,
  id_number TEXT,
  phone TEXT,
  email TEXT,
  residential_address TEXT,
  county TEXT,
  sub_county TEXT,
  town TEXT,
  postal_code TEXT,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  course TEXT,
  mode_of_study TEXT,
  mode_of_study_other TEXT,
  preferred_intake TEXT,
  employment_status TEXT,
  employer_name TEXT,
  occupation TEXT,
  work_experience_years TEXT,
  emergency_name TEXT,
  emergency_relationship TEXT,
  emergency_phone TEXT,
  emergency_email TEXT,
  emergency_address TEXT,
  heard_about TEXT,
  heard_about_other TEXT,
  declaration_accepted BOOLEAN NOT NULL DEFAULT false,
  signature_name TEXT,
  admin_note TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX applications_user_id_idx ON public.applications(user_id);
CREATE INDEX applications_status_idx ON public.applications(status);
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own applications" ON public.applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students create own applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Students update own draft or submitted" ON public.applications FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status IN ('draft','submitted'))
  WITH CHECK (user_id = auth.uid() AND status IN ('draft','submitted'));
CREATE POLICY "Admins read all applications" ON public.applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all applications" ON public.applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX application_documents_application_idx ON public.application_documents(application_id);
GRANT SELECT, INSERT, DELETE ON public.application_documents TO authenticated;
GRANT ALL ON public.application_documents TO service_role;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own docs" ON public.application_documents FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students add own docs" ON public.application_documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Students delete own docs" ON public.application_documents FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read all docs" ON public.application_documents FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER applications_set_updated_at BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE SEQUENCE public.application_ref_seq;
CREATE OR REPLACE FUNCTION public.assign_reference_no()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status <> 'draft' AND NEW.reference_no IS NULL THEN
    NEW.reference_no := 'SSTC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.application_ref_seq')::text, 4, '0');
    NEW.submitted_at := COALESCE(NEW.submitted_at, now());
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER applications_assign_reference BEFORE INSERT OR UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.assign_reference_no();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(split_part(NEW.email, '@', 2)) = 'sstc.co.ke' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.grant_admin_on_verified_domain()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(split_part(NEW.email, '@', 2)) = 'sstc.co.ke' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_confirmed AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_on_verified_domain();

CREATE POLICY "Students read own application files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'application-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Students upload own application files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'application-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Students delete own application files" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'application-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Admins read all application files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'application-documents' AND public.has_role(auth.uid(), 'admin'));