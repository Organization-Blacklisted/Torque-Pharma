import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Rendered ONLY inside the generated product PDF — see the DOM-injection
// step in src/app/api/pdf/[slug]/route.ts. Never imported by any live page,
// so it can never appear on the actual website; it stands in for the
// site's "Become a Dealer" CtaSection, which the client doesn't want printed.
//
// Hand-rolled instead of reusing the shared <CTA> component: that component
// only goes side-by-side at its own lg: breakpoint, which the PDF's fixed
// viewport width never reaches, so it always stacked here. This always
// renders as a 50/50 row, since it only ever prints at one fixed width.
export default function PdfOnlyCta() {
  return (
    <Section as="div">
      <Container size="wide">
        <div className="cta-gradient grid grid-cols-2 items-center gap-8 rounded-lg px-8 py-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span className="text-eyebrow font-medium uppercase text-primary">GET IN TOUCH</span>
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
            </div>
            <h2 className="font-heading text-h2 font-light leading-[1.4] text-primary">
              Have a Question
              <br />
              About This Product?
            </h2>
          </div>
          <div className="justify-self-end text-right">
            <p className="mb-3 text-body font-light leading-6 text-primary">
              Speak with us for more information.
            </p>
            <a
              href="tel:+911724991500"
              className="inline-flex items-center gap-2 text-h4 font-medium text-primary"
            >
              <PhoneIcon />
              +91 172 499 1500
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
