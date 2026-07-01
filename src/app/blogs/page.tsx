import type { Metadata } from "next";
import { getBlogs } from "@/lib/api/blogs";
import BlogsSection from "@/components/sections/blog/BlogsSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

export const metadata: Metadata = {
  title: "The Torque Journal",
  description:
    "Thoughtful reads on health, science, and human wellbeing from the Torque Pharma team.",
};

export default async function BlogsPage() {
  const posts = await getBlogs();

  return (
    <>
      <Section first>
        <Container size="wide">
          <BlogsSection data={{ posts }} />
        </Container>
      </Section>
    </>
  );
}
