import type { CountryFormData } from "@/types/country";

export interface CountryFormSectionProps extends CountryFormData {
  pageName: string;
  pageUrl: string;
  className?: string;
}
