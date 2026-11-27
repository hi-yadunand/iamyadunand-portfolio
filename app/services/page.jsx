import { Add01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import Icon from "../../components/Icon";
import Reveal from "../../components/Reveal";
import { SiteFrame } from "../site/site-frame";
import { pageMetadata } from "../site/metadata";

export const metadata = pageMetadata.services;

export default function ServicesPage() {
  return (
    <SiteFrame page="services">
      <main>
        <div>
          <section data-nav-intro="" className="pt-28 md:pt-36">
            <div className="shell">
              <h1 className="display text-display-2xl">
                <span className="block" data-lines="load">What I do</span>
              </h1>
              <div data-load="" className="mt-8 grid gap-4 border-t border-line pt-3 md:mt-12 md:grid-cols-12">
                <p className="label md:col-span-6">Services</p>
                <p className="max-w-xl text-lg leading-[1.25] tracking-[-0.02em] md:col-span-6 md:text-xl">I help bring ideas to life through product and UI/UX design, web development, frontend engineering, branding, and SEO.</p>
              </div>
            </div>
            <div className="mt-10 md:mt-16">
              <div data-clip="" className="relative aspect-[4/3] overflow-hidden bg-ink/5 md:aspect-[21/9]">
                <div data-parallax="8" className="absolute inset-0">
                  <img src="/images/illustrations/letscode.jpg" sizes="100vw" alt="Person working at a laptop under purple lighting" width="3000" height="1816" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover " />
                </div>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section className="mt-24 md:mt-40" aria-labelledby="services-title">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3">
                <p className="flex gap-4">
                  <span className="text-signal">A–02</span>
                  <span id="services-title">Five services</span>
                </p>
              </Reveal>
              <div className="service-cards mt-10 md:mt-14">
                <Reveal className="service-card" data-open="">
                  <h2>
                    <button type="button" className="service-card__button" id="service-title-1" aria-expanded="true" aria-controls="service-panel-1">
                      <span className="label text-signal">01</span>
                      <span className="display service-card__title">Product &amp; UI/UX Design</span>
                      <span className="service-card__toggle" aria-hidden="true">
                        <span className="fold-icon icon-slot"><Icon icon={Add01Icon} size={18} /></span>
                      </span>
                    </button>
                  </h2>
                  <div id="service-panel-1" className="fold" role="region" aria-labelledby="service-title-1">
                    <div>
                      <div className="service-card__content">
                        <p>Product design, wireframes, and prototyping that turn ideas into clear, usable digital experiences.</p>
                        <ul className="service-card__features">
                          <li>Product design</li>
                          <li>User flows and wireframes</li>
                          <li>Interactive prototyping</li>
                          <li>UI/UX design</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={1 * 0.08} className="service-card">
                  <h2>
                    <button type="button" className="service-card__button" id="service-title-2" aria-expanded="false" aria-controls="service-panel-2">
                      <span className="label text-signal">02</span>
                      <span className="display service-card__title">Web Development</span>
                      <span className="service-card__toggle" aria-hidden="true">
                        <span className="fold-icon icon-slot"><Icon icon={Add01Icon} size={18} /></span>
                      </span>
                    </button>
                  </h2>
                  <div id="service-panel-2" className="fold" role="region" aria-labelledby="service-title-2">
                    <div>
                      <div className="service-card__content">
                        <p>Full-stack and responsive websites built around your content, customers, and business goals.</p>
                        <ul className="service-card__features">
                          <li>Full-stack development</li>
                          <li>Responsive websites</li>
                          <li>REST API integration</li>
                          <li>Testing and deployment</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={2 * 0.08} className="service-card">
                  <h2>
                    <button type="button" className="service-card__button" id="service-title-3" aria-expanded="false" aria-controls="service-panel-3">
                      <span className="label text-signal">03</span>
                      <span className="display service-card__title">Frontend Engineering</span>
                      <span className="service-card__toggle" aria-hidden="true">
                        <span className="fold-icon icon-slot"><Icon icon={Add01Icon} size={18} /></span>
                      </span>
                    </button>
                  </h2>
                  <div id="service-panel-3" className="fold" role="region" aria-labelledby="service-title-3">
                    <div>
                      <div className="service-card__content">
                        <p>React and interactive interfaces, with reusable components and attention to detail across screen sizes.</p>
                        <ul className="service-card__features">
                          <li>React interfaces</li>
                          <li>Reusable components</li>
                          <li>Interactive experiences</li>
                          <li>Responsive implementation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={3 * 0.08} className="service-card">
                  <h2>
                    <button type="button" className="service-card__button" id="service-title-4" aria-expanded="false" aria-controls="service-panel-4">
                      <span className="label text-signal">04</span>
                      <span className="display service-card__title">Branding &amp; Visual Identity</span>
                      <span className="service-card__toggle" aria-hidden="true">
                        <span className="fold-icon icon-slot"><Icon icon={Add01Icon} size={18} /></span>
                      </span>
                    </button>
                  </h2>
                  <div id="service-panel-4" className="fold" role="region" aria-labelledby="service-title-4">
                    <div>
                      <div className="service-card__content">
                        <p>Brand identity and visual design that keep your website, product, and marketing materials consistent.</p>
                        <ul className="service-card__features">
                          <li>Brand identity</li>
                          <li>Visual design</li>
                          <li>Typography and colour</li>
                          <li>Brand guidelines</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={4 * 0.08} className="service-card">
                  <h2>
                    <button type="button" className="service-card__button" id="service-title-5" aria-expanded="false" aria-controls="service-panel-5">
                      <span className="label text-signal">05</span>
                      <span className="display service-card__title">Growth &amp; SEO</span>
                      <span className="service-card__toggle" aria-hidden="true">
                        <span className="fold-icon icon-slot"><Icon icon={Add01Icon} size={18} /></span>
                      </span>
                    </button>
                  </h2>
                  <div id="service-panel-5" className="fold" role="region" aria-labelledby="service-title-5">
                    <div>
                      <div className="service-card__content">
                        <p>SEO optimization and digital growth through clear site structure, useful content, and better discovery.</p>
                        <ul className="service-card__features">
                          <li>On-page SEO</li>
                          <li>Technical SEO foundations</li>
                          <li>Landing page optimization</li>
                          <li>Digital growth strategy</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section data-process="" className="mt-24 md:mt-40">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3 ">
                <p className="flex gap-4">
                  <span className="text-signal">A–03</span>
                  <span>Stages</span>
                </p>
              </Reveal>
              <h2 className="display mt-10 max-w-[16ch] text-display-xl md:mt-16">
                <span className="block" data-lines="">How a project runs</span>
              </h2>
              <div className="mt-12 grid gap-6 md:mt-20 lg:grid-cols-12">
                <div className="hidden lg:col-span-6 lg:block">
                  <div className="sticky top-20 flex h-[calc(100svh-7rem)] gap-6">
                    <div aria-hidden="" className="h-[1em] overflow-hidden text-[clamp(5rem,9vw,10rem)] leading-none font-[450] tracking-[-0.05em] tabular-nums">
                      <div data-process-numeral="">
                        <div className="h-[1em]">01</div>
                        <div className="h-[1em]">02</div>
                        <div className="h-[1em]">03</div>
                      </div>
                    </div>
                    <div className="stack relative flex-1 overflow-hidden bg-ink/5">
                      <div data-process-img="" data-active="" className="absolute inset-0">
                        <img src="/images/workflow/discover.webp" sizes="33vw" alt="Original discovery study with connected research notes and an orange focal point" width="1122" height="1402" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover " />
                      </div>
                      <div data-process-img="" className="absolute inset-0">
                        <img src="/images/workflow/develop.webp" sizes="33vw" alt="Original development study with interlocking modules and an orange connection" width="1122" height="1402" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover " />
                      </div>
                      <div data-process-img="" className="absolute inset-0">
                        <img src="/images/workflow/refine.webp" sizes="33vw" alt="Original refinement study with a continuous orange feedback loop" width="1122" height="1402" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover " />
                      </div>
                    </div>
                  </div>
                </div>
                <ol className="lg:col-span-5 lg:col-start-8">
                  <li data-process-step="" data-active="" className="border-t border-line py-8 lg:flex lg:min-h-[70svh] lg:flex-col lg:justify-center lg:border-0 lg:py-0">
                    <p className="label text-signal lg:hidden">01</p>
                    <h3 className="display mt-3 text-display-md lg:mt-0">Discover &amp; plan</h3>
                    <p className="mt-4 max-w-md text-lg leading-[1.3] tracking-[-0.015em] text-graphite">I start with your goals, audience, and existing product or website. Together we define the scope, priorities, and what the finished project needs to achieve.</p>
                    <div className="relative mt-6 aspect-[4/3] overflow-hidden lg:hidden">
                      <img src="/images/workflow/discover.webp" sizes="100vw" alt="Original discovery study with connected research notes and an orange focal point" width="1122" height="1402" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover " />
                    </div>
                  </li>
                  <li data-process-step="" className="border-t border-line py-8 lg:flex lg:min-h-[70svh] lg:flex-col lg:justify-center lg:border-0 lg:py-0">
                    <p className="label text-signal lg:hidden">02</p>
                    <h3 className="display mt-3 text-display-md lg:mt-0">Design &amp; develop</h3>
                    <p className="mt-4 max-w-md text-lg leading-[1.3] tracking-[-0.015em] text-graphite">Wireframes and prototypes shape the experience before I build responsive interfaces and connect the features your project needs. You can review progress as the work develops.</p>
                    <div className="relative mt-6 aspect-[4/3] overflow-hidden lg:hidden">
                      <img src="/images/workflow/develop.webp" sizes="100vw" alt="Original development study with interlocking modules and an orange connection" width="1122" height="1402" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover " />
                    </div>
                  </li>
                  <li data-process-step="" className="border-t border-line py-8 lg:flex lg:min-h-[70svh] lg:flex-col lg:justify-center lg:border-0 lg:py-0">
                    <p className="label text-signal lg:hidden">03</p>
                    <h3 className="display mt-3 text-display-md lg:mt-0">Deploy &amp; refine</h3>
                    <p className="mt-4 max-w-md text-lg leading-[1.3] tracking-[-0.015em] text-graphite">I test the experience across screen sizes, prepare it for launch, and refine the details based on feedback. SEO foundations and a clear handover help you keep moving after launch.</p>
                    <div className="relative mt-6 aspect-[4/3] overflow-hidden lg:hidden">
                      <img src="/images/workflow/refine.webp" sizes="100vw" alt="Original refinement study with a continuous orange feedback loop" width="1122" height="1402" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover " />
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section className="mt-24 md:mt-40">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3 ">
                <p className="flex gap-4">
                  <span className="text-signal">A–04</span>
                  <span>Questions</span>
                </p>
              </Reveal>
              <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-5">
                  <h2 className="display text-display-lg lg:sticky lg:top-24">
                    <span className="block" data-lines="">Before<br />you ask</span>
                  </h2>
                </div>
                <div className="border-b border-line lg:col-span-6 lg:col-start-7">
                  <Reveal data-accordion="" className="border-t border-line">
                    <button type="button" data-accordion-btn="" aria-expanded="false" className="flex w-full items-baseline justify-between gap-6 py-4 text-left text-xl font-[450] tracking-[-0.025em]">What can you help me with?<span className="fold-icon size-4 shrink-0 transition-transform duration-500 icon-slot"><Icon icon={Add01Icon} size={18} /></span></button>
                    <div className="fold">
                      <div>
                        <p className="max-w-xl pb-6 text-base leading-[1.4] tracking-[-0.01em] text-graphite">I offer product and UI/UX design, web development, frontend engineering, branding and visual identity, and growth and SEO. These can be combined or scoped around a specific need.</p>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={1 * 0.08} data-accordion="" className="border-t border-line">
                    <button type="button" data-accordion-btn="" aria-expanded="false" className="flex w-full items-baseline justify-between gap-6 py-4 text-left text-xl font-[450] tracking-[-0.025em]">Can you work on an existing website or product?<span className="fold-icon size-4 shrink-0 transition-transform duration-500 icon-slot"><Icon icon={Add01Icon} size={18} /></span></button>
                    <div className="fold">
                      <div>
                        <p className="max-w-xl pb-6 text-base leading-[1.4] tracking-[-0.01em] text-graphite">I can help improve an existing website, refresh an interface, or develop a new product. Share what you have and the areas you want to improve.</p>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={2 * 0.08} data-accordion="" className="border-t border-line">
                    <button type="button" data-accordion-btn="" aria-expanded="false" className="flex w-full items-baseline justify-between gap-6 py-4 text-left text-xl font-[450] tracking-[-0.025em]">Can design and development be part of one project?<span className="fold-icon size-4 shrink-0 transition-transform duration-500 icon-slot"><Icon icon={Add01Icon} size={18} /></span></button>
                    <div className="fold">
                      <div>
                        <p className="max-w-xl pb-6 text-base leading-[1.4] tracking-[-0.01em] text-graphite">Yes. Product and UI/UX design, frontend engineering, and full-stack development can be brought together so the experience stays consistent from prototype to implementation.</p>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={3 * 0.08} data-accordion="" className="border-t border-line">
                    <button type="button" data-accordion-btn="" aria-expanded="false" className="flex w-full items-baseline justify-between gap-6 py-4 text-left text-xl font-[450] tracking-[-0.025em]">Can branding and SEO be included?<span className="fold-icon size-4 shrink-0 transition-transform duration-500 icon-slot"><Icon icon={Add01Icon} size={18} /></span></button>
                    <div className="fold">
                      <div>
                        <p className="max-w-xl pb-6 text-base leading-[1.4] tracking-[-0.01em] text-graphite">Yes. Brand identity, visual design, and SEO can be scoped alongside your website or product so the work supports a consistent presence.</p>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={4 * 0.08} data-accordion="" className="border-t border-line">
                    <button type="button" data-accordion-btn="" aria-expanded="false" className="flex w-full items-baseline justify-between gap-6 py-4 text-left text-xl font-[450] tracking-[-0.025em]">How do I get started?<span className="fold-icon size-4 shrink-0 transition-transform duration-500 icon-slot"><Icon icon={Add01Icon} size={18} /></span></button>
                    <div className="fold">
                      <div>
                        <p className="max-w-xl pb-6 text-base leading-[1.4] tracking-[-0.01em] text-graphite">Send me an overview of your idea, your goals, and any existing content or references. I can then discuss the scope and the next steps with you.</p>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={5 * 0.08} data-accordion="" className="border-t border-line">
                    <button type="button" data-accordion-btn="" aria-expanded="false" className="flex w-full items-baseline justify-between gap-6 py-4 text-left text-xl font-[450] tracking-[-0.025em]">How long will my project take?<span className="fold-icon size-4 shrink-0 transition-transform duration-500 icon-slot"><Icon icon={Add01Icon} size={18} /></span></button>
                    <div className="fold">
                      <div>
                        <p className="max-w-xl pb-6 text-base leading-[1.4] tracking-[-0.01em] text-graphite">The timeline depends on the scope, content, and features. We can agree on milestones once the requirements are clear.</p>
                      </div>
                    </div>
                  </Reveal>
                </div>
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
                  <a href="/projects" className="btn ">
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
