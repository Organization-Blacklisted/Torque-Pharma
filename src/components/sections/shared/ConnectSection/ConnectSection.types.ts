export type ConnectVariant = "about" | "white-label";

export interface ConnectSectionProps {
  variant: ConnectVariant;
  eyebrow: string;
  title: string;
  image: string;
  className?: string;
}

export interface ConnectFormProps {
  variant: ConnectVariant;
}
