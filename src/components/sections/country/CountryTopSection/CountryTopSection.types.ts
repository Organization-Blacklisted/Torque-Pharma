import type { CountryTopData, CountryCounterData } from "@/types/country";

export interface CountryTopSectionProps {
  top: CountryTopData;
  counter: CountryCounterData;
  className?: string;
}
