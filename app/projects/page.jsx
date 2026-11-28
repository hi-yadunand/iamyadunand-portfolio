import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import Icon from "../../components/Icon";
import Reveal from "../../components/Reveal";
import { HoverReel } from "../../components/ui/hover-reel";
import { SiteFrame } from "../site/site-frame";
import { pageMetadata } from "../site/metadata";

export const metadata = pageMetadata.projects;

const tarsxReelPreview = (
  <span className="project-robot">
    <span className="label">TARSX / Experiment 03</span>
    <span className="project-robot__body"><i /><i /><i /><i /></span>
    <span className="label">Raspberry Pi · Python · AI</span>
  </span>
);

const allProjects = [
  {
    title: "Zappo",
    location: "India", label: "Web app", year: "2026",
    href: "https://codeandthrive.studio/case-studies/zappo-sports-booking-app",
    image: "/images/case-studies/zappo.webp",
  },
  {
    title: "Tenorra Labs",
    location: "India", label: "Website", year: "2024",
    href: "https://codeandthrive.studio/case-studies/tenorra-labs-consumer-products-website",
    image: "/images/case-studies/tenorra-labs.webp",
  },
  {
    title: "Code and Thrive",
    location: "India", label: "Website", year: "2025",
    href: "https://codeandthrive.studio/",
    image: "/images/projects/codeandthrive.webp",
  },
  {
    title: "BTPC4E Xelerator",
    location: "USA", label: "Website", year: "2026",
    href: "https://codeandthrive.studio/case-studies/btpc4e-xelerator-enterprise-website-ai-redesign",
    image: "/images/case-studies/btpc4e.webp",
  },
  {
    title: "Zion Piling",
    location: "India", label: "Website", year: "2026",
    href: "https://codeandthrive.studio/case-studies/zion-piling-website-crm-digital-marketing",
    image: "/images/case-studies/zion-piling.webp",
  },
  {
    title: "Karuvin",
    location: "Singapore", label: "Website", year: "2025",
    href: "https://codeandthrive.studio/case-studies/karuvin-builds-a-stronger-digital-presence",
    image: "/images/case-studies/karuvin.webp",
  },
  {
    title: "Lobiatek",
    location: "Dubai", label: "Website", year: "2025",
    href: "https://codeandthrive.studio/case-studies/lobiatek-technology-solutions-website",
    image: "/images/case-studies/lobiatek.webp",
  },
  {
    title: "A1 Finish Painting",
    location: "Australia", label: "Website", year: "2024",
    href: "https://codeandthrive.studio/case-studies/a1-finish-painting-website",
    image: "/images/case-studies/a1-finish-painting.webp",
  },
  {
    title: "Spakgen",
    location: "Singapore", label: "Website", year: "2023",
    href: "https://codeandthrive.studio/case-studies/spakgen-cleaning-services-website-development",
    image: "/images/case-studies/spakgen.webp",
  },
  {
    title: "TARSX Robot",
    location: "India", label: "Robotics", year: "2024",
    href: "https://tarsx.space/",
    preview: tarsxReelPreview,
  },
  {
    title: "Startup Grow",
    location: "India", label: "Full stack", year: "2026",
    href: "https://startup-grow-sand.vercel.app/",
    image: "/images/projects/startupgrow.webp",
  },
];

export default function ProjectsPage() {
  return (
    <SiteFrame page="projects">
      <main>
        <div>
          <section className="projects-tunnel" data-nav-intro="" data-projects-tunnel="" aria-labelledby="projects-tunnel-title">
            <div className="projects-tunnel__stage">
              <div className="projects-tunnel__copy">
                <h1 id="projects-tunnel-title" className="display projects-tunnel__title">Project showcase.</h1>
                <p className="projects-tunnel__description">Websites, web applications, and robotics projects I’ve designed and built.</p>
              </div>
              <ul className="projects-tunnel__cards" role="list">
                <li className="projects-tunnel__card">
                  <img src="/images/case-studies/zappo.webp" alt="" width="720" height="480" decoding="async" />
                  <span>Zappo</span>
                </li>
                <li className="projects-tunnel__card">
                  <img src="/images/case-studies/karuvin.webp" alt="" width="720" height="480" decoding="async" />
                  <span>Karuvin</span>
                </li>
                <li className="projects-tunnel__card">
                  <img src="/images/case-studies/lobiatek.webp" alt="" width="720" height="480" decoding="async" />
                  <span>Lobiatek</span>
                </li>
                <li className="projects-tunnel__card">
                  <img src="/images/case-studies/btpc4e.webp" alt="" width="720" height="480" decoding="async" />
                  <span>BTPC4E Xelerator</span>
                </li>
                <li className="projects-tunnel__card">
                  <img src="/images/case-studies/zion-piling.webp" alt="" width="720" height="480" decoding="async" />
                  <span>Zion Piling</span>
                </li>
                <li className="projects-tunnel__card">
                  <img src="/images/projects/codeandthrive.webp" alt="" width="1600" height="862" loading="lazy" decoding="async" />
                  <span>Code and Thrive</span>
                </li>
                <li className="projects-tunnel__card">
                  <img src="/images/case-studies/a1-finish-painting.webp" alt="" width="720" height="480" loading="lazy" decoding="async" />
                  <span>A1 Finish Painting</span>
                </li>
                <li className="projects-tunnel__card">
                  <img src="/images/case-studies/tenorra-labs.webp" alt="" width="720" height="480" loading="lazy" decoding="async" />
                  <span>Tenorra Labs</span>
                </li>
                <li className="projects-tunnel__card">
                  <img src="/images/case-studies/spakgen.webp" alt="" width="720" height="480" loading="lazy" decoding="async" />
                  <span>Spakgen</span>
                </li>
              </ul>
              <p className="projects-tunnel__hint label" aria-hidden="true">Scroll to explore</p>
            </div>
          </section>
        </div>
        <div>
          <section className="mt-24 md:mt-40">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3">
                <p className="flex gap-4">
                  <span className="text-signal">A–03</span>
                  <span>Selected projects</span>
                </p>
              </Reveal>
              <div className="mt-10 space-y-16 md:mt-16 md:space-y-32">
                <article className="grid items-end gap-6 md:grid-cols-12">
                  <div data-clip="" className="relative aspect-[4/3] overflow-hidden bg-ink/5 md:col-span-7">
                    <div className="absolute inset-0 project-preview">
                      <img src="/images/projects/zappoapp.webp" alt="ZAPPO sports booking platform with venue discovery and player matching" width="1600" height="862" loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <div className="md:col-span-4 md:col-start-9">
                    <h3 className="display text-display-md">
                      <span className="block" data-lines="">Zappo</span>
                    </h3>
                    <p className="label mt-4 text-signal">Web app · 2026</p>
                    <p data-reveal="" className="mt-4 text-lg leading-[1.3] tracking-[-0.015em] text-graphite">A responsive sports booking platform. Venue discovery, slot booking, and real-time availability, built with React.js and REST APIs.</p>
                    <div data-reveal="" className="mt-6">
                      <a href="https://zappoapp.com/" target="_blank" rel="noopener noreferrer" className="btn">
                        <span className="roll">
                          <span data-text="Visit project">Visit project</span>
                        </span>
                        <span className="size-3.5 icon-slot"><Icon icon={ArrowUpRight01Icon} size={18} /></span>
                      </a>
                    </div>
                  </div>
                </article>
                <article className="grid items-end gap-6 md:grid-cols-12">
                  <div data-clip="" className="relative aspect-[4/3] overflow-hidden bg-ink/5 md:col-span-7 md:order-2 md:col-start-6">
                    <div className="absolute inset-0 project-preview project-preview--studio">
                      <img src="/images/projects/codeandthrive.webp" alt="Code and Thrive digital product and growth studio website" width="1600" height="862" loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <div className="md:col-span-4 md:order-1 md:col-start-1 md:row-start-1">
                    <h3 className="display text-display-md">
                      <span className="block" data-lines="">Code &amp;<br />Thrive</span>
                    </h3>
                    <p className="label mt-4 text-signal">Design &amp; code · 2025</p>
                    <p data-reveal="" className="mt-4 text-lg leading-[1.3] tracking-[-0.015em] text-graphite">Digital experiences that bring web development, UI/UX design, branding, and SEO together.</p>
                    <div data-reveal="" className="mt-6">
                      <a href="https://codeandthrive.studio/" target="_blank" rel="noopener noreferrer" className="btn">
                        <span className="roll">
                          <span data-text="Visit project">Visit project</span>
                        </span>
                        <span className="size-3.5 icon-slot"><Icon icon={ArrowUpRight01Icon} size={18} /></span>
                      </a>
                    </div>
                  </div>
                </article>
                <article className="grid items-end gap-6 md:grid-cols-12">
                  <div data-clip="" className="relative aspect-[4/3] overflow-hidden bg-ink/5 md:col-span-7">
                    <div className="absolute inset-0 project-robot" role="img" aria-label="TARSX robot concept with four brushed metal columns and an orange status light">
                      <span className="label" aria-hidden="true">TARSX / Experiment 03</span>
                      <div className="project-robot__body" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <span className="label" aria-hidden="true">Raspberry Pi · Python · AI</span>
                    </div>
                  </div>
                  <div className="md:col-span-4 md:col-start-9">
                    <h3 className="display text-display-md">
                      <span className="block" data-lines="">TARSX<br />Robot</span>
                    </h3>
                    <p className="label mt-4 text-signal">Robotics · 2024</p>
                    <p data-reveal="" className="mt-4 text-lg leading-[1.3] tracking-[-0.015em] text-graphite">A real-life TARS-inspired robot, combining custom hardware, embedded systems, and conversational AI.</p>
                    <div data-reveal="" className="mt-6">
                      <a href="https://tarsx.space/" target="_blank" rel="noopener noreferrer" className="btn">
                        <span className="roll">
                          <span data-text="Visit project">Visit project</span>
                        </span>
                        <span className="size-3.5 icon-slot"><Icon icon={ArrowUpRight01Icon} size={18} /></span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section id="all-projects" className="mt-20 md:mt-32" style={{"scrollMarginTop": "6rem"}}>
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3">
                <p className="flex gap-4">
                  <span className="text-signal">A–04</span>
                  <span>All projects</span>
                </p>
              </Reveal>
              <HoverReel projects={allProjects} className="mt-10 md:mt-16" />
            </div>
          </section>
        </div>
        <div>
          <section data-projects-gallery="" className="mt-24 md:mt-40">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3 ">
                <p className="flex gap-4">
                  <span className="text-signal">A–06</span>
                  <span>Around the projects</span>
                </p>
              </Reveal>
              <div className="mt-10 grid gap-6 md:mt-16 md:grid-cols-12 md:gap-y-16">
                <div data-clip="" className="relative overflow-hidden md:col-span-5 aspect-[4/5]">
                  <div data-parallax="6" className="absolute inset-0">
                    <img src="/images/case-studies/tenorra-labs.webp" alt="Tenorra Labs Private Limited corporate website showcasing consumer technology innovation, Zappo and sports-focused digital products." width="720" height="480" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{"objectPosition": "65% center"}} />
                  </div>
                </div>
                <div data-clip="" className="relative overflow-hidden md:col-span-4 md:col-start-8 md:mt-40 aspect-[3/4]">
                  <div data-parallax="6" className="absolute inset-0">
                    <img src="/images/case-studies/lobiatek.webp" alt="Lobiatek Dubai technology solutions website showcasing CCTV, access control, networking, fire safety and GPS services." width="720" height="480" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{"objectPosition": "65% center"}} />
                  </div>
                </div>
                <div data-clip="" className="relative overflow-hidden md:col-span-7 md:col-start-2 aspect-[16/10]">
                  <div data-parallax="6" className="absolute inset-0">
                    <img src="/images/case-studies/btpc4e.webp" alt="A Refined Enterprise Digital Experience for BTPC4E" width="720" height="480" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{"objectPosition": "center"}} />
                  </div>
                </div>
                <div data-clip="" className="relative overflow-hidden md:col-span-3 md:col-start-10 aspect-square">
                  <div data-parallax="6" className="absolute inset-0">
                    <img src="/images/case-studies/karuvin.webp" alt="Karuvin Singapore mechanical and electrical services website featuring M&amp;E maintenance, installation and business support services." width="720" height="480" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{"objectPosition": "60% center"}} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section data-projects-marquee="" className="mt-24 overflow-hidden md:mt-40">
            <div className="animate-marquee flex w-max">
              <div className="flex shrink-0 items-center">
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Discover</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Design</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Develop</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Deploy</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Refine</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Repeat</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
              </div>
              <div aria-hidden="true" className="flex shrink-0 items-center">
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Discover</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Design</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Develop</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Deploy</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Refine</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
                <span className="flex items-center">
                  <span className="display text-display-xl whitespace-nowrap">Repeat</span>
                  <span className="mx-[3vw] h-[0.08em] w-[6vw] bg-signal text-display-xl" />
                </span>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section data-footer-portal="" aria-labelledby="footer-portal-title" className="mt-24 md:mt-40">
            <div className="footer-portal__pin">
              <div className="footer-portal__scene shell border-t border-line py-14 text-center md:py-24">
                <p data-footer-portal-detail="" className="label mb-8 text-signal">HAVE AN IDEA?</p>
                <h2 id="footer-portal-title" aria-label="Let&#x27;s create what&#x27;s next." className="display text-display-xl">
                  <span data-footer-portal-copy="">Let's create </span>
                  <span aria-hidden="" data-footer-portal-copy="" className="portfolio-cta__illustration">
                    <img src="/images/illustrations/codingdesk.webp" alt="Illustration of Yadunand coding at a desk with a laptop, coffee, and a small robot" width="1254" height="1254" loading="lazy" decoding="async" />
                  </span>
                  <span className="block">
                    <span data-footer-portal-copy="">what's next</span>
                    <span data-footer-portal-glyph=""><span className="footer-portal__baseline" aria-hidden="true" />.</span>
                  </span>
                </h2>
                <div data-footer-portal-detail="" className="mt-10 flex flex-wrap justify-center gap-3 md:mt-14">
                  <a href="/contact#brief" className="btn btn-solid ">
                    <span className="roll">
                      <span data-text="Start a conversation">Start a conversation</span>
                    </span>
                    <span className="size-3.5 icon-slot"><Icon icon={ArrowUpRight01Icon} size={18} /></span>
                  </a>
                  <a href="#all-projects" className="btn ">
                    <span className="roll">
                      <span data-text="Explore my work">Explore my work</span>
                    </span>
                    <span className="size-3.5 icon-slot"><Icon icon={ArrowUpRight01Icon} size={18} /></span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SiteFrame>
  );
}
