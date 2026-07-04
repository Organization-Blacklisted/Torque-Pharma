import localFont from 'next/font/local'

export const bwDarius = localFont({
  src: [
    {
      path: "./bw-darius/BwDarius-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./bw-darius/BwDarius-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const graphik = localFont({
  src: [
    {
      path: "./graphik/Graphik-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./graphik/Graphik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./graphik/Graphik-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: "Arial",
});
