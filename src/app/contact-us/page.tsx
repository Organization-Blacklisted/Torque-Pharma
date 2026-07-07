import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import ContactInfoSection from "@/components/sections/contact/ContactInfoSection";
import { getContactPage } from "@/lib/api/contact";

export const metadata: Metadata = {
  title: "Contact Us | Torque Pharma",
  description: "Get in touch with Torque Pharma — reach our teams across sales, partnerships, and manufacturing enquiries.",
};

export default async function ContactUsPage() {
  const { info } = await getContactPage();

  return (
    <>
      <Section first>
        <Container size="wide">
          <ContactInfoSection {...info} />
        </Container>
      </Section>
    </>
  );
}
