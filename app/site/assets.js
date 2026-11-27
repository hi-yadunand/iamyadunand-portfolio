export const baseStylesheet = "/_astro/BaseLayout.B-BnKKTW.css";
export const baseRuntime = "/_astro/BaseLayout.astro_astro_type_script_index_0_lang.Dpw5V1aT.js";

const commonFooter = ["portfolio-footer", "footer-reveal", "footer-halftone"];
const routeModules = {
  home: ["helix-hero", ...commonFooter, "testimonial-marquee", "works-wheel", "drone-loader"],
  projects: commonFooter,
  services: ["service-cards", ...commonFooter],
  contact: ["portfolio-footer", "footer-halftone", "contact-gradient-ascii", "contact-form"],
  privacy: commonFooter,
};

const beacon = {
  src: "/assets/vendor/cloudflare-beacon.js",
  integrity: "sha512-UKNk8GbxkABxKcXYuLkO16EleLGUkcvJWtpSNmExE0Too3ZaFAxTscNWEc1OdAv5/BikHawapSCaiD2XCmp+Bw==",
  crossOrigin: "anonymous",
  data: '{"version":"2024.11.0","token":"cafbd0512f3a4a4f99b029b53309d22c","r":1,"spa":2}',
};

export function scriptsFor(page) {
  const modules = routeModules[page].map(name => ({ src: `/assets/js/${name}.js` }));
  if (page === "projects") return [{ src: baseRuntime }, ...modules];
  if (page === "home") return [{ src: baseRuntime }, ...modules, beacon];
  return [{ src: baseRuntime }, beacon, ...modules];
}

const routeStyles = {
  home: [
    "drone-band", "project-cards", "works-wheel",
    "https://fonts.googleapis.com/css2?family=Anton&display=swap",
    "helix-hero", "code-thrive-highlight", "portfolio-footer", "testimonial-marquee", "workflow",
  ],
  projects: ["project-cards", "portfolio-footer", "projects-intro"],
  services: ["service-cards", "portfolio-footer"],
  contact: ["portfolio-footer", "contact-background", "contact-layout"],
  privacy: ["portfolio-footer"],
};

export function stylesFor(page) {
  return [
    ...routeStyles[page].map(style => style.startsWith("https:") ? style : `/assets/css/${style}.css`),
    "/assets/css/preloader.css",
  ];
}
