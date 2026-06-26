import type { BoardOfDirectorsPageData } from "@/types/board-of-directors";

export const boardOfDirectorsPage: BoardOfDirectorsPageData = {
  contentMedia: {
    eyebrow: "Our Executive Board",
    heading: "Leaders Driving People-First Healthcare Progress",
    description:
      "For over four decades, Torque Pharma's leaders have combined expertise and foresight to make vital therapies accessible to communities worldwide.",
    layout: "centered",
    media: {
      type: "image",
      src: "/images/board/directors.png",
      alt: "Torque Pharma Board of Directors",
      fit: "cover",
    },
    actions: [
      { label: "Discover Our Journey", href: "/about-us", variant: "primary" },
    ],
  },

  cta: {
    eyebrow: "Know More About Us",
    title: "The People, Purpose, And Culture Building Torque",
    button: {
      label: "Life at Torque",
      href: "/life-at-torque",
    },
  },
};
