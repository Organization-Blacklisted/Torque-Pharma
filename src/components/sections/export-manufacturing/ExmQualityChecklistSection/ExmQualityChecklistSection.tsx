import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { ExmQualityChecklistSectionProps } from "./ExmQualityChecklistSection.types";

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.8026 9.99999C22.2593 12.2413 21.9338 14.5714 20.8804 16.6018C19.827 18.6322 18.1095 20.24 16.0141 21.1573C13.9187 22.0746 11.5722 22.2458 9.36586 21.6424C7.15954 21.0389 5.22676 19.6974 3.88984 17.8414C2.55293 15.9854 1.89269 13.7272 2.01923 11.4434C2.14577 9.15952 3.05144 6.98808 4.58522 5.29116C6.11899 3.59424 8.18815 2.47442 10.4476 2.11844C12.7071 1.76247 15.0203 2.19185 17.0016 3.33499"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#5BC4A0"
      />
      <path d="M9 11L12 14L22 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="#5BC4A0" />
    </svg>
  );
}

export default function ExmQualityChecklistSection({
  eyebrow,
  title,
  description,
  note,
  items,
  button,
  buttonOverride,
  className = "",
}: ExmQualityChecklistSectionProps) {
  return (
    <Section className={className}>
      <Container size="content">
        <div className="grid items-start gap-[var(--spacing-section-inner)] lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow={eyebrow} title={title} description={description} />
            {note && (
              <p className="mt-6 border-l-2 border-primary/60 pl-4 text-body-sm italic text-secondary/70">
                {note}
              </p>
            )}
            {(buttonOverride || button) && (
              <div className="mt-6">
                {buttonOverride ?? (
                  <SplitButton href={button!.href} variant="primary">
                    {button!.label}
                  </SplitButton>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white/60 p-[var(--spacing-card)]">
            <ul className="divide-y divide-secondary/20">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="mt-0.5 shrink-0">
                    <CheckIcon />
                  </span>
                  <span className="text-h5 text-secondary">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
