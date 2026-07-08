import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import CTA from "@/components/ui/CTA";
import { SplitButton } from "@/components/ui/SplitButton";
import type { CtaSectionProps } from "./CtaSection.types";

export default function CtaSection({
  eyebrow,
  title,
  description,
  variant = "gradient",
  button,
  children,
  className = "",
}: CtaSectionProps) {
  return (
    <Section as="div" className={className}>
      <Container size="wide">
        <CTA eyebrow={eyebrow} title={title} description={description} variant={variant}>
          {children ?? (button ? (
            <SplitButton variant={button.variant ?? "secondary"} href={button.href}>
              {button.label}
            </SplitButton>
          ) : null)}
        </CTA>
      </Container>
    </Section>
  );
}
