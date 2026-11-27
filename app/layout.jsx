import { baseStylesheet } from "./site/assets";
import { boot } from "./site/boot";
import SmoothScroll from "../components/SmoothScroll";

export const metadata = {
  icons: { icon: { url: "/images/profile/iamyadunand-favicon.png", type: "image/png" } },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script src="/assets/js/page-transitions.js" />
        <link rel="preload" href="/_astro/geist-mono-latin-wght-normal.XN7g48iV.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/css/navigation.css" as="style" />
        <link rel="stylesheet" href={baseStylesheet} precedence="portfolio" />
        <link rel="stylesheet" href="/assets/css/site-navigation.css" precedence="portfolio" />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
