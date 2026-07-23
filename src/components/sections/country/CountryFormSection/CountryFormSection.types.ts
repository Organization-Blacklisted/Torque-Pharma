import type { CountryFormData } from "@/types/country";

export interface CountryFormSectionProps extends CountryFormData {
  pageName: string;
  pageUrl: string;
  /** ISO 3166-1 alpha-2 code to pre-select in the phone field (editable). */
  defaultCountry?: string;
  className?: string;
}
