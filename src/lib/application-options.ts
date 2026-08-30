export const SCHOOLS = [
  "School of Sustainable Skills & Technologies",
  "School of Fashion & Design",
  "School of Green Technologies",
  "School of Agriculture & Food Systems",
  "Other",
] as const;

export const GENDERS = ["Female", "Male", "Prefer not to say"] as const;

export const EDUCATION_LEVELS = ["Primary", "Secondary", "College / University", "Other"] as const;

export const COURSES = [
  "Sustainability Foundations for Professionals",
  "Climate Risk and Environmental Compliance",
  "Green Skills for the Built Environment",
  "Community Based Green Skilling",
] as const;

export const MODES_OF_STUDY = [
  "Full-time",
  "Part-time",
  "Evening",
  "Weekend",
  "Online",
  "Other",
] as const;

export const EMPLOYMENT_STATUSES = [
  "Employed",
  "Self-employed",
  "Unemployed",
  "Student",
  "Other",
] as const;

export const HEARD_ABOUT = [
  "Website",
  "Social media",
  "Friend or family",
  "Employer",
  "Event or workshop",
  "Other",
] as const;

export const DOC_TYPES = [
  { key: "id_passport", label: "ID or passport copy" },
  { key: "certificates", label: "Academic certificates" },
  { key: "passport_photo", label: "Passport photo" },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  not_accepted: "Not Accepted",
  waitlisted: "Waitlisted",
};

export const ADMIN_STATUSES = [
  "submitted",
  "under_review",
  "accepted",
  "not_accepted",
  "waitlisted",
] as const;

export type EducationRow = {
  level: string;
  institution: string;
  year_from: string;
  year_to: string;
  qualification: string;
};

export const EMPTY_EDUCATION_ROW: EducationRow = {
  level: "",
  institution: "",
  year_from: "",
  year_to: "",
  qualification: "",
};
