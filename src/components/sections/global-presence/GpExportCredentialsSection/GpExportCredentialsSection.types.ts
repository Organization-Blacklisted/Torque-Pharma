export interface GpCredentialItem {
  image: string;
  title: string;
  description: string;
}

export interface GpExportCredentialsSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  items: GpCredentialItem[];
  className?: string;
}
