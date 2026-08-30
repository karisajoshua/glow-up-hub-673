import { DOC_TYPES, type EducationRow } from "@/lib/application-options";

export const STEP_LABELS = [
  "School",
  "Personal",
  "Education",
  "Course",
  "Employment",
  "Emergency contact",
  "Referral",
  "Documents",
  "Review",
] as const;

export type ProgressInput = {
  form: Record<string, string | null | undefined>;
  education: EducationRow[];
  docTypes: string[];
  declaration: boolean;
};

const filled = (value: string | null | undefined) => Boolean(value && String(value).trim());

export function sectionComplete(step: number, input: ProgressInput): boolean {
  const { form, education, docTypes, declaration } = input;
  switch (step) {
    case 0:
      return filled(form["school"]);
    case 1:
      return (
        filled(form["full_name"]) &&
        filled(form["date_of_birth"]) &&
        filled(form["phone"]) &&
        filled(form["email"])
      );
    case 2:
      return education.some((row) => filled(row.level) && filled(row.institution));
    case 3:
      return filled(form["course"]) && filled(form["mode_of_study"]);
    case 4:
      return filled(form["employment_status"]);
    case 5:
      return filled(form["emergency_name"]) && filled(form["emergency_phone"]);
    case 6:
      return filled(form["heard_about"]);
    case 7:
      return DOC_TYPES.every((type) => docTypes.includes(type.key));
    case 8:
      return filled(form["signature_name"]) && declaration;
    default:
      return false;
  }
}

export function sectionStatuses(input: ProgressInput) {
  return STEP_LABELS.map((label, index) => ({
    index,
    label,
    complete: sectionComplete(index, input),
  }));
}

export function firstIncompleteStep(input: ProgressInput): number {
  const found = sectionStatuses(input).find((section) => !section.complete);
  return found ? found.index : STEP_LABELS.length - 1;
}
