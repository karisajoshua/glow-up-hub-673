-- Tighten applicant write permissions and document ownership checks.
-- Admin access continues through RLS policies and service_role.

-- Students previously had table-wide UPDATE, which allowed them to change
-- administrative fields while an application was still draft/submitted.
REVOKE UPDATE ON public.applications FROM authenticated;

GRANT UPDATE (
  status,
  school,
  school_other,
  full_name,
  date_of_birth,
  gender,
  nationality,
  id_number,
  phone,
  email,
  residential_address,
  county,
  sub_county,
  town,
  postal_code,
  education,
  course,
  mode_of_study,
  mode_of_study_other,
  preferred_intake,
  employment_status,
  employer_name,
  occupation,
  work_experience_years,
  emergency_name,
  emergency_relationship,
  emergency_phone,
  emergency_email,
  emergency_address,
  heard_about,
  heard_about_other,
  declaration_accepted,
  signature_name
) ON public.applications TO authenticated;

-- Recreate the document insert policy so a user cannot attach document
-- metadata to another applicant's application.
DROP POLICY IF EXISTS "Students add own docs" ON public.application_documents;
CREATE POLICY "Students add own docs"
ON public.application_documents
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = application_id
      AND a.user_id = auth.uid()
      AND a.status IN ('draft', 'submitted')
  )
);

-- Only permit deletion of document metadata while the owning application
-- is still editable by the applicant.
DROP POLICY IF EXISTS "Students delete own docs" ON public.application_documents;
CREATE POLICY "Students delete own docs"
ON public.application_documents
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = application_id
      AND a.user_id = auth.uid()
      AND a.status IN ('draft', 'submitted')
  )
);
