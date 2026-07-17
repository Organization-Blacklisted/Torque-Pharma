import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import ContactInfoSection from "@/components/sections/contact/ContactInfoSection";
import EnquirySupportSection from "@/components/sections/contact/EnquirySupportSection";
import { getContactPage } from "@/lib/api/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Torque Pharma — reach our teams across sales, partnerships, and manufacturing enquiries.",
};

export default async function ContactUsPage() {
  const { info, enquiry } = await getContactPage();

  return (
    <>
      <Section first>
        <Container size="wide">
          <ContactInfoSection {...info} />
        </Container>
      </Section>
      <Section>
        <Container size="wide">
          <EnquirySupportSection {...enquiry} />
        </Container>
      </Section>
    </>
  );
}
