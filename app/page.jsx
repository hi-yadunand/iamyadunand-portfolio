import Reveal from "../components/Reveal";
import { SiteFrame } from "./site/site-frame";
import { pageMetadata } from "./site/metadata";

export const metadata = pageMetadata.home;

export default function HomePage() {
  return (
    <SiteFrame page="home">
      <main>
        <div>
          <section className="helix-hero" data-helix-hero="" data-nav-intro="" data-dark="0:Infinity" aria-labelledby="home-title">
            <div className="helix-hero__stage">
              <div className="helix-hero__intro">
                <h1 className="helix-hero__title" id="home-title" aria-label="Hey, I’m Yadunand Pavithran">
                  <span className="helix-hero__line helix-hero__line--greeting" aria-hidden="true">
                    <span data-helix-letters="">Hey, I’m</span>
                    <img className="helix-hero__portrait" src="/images/profile/iamyadunandhero.webp" alt="" width="1537" height="1023" fetchPriority="high" decoding="async" />
                  </span>
                  <span className="helix-hero__line helix-hero__line--name" data-helix-letters="" aria-hidden="true">Yadunand</span>
                </h1>
              </div>
              <div className="helix-hero__view" aria-hidden="true">
                <div className="helix-hero__axis">
                  <div className="helix-hero__ribbon" data-helix-images="images/case-studies/karuvin.webp
                images/projects/codeandthrive.webp images/case-studies/lobiatek.webp
                images/case-studies/zappo.webp images/projects/startupgrow.webp
                images/case-studies/spakgen.webp images/case-studies/tenorra-labs.webp
                images/case-studies/zion-piling.webp" />
                </div>
              </div>
              <div className="helix-hero__footer shell">
                <p>Creating experiences through code.</p>
                <span className="helix-hero__hint" aria-hidden="true">Scroll to explore <span>↓</span></span>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section data-recent-work="" className="mt-24 md:mt-40">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3 ">
                <p className="flex gap-4">
                  <span className="text-signal">A–03</span>
                  <span>Selected projects</span>
                </p>
              </Reveal>
              <h2 className="display mt-10 text-display-xl md:mt-16">
                <span className="block" data-lines="">Recent work</span>
              </h2>
              <div className="mt-12 grid gap-x-6 gap-y-12 md:mt-20 md:grid-cols-12 md:gap-y-20">
                <div className="md:col-span-7">
                  <a href="https://zappoapp.com/" target="_blank" rel="noopener noreferrer" data-cursor-label="Visit" className="group block" data-project-entrance="left">
                    <div data-project-preview="" className="relative overflow-hidden bg-ink/5 aspect-[4/3]">
                      <div className="absolute inset-0 project-preview">
                        <img src="/images/projects/zappoapp.webp" alt="ZAPPO sports booking platform with venue discovery and player matching" width="1600" height="862" loading="lazy" decoding="async" />
                      </div>
                    </div>
                    <div className="project-card__caption mt-3 flex items-baseline justify-between gap-6 text-sm font-medium tracking-[-0.01em]">
                      <p className="project-card__name flex gap-4"><span className="label pt-0.5 text-signal">01</span>ZAPPO<svg className="project-card__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"> <path d="M4 12 12 4M5 4h7v7" /> </svg></p>
                      <p className="label shrink-0 text-graphite">Development · 2026</p>
                    </div>
                  </a>
                </div>
                <div className="md:col-span-4 md:col-start-9 md:mt-56">
                  <a href="https://codeandthrive.studio/" target="_blank" rel="noopener noreferrer" data-cursor-label="Visit" className="group block" data-project-entrance="right">
                    <div data-project-preview="" className="relative overflow-hidden bg-ink/5 aspect-[3/4]">
                      <div className="absolute inset-0 project-preview project-preview--studio">
                        <img src="/images/projects/codeandthrive.webp" alt="Code and Thrive digital product and growth studio website" width="1600" height="862" loading="lazy" decoding="async" />
                      </div>
                    </div>
                    <div className="project-card__caption mt-3 flex items-baseline justify-between gap-6 text-sm font-medium tracking-[-0.01em]">
                      <p className="project-card__name flex gap-4"><span className="label pt-0.5 text-signal">02</span>Code &amp; Thrive<svg className="project-card__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"> <path d="M4 12 12 4M5 4h7v7" /> </svg></p>
                      <p className="label shrink-0 text-graphite">Design &amp; Code · 2025</p>
                    </div>
                  </a>
                </div>
                <div className="md:col-span-4 md:col-start-2 md:-mt-16">
                  <a href="https://tarsx.space/" target="_blank" rel="noopener noreferrer" data-cursor-label="Visit" className="group block" data-project-entrance="up">
                    <div data-project-preview="" className="relative overflow-hidden bg-ink/5 aspect-[3/4]">
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
                    <div className="project-card__caption mt-3 flex items-baseline justify-between gap-6 text-sm font-medium tracking-[-0.01em]">
                      <p className="project-card__name flex gap-4"><span className="label pt-0.5 text-signal">03</span>TARSX Robot<svg className="project-card__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"> <path d="M4 12 12 4M5 4h7v7" /> </svg></p>
                      <p className="label shrink-0 text-graphite">Robotics · 2024</p>
                    </div>
                  </a>
                </div>
                <div className="md:col-span-6 md:col-start-7 md:mt-32">
                  <a href="https://startup-grow-sand.vercel.app/" target="_blank" rel="noopener noreferrer" data-cursor-label="Visit" className="group block" data-project-entrance="up">
                    <div data-project-preview="" className="relative overflow-hidden bg-ink/5 aspect-[16/11]">
                      <div className="absolute inset-0 project-preview project-preview--startup">
                        <img src="/images/projects/startupgrow.webp" alt="Startup Grow website preview with the headline Startup Growth Made Simple" width="1600" height="862" loading="lazy" decoding="async" />
                      </div>
                    </div>
                    <div className="project-card__caption mt-3 flex items-baseline justify-between gap-6 text-sm font-medium tracking-[-0.01em]">
                      <p className="project-card__name flex gap-4"><span className="label pt-0.5 text-signal">04</span>Startup Grow<svg className="project-card__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7" /></svg></p>
                      <p className="label shrink-0 text-graphite">Full Stack · 2026</p>
                    </div>
                  </a>
                </div>
              </div>
              <div data-reveal="" className="mt-14 flex justify-center md:mt-20">
                <a href="/projects" className="btn btn-solid ">
                  <span className="roll">
                    <span data-text="All projects">All projects</span>
                  </span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-3.5">
                    <path d="M4 12 12 4M5 4h7v7" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section className="mt-24 md:mt-40">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3 ">
                <p className="flex gap-4">
                  <span className="text-signal">A–02</span>
                  <span>About me</span>
                </p>
              </Reveal>
              <p data-wordfill="" className="mt-12 text-display-lg leading-[1] font-[450] tracking-[-0.04em] md:mt-20 md:indent-[16.66%]">I design and develop digital experiences with a focus on simplicity, interaction, and detail creating interfaces that feel as good as they look.</p>
              <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12">
                <div className="md:col-span-6 md:col-start-7">
                  <p data-reveal="" className="max-w-md text-base leading-[1.35] tracking-[-0.01em] text-graphite">I build end-to-end digital solutions, combining software engineering, AI integration, and problem-solving to turn complex ideas into practical applications.</p>
                  <div data-reveal="" className="mt-6">
                    <a href="/projects" className="btn">
                      <span className="roll">
                        <span data-text="Explore my work">Explore my work</span>
                      </span>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-3.5">
                        <path d="M4 12 12 4M5 4h7v7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section data-band="" data-band-reveal="0.7" data-dark="0.7:1" className="drone-band relative mt-24 md:mt-40" style={{"--text-display-2xl": "clamp(2.25rem, 10.5vw, 12rem)"}}>
            <h2 className="sr-only">I fly. I build. I explore.</h2>
            <div data-drone-services="" data-drone-band="" className="sticky top-0 h-svh overflow-hidden">
              <div data-drone-headline="" aria-hidden="true" className="display pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-display-2xl text-ink">
                <span data-band-a="" className="block">I fly. I build.</span>
                <span data-band-b="" className="block">I explore.</span>
              </div>
              <div data-band-window="" className="absolute inset-0 overflow-hidden bg-ink">
                <div data-band-media="" className="absolute inset-0 drone-band__backdrop">
                  <div className="drone-band__shadow" aria-hidden="true" />
                </div>
                <div data-drone-stage="" className="drone-band__stage" role="img" aria-label="Interactive 3D drone hovering in a charcoal studio, tilting as you move your pointer">
                  <canvas data-drone-canvas="" aria-hidden="true" />
                  <p className="drone-band__status" role="status">
                    <span className="drone-band__loading">Loading 3D drone…</span>
                    <span className="drone-band__error">3D view unavailable.</span>
                  </p>
                </div>
                <div data-drone-headline="" aria-hidden="true" className="display pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-display-2xl text-white">
                  <span data-band-a="" className="block">I fly. I build.</span>
                  <span data-band-b="" className="block">I explore.</span>
                </div>
                <p className="drone-band__caption">A different way to experience the sky / <span className="text-signal">AIRVON V1</span></p>
                <p className="drone-band__description">I build what I’m curious about robots, drones, digital experiences, and everything in between.</p>
              </div>
            </div>
          </section>
        </div>
        <div data-record-transition="">
          <section className="record-transition__outgoing mt-24 md:mt-40" data-swap="" aria-labelledby="code-thrive-highlight-title">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3">
                <p className="flex gap-4">
                  <span className="text-signal">A–05</span>
                  <span>Code and Thrive</span>
                </p>
              </Reveal>
              <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-7">
                  <h2 id="code-thrive-highlight-title" className="display mb-10 text-display-lg md:mb-16">
                    <span className="block" data-lines="">One studio.<br />Five ways to build.</span>
                  </h2>
                  <ul className="border-b border-line">
                    <li data-swap-row="" data-active="" className="group border-t border-line py-4 md:py-6">
                      <a href="https://codeandthrive.studio/services/website-development" target="_blank" rel="noopener noreferrer" className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3">
                        <span className="label text-signal">01</span>
                        <span className="display text-display-md transition-transform duration-700 ease-out-soft group-data-active:translate-x-3 lg:opacity-40 lg:transition lg:group-data-active:opacity-100">Websites</span>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-4 opacity-0 transition-opacity group-data-active:opacity-100">
                          <path d="M4 12 12 4M5 4h7v7" />
                        </svg>
                      </a>
                      <p className="mt-3 ml-[2.75rem] max-w-lg text-base leading-[1.35] tracking-[-0.01em] text-graphite lg:hidden"> Responsive websites and e-commerce experiences designed to turn visits into enquiries.</p>
                      <div className="code-thrive-highlight__frame relative mt-4 overflow-hidden lg:hidden">
                        <img src="/images/code-thrive/websites.webp" alt="Code and Thrive website development illustration with a laptop and website design" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                    </li>
                    <li data-swap-row="" className="group border-t border-line py-4 md:py-6">
                      <a href="https://codeandthrive.studio/services/web-application-development" target="_blank" rel="noopener noreferrer" className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3">
                        <span className="label text-signal">02</span>
                        <span className="display text-display-md transition-transform duration-700 ease-out-soft group-data-active:translate-x-3 lg:opacity-40 lg:transition lg:group-data-active:opacity-100">Digital Products</span>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-4 opacity-0 transition-opacity group-data-active:opacity-100">
                          <path d="M4 12 12 4M5 4h7v7" />
                        </svg>
                      </a>
                      <p className="mt-3 ml-[2.75rem] max-w-lg text-base leading-[1.35] tracking-[-0.01em] text-graphite lg:hidden"> Web apps, dashboards and mobile experiences built around the way people work.</p>
                      <div className="code-thrive-highlight__frame relative mt-4 overflow-hidden lg:hidden">
                        <img src="/images/code-thrive/digital-products.webp" alt="Code and Thrive web application illustration with product interfaces and dashboards" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                    </li>
                    <li data-swap-row="" className="group border-t border-line py-4 md:py-6">
                      <a href="https://codeandthrive.studio/services/brand-positioning" target="_blank" rel="noopener noreferrer" className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3">
                        <span className="label text-signal">03</span>
                        <span className="display text-display-md transition-transform duration-700 ease-out-soft group-data-active:translate-x-3 lg:opacity-40 lg:transition lg:group-data-active:opacity-100">Brand &amp; Design</span>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-4 opacity-0 transition-opacity group-data-active:opacity-100">
                          <path d="M4 12 12 4M5 4h7v7" />
                        </svg>
                      </a>
                      <p className="mt-3 ml-[2.75rem] max-w-lg text-base leading-[1.35] tracking-[-0.01em] text-graphite lg:hidden"> Brand strategy, visual identity and interfaces that make every touchpoint feel connected.</p>
                      <div className="code-thrive-highlight__frame relative mt-4 overflow-hidden lg:hidden">
                        <img src="/images/code-thrive/brand-design.webp" alt="Code and Thrive brand strategy, identity and guidelines illustration" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                    </li>
                    <li data-swap-row="" className="group border-t border-line py-4 md:py-6">
                      <a href="https://codeandthrive.studio/services/digital-marketing" target="_blank" rel="noopener noreferrer" className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3">
                        <span className="label text-signal">04</span>
                        <span className="display text-display-md transition-transform duration-700 ease-out-soft group-data-active:translate-x-3 lg:opacity-40 lg:transition lg:group-data-active:opacity-100">Digital Marketing</span>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-4 opacity-0 transition-opacity group-data-active:opacity-100">
                          <path d="M4 12 12 4M5 4h7v7" />
                        </svg>
                      </a>
                      <p className="mt-3 ml-[2.75rem] max-w-lg text-base leading-[1.35] tracking-[-0.01em] text-graphite lg:hidden"> Creative campaigns, paid media and content that connect brands with the right audiences.</p>
                      <div className="code-thrive-highlight__frame relative mt-4 overflow-hidden lg:hidden">
                        <img src="/images/code-thrive/digital-marketing.webp" alt="Code and Thrive digital marketing illustration with campaign and growth analytics" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                    </li>
                    <li data-swap-row="" className="group border-t border-line py-4 md:py-6">
                      <a href="https://codeandthrive.studio/services/lead-generation" target="_blank" rel="noopener noreferrer" className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3">
                        <span className="label text-signal">05</span>
                        <span className="display text-display-md transition-transform duration-700 ease-out-soft group-data-active:translate-x-3 lg:opacity-40 lg:transition lg:group-data-active:opacity-100">Growth &amp; SEO</span>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-4 opacity-0 transition-opacity group-data-active:opacity-100">
                          <path d="M4 12 12 4M5 4h7v7" />
                        </svg>
                      </a>
                      <p className="mt-3 ml-[2.75rem] max-w-lg text-base leading-[1.35] tracking-[-0.01em] text-graphite lg:hidden"> Search visibility, landing pages and conversion improvements that help businesses grow.</p>
                      <div className="code-thrive-highlight__frame relative mt-4 overflow-hidden lg:hidden">
                        <img src="/images/code-thrive/growth-seo.webp" alt="Code and Thrive lead generation and business growth illustration" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="relative hidden lg:col-span-4 lg:col-start-9 lg:block">
                  <div className="sticky top-24">
                    <div className="code-thrive-highlight__frame stack relative overflow-hidden">
                      <div data-swap-img="" data-active="" className="absolute inset-0">
                        <img src="/images/code-thrive/websites.webp" alt="Code and Thrive website development illustration with a laptop and website design" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                      <div data-swap-img="" className="absolute inset-0">
                        <img src="/images/code-thrive/digital-products.webp" alt="Code and Thrive web application illustration with product interfaces and dashboards" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                      <div data-swap-img="" className="absolute inset-0">
                        <img src="/images/code-thrive/brand-design.webp" alt="Code and Thrive brand strategy, identity and guidelines illustration" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                      <div data-swap-img="" className="absolute inset-0">
                        <img src="/images/code-thrive/digital-marketing.webp" alt="Code and Thrive digital marketing illustration with campaign and growth analytics" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                      <div data-swap-img="" className="absolute inset-0">
                        <img src="/images/code-thrive/growth-seo.webp" alt="Code and Thrive lead generation and business growth illustration" width="1200" height="800" loading="lazy" decoding="async" className="code-thrive-highlight__image" />
                      </div>
                    </div>
                    <div className="stack relative mt-4 min-h-24">
                      <p data-swap-caption="" data-active="" className="absolute inset-0 text-base leading-[1.35] tracking-[-0.01em] text-graphite">Responsive websites and e-commerce experiences designed to turn visits into enquiries.</p>
                      <p data-swap-caption="" className="absolute inset-0 text-base leading-[1.35] tracking-[-0.01em] text-graphite">Web apps, dashboards and mobile experiences built around the way people work.</p>
                      <p data-swap-caption="" className="absolute inset-0 text-base leading-[1.35] tracking-[-0.01em] text-graphite">Brand strategy, visual identity and interfaces that make every touchpoint feel connected.</p>
                      <p data-swap-caption="" className="absolute inset-0 text-base leading-[1.35] tracking-[-0.01em] text-graphite">Creative campaigns, paid media and content that connect brands with the right audiences.</p>
                      <p data-swap-caption="" className="absolute inset-0 text-base leading-[1.35] tracking-[-0.01em] text-graphite">Search visibility, landing pages and conversion improvements that help businesses grow.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="record-transition__incoming">
            <section data-dark="" data-record-parallax="" className="mt-24 bg-ink py-16 text-paper md:mt-40 md:py-24">
              <div className="shell">
                <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3 ">
                  <p className="flex gap-4">
                    <span className="text-signal">A–06</span>
                    <span>The record</span>
                  </p>
                </Reveal>
                <h2 className="display mt-10 max-w-[18ch] text-display-lg md:mt-14">
                  <span className="block" data-lines="">Building ideas into digital experiences.</span>
                </h2>
                <dl className="mt-12 grid grid-cols-2 border-t border-l border-line-light md:mt-20 lg:grid-cols-4">
                  <div data-reveal="" className="group relative flex aspect-square flex-col justify-between overflow-hidden border-r border-b border-line-light p-3 md:p-5 lg:aspect-[5/6]">
                    <div className="absolute inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-900 ease-draft group-hover:[clip-path:inset(0)]">
                      <img src="/images/stats/years-building.webp" alt="" aria-hidden="true" width="960" height="1200" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover scale-110 transition-transform duration-[1.6s] ease-out-soft group-hover:scale-100" />
                      <div className="absolute inset-0 bg-ink/35" />
                    </div>
                    <dt className="label relative order-2 text-paper/60 transition-colors duration-500 group-hover:text-paper"> Years building</dt>
                    <dd className="display relative order-1 text-display-lg tabular-nums">0<span data-count="3">3</span>+</dd>
                  </div>
                  <div data-reveal="" className="group relative flex aspect-square flex-col justify-between overflow-hidden border-r border-b border-line-light p-3 md:p-5 lg:aspect-[5/6]">
                    <div className="absolute inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-900 ease-draft group-hover:[clip-path:inset(0)]">
                      <img src="/images/stats/projects-builds.webp" alt="" aria-hidden="true" width="960" height="1200" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover scale-110 transition-transform duration-[1.6s] ease-out-soft group-hover:scale-100" />
                      <div className="absolute inset-0 bg-ink/35" />
                    </div>
                    <dt className="label relative order-2 text-paper/60 transition-colors duration-500 group-hover:text-paper"> Projects &amp; builds</dt>
                    <dd className="display relative order-1 text-display-lg tabular-nums"><span data-count="10">10</span>+</dd>
                  </div>
                  <div data-reveal="" className="group relative flex aspect-square flex-col justify-between overflow-hidden border-r border-b border-line-light p-3 md:p-5 lg:aspect-[5/6]">
                    <div className="absolute inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-900 ease-draft group-hover:[clip-path:inset(0)]">
                      <img src="/images/stats/global-clients.webp" alt="" aria-hidden="true" width="960" height="1200" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover scale-110 transition-transform duration-[1.6s] ease-out-soft group-hover:scale-100" />
                      <div className="absolute inset-0 bg-ink/35" />
                    </div>
                    <dt className="label relative order-2 text-paper/60 transition-colors duration-500 group-hover:text-paper"> Global clients</dt>
                    <dd className="display relative order-1 text-display-lg tabular-nums">0<span data-count="5">5</span>+</dd>
                  </div>
                  <div data-reveal="" className="group relative flex aspect-square flex-col justify-between overflow-hidden border-r border-b border-line-light p-3 md:p-5 lg:aspect-[5/6]">
                    <div className="absolute inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-900 ease-draft group-hover:[clip-path:inset(0)]">
                      <img src="/images/stats/areas-expertise.webp" alt="" aria-hidden="true" width="960" height="1200" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover scale-110 transition-transform duration-[1.6s] ease-out-soft group-hover:scale-100" />
                      <div className="absolute inset-0 bg-ink/35" />
                    </div>
                    <dt className="label relative order-2 text-paper/60 transition-colors duration-500 group-hover:text-paper"> Areas of expertise</dt>
                    <dd className="display relative order-1 text-display-lg tabular-nums">0<span data-count="4">4</span></dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>
        </div>
        <div>
          <section className="works-register mt-20 md:mt-32" aria-labelledby="register-title">
            <div className="shell">
              <div className="works-register__meta label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3">
                <p className="flex gap-4">
                  <span className="text-signal">A–08</span>
                  <span>The register</span>
                </p>
              </div>
              <div className="works-wheel" data-works-wheel="">
                <div className="works-wheel__body">
                  <div className="works-wheel__viewport" data-wheel-viewport="">
                    <h2 id="register-title" className="works-wheel__heading display text-display-lg">Selected work, in order</h2>
                    <ol className="works-wheel__cards" data-wheel-cards="">
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/case-studies/zappo-sports-booking-app" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-01">
                          <img src="/images/case-studies/zappo.webp" alt="Zappo sports booking mobile app displayed on smartphone mockups featuring venue discovery, match joining and sports venue booking." width="720" height="480" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">01</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-01" data-wheel-name="">Zappo</span>
                            <span className="works-wheel__meta" data-wheel-meta="">India · Website · 2026</span>
                          </span>
                        </a>
                      </li>
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/case-studies/tenorra-labs-consumer-products-website" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-02">
                          <img src="/images/case-studies/tenorra-labs.webp" alt="Tenorra Labs Private Limited corporate website showcasing consumer technology innovation, Zappo and sports-focused digital products." width="720" height="480" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">02</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-02" data-wheel-name="">Tenorra Labs</span>
                            <span className="works-wheel__meta" data-wheel-meta="">India · Software Engineer Intern · 2024</span>
                          </span>
                        </a>
                      </li>
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-03">
                          <img src="/images/projects/codeandthrive.webp" alt="Code and Thrive digital product and growth studio website" width="1600" height="862" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">03</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-03" data-wheel-name="">Code and Thrive</span>
                            <span className="works-wheel__meta" data-wheel-meta="">India · Developer and Designer · 2025</span>
                          </span>
                        </a>
                      </li>
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/case-studies/btpc4e-xelerator-enterprise-website-ai-redesign" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-04">
                          <img src="/images/case-studies/btpc4e.webp" alt="A Refined Enterprise Digital Experience for BTPC4E" width="720" height="480" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">04</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-04" data-wheel-name="">BTPC4E Xelerator</span>
                            <span className="works-wheel__meta" data-wheel-meta="">USA · Website · 2026</span>
                          </span>
                        </a>
                      </li>
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/case-studies/zion-piling-website-crm-digital-marketing" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-05">
                          <img src="/images/case-studies/zion-piling.webp" alt="Zion Piling website and CRM showcasing piling services, foundation construction, customer enquiries and project management." width="720" height="480" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">05</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-05" data-wheel-name="">Zion Piling</span>
                            <span className="works-wheel__meta" data-wheel-meta="">India · Website · 2026</span>
                          </span>
                        </a>
                      </li>
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/case-studies/karuvin-builds-a-stronger-digital-presence" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-06">
                          <img src="/images/case-studies/karuvin.webp" alt="Karuvin Singapore mechanical and electrical services website featuring M&amp;E maintenance, installation and business support services." width="720" height="480" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">06</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-06" data-wheel-name="">Karuvin</span>
                            <span className="works-wheel__meta" data-wheel-meta="">Singapore · Website · 2025</span>
                          </span>
                        </a>
                      </li>
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/case-studies/lobiatek-technology-solutions-website" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-07">
                          <img src="/images/case-studies/lobiatek.webp" alt="Lobiatek Dubai technology solutions website showcasing CCTV, access control, networking, fire safety and GPS services." width="720" height="480" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">07</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-07" data-wheel-name="">Lobiatek</span>
                            <span className="works-wheel__meta" data-wheel-meta="">Dubai · Website · 2025</span>
                          </span>
                        </a>
                      </li>
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/case-studies/a1-finish-painting-website" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-08">
                          <img src="/images/case-studies/a1-finish-painting.webp" alt="A1 Finish Painting Australia website showcasing residential and commercial painting services." width="720" height="480" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">08</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-08" data-wheel-name="">A1 Finish Painting</span>
                            <span className="works-wheel__meta" data-wheel-meta="">Australia · Website · 2024</span>
                          </span>
                        </a>
                      </li>
                      <li data-wheel-card="">
                        <a className="works-wheel__card" href="https://codeandthrive.studio/case-studies/spakgen-cleaning-services-website-development" target="_blank" rel="noopener noreferrer" aria-labelledby="register-project-09">
                          <img src="/images/case-studies/spakgen.webp" alt="Spakgen professional cleaning services website featuring blue and yellow branding and cleaning service imagery." width="720" height="480" loading="lazy" decoding="async" draggable="false" />
                          <span className="label works-wheel__card-number" aria-hidden="true">09</span>
                          <span className="works-wheel__card-info">
                            <span id="register-project-09" data-wheel-name="">Spakgen</span>
                            <span className="works-wheel__meta" data-wheel-meta="">Singapore · Website · 2023</span>
                          </span>
                        </a>
                      </li>
                    </ol>
                  </div>
                  <div className="works-wheel__info">
                    <div className="works-wheel__details" data-wheel-details="" aria-live="polite" aria-atomic="true" hidden>
                      <p data-wheel-current="" />
                      <p className="works-wheel__meta" data-wheel-current-meta="" />
                    </div>
                    <ol className="works-wheel__index" data-wheel-index="" hidden />
                  </div>
                </div>
                <p id="register-instructions" className="sr-only">Use the arrow keys or choose a project from the index.</p>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section aria-labelledby="workflow-title" className="mt-24 md:mt-40">
            <div className="shell">
              <Reveal delay={0.1} className="label flex items-baseline justify-between gap-6 border-t border-current/20 pt-3 ">
                <p className="flex gap-4">
                  <span className="text-signal">A–07</span>
                  <span>How I work</span>
                </p>
              </Reveal>
              <h2 id="workflow-title" className="display mt-10 max-w-[16ch] text-display-xl md:mt-16">
                <span className="block" data-lines="">From an idea<br />to launch.</span>
              </h2>
              <div className="workflow mt-12 md:mt-20" data-workflow="">
                <svg className="workflow__stroke" viewBox="0 0 128 1200" width="128" height="1200" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
                  <path data-workflow-path="" pathLength="1" strokeDasharray="1 1" strokeDashoffset="0" strokeLinecap="round" strokeLinejoin="round" d="M55 15 C105 18 106 69 68 70 C25 71 23 30 55 30 C79 30 88 63 86 97 C84 161 43 174 43 242 S85 332 85 406 S43 494 43 568 S85 653 85 730 S43 815 43 892 S85 982 85 1054 S64 1129 64 1185" />
                </svg>
                <ol className="workflow__steps">
                  <li className="workflow__step">
                    <p className="label text-signal">01</p>
                    <h3 className="display mt-3 text-display-md">Discover</h3>
                    <p className="mt-4 max-w-md text-lg leading-[1.3] tracking-[-0.015em] text-graphite">I start by understanding your goals, audience, and what your product needs to do. Together, we define the scope, priorities, and experience we want to create.</p>
                  </li>
                  <li className="workflow__step">
                    <p className="label text-signal">02</p>
                    <h3 className="display mt-3 text-display-md">Design</h3>
                    <p className="mt-4 max-w-md text-lg leading-[1.3] tracking-[-0.015em] text-graphite">I turn the brief into user flows, wireframes, and prototypes. Layout, typography, and visual identity come together before I move into development.</p>
                  </li>
                  <li className="workflow__step">
                    <p className="label text-signal">03</p>
                    <h3 className="display mt-3 text-display-md">Develop</h3>
                    <p className="mt-4 max-w-md text-lg leading-[1.3] tracking-[-0.015em] text-graphite">I build responsive websites and web applications with reusable interfaces and the integrations they need. Each interaction is shaped around how people will use the product.</p>
                  </li>
                  <li className="workflow__step">
                    <p className="label text-signal">04</p>
                    <h3 className="display mt-3 text-display-md">Deploy</h3>
                    <p className="mt-4 max-w-md text-lg leading-[1.3] tracking-[-0.015em] text-graphite">I test the experience across screen sizes, check the details, and prepare it for launch. Performance, accessibility, and SEO foundations are part of the process.</p>
                  </li>
                  <li className="workflow__step">
                    <p className="label text-signal">05</p>
                    <h3 className="display mt-3 text-display-md">Refine &amp; Repeat</h3>
                    <p className="mt-4 max-w-md text-lg leading-[1.3] tracking-[-0.015em] text-graphite">After launch, I use feedback to improve the experience and plan the next iteration. I keep refining the product as new needs and ideas take shape.</p>
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </div>
        <div>
          <section data-testimonial-marquee="" aria-labelledby="project-notes-heading" className="mt-24 md:mt-40">
            <div className="shell">
              <Reveal delay={0.1} className="label border-t border-current/20 pt-3">
                <h2 id="project-notes-heading" className="flex gap-4">
                  <span className="text-signal">A–09</span>
                  <span>Project notes</span>
                </h2>
              </Reveal>
              <div className="testimonial-marquee__rows mt-10 md:mt-16">
                <div className="testimonial-marquee__row">
                  <div className="testimonial-marquee__track">
                    <div className="testimonial-marquee__group">
                      <figure className="testimonial-marquee__card">
                        <figcaption>
                          <img src="/images/case-studies/zappo.webp" alt="Zappo sports booking app" width="720" height="480" loading="lazy" decoding="async" />
                          <div>
                            <strong>Zappo</strong>
                            <span>React.js · REST APIs</span>
                          </div>
                        </figcaption>
                        <p>A responsive sports booking platform, bringing venue discovery, slot booking, and real-time availability into one experience.</p>
                      </figure>
                      <figure className="testimonial-marquee__card">
                        <figcaption>
                          <img src="/images/projects/codeandthrive.webp" alt="Code and Thrive website" width="720" height="480" loading="lazy" decoding="async" />
                          <div>
                            <strong>Code and Thrive</strong>
                            <span>Design · Development</span>
                          </div>
                        </figcaption>
                        <p>Web development, UI/UX design, branding, and SEO brought together to build a connected digital presence.</p>
                      </figure>
                      <figure className="testimonial-marquee__card">
                        <figcaption>
                          <img src="/images/case-studies/tenorra-labs.webp" alt="Tenorra Labs website shown on a laptop and phone" width="720" height="480" loading="lazy" decoding="async" />
                          <div>
                            <strong>Tenorra Labs</strong>
                            <span>Website · 2024</span>
                          </div>
                        </figcaption>
                        <p>A corporate website showcasing Tenorra Labs’ consumer technology work, including Zappo and its sports-focused digital products.</p>
                      </figure>
                      <figure className="testimonial-marquee__card">
                        <figcaption>
                          <img src="/images/case-studies/zion-piling.webp" alt="Zion Piling website and CRM" width="720" height="480" loading="lazy" decoding="async" />
                          <div>
                            <strong>Zion Piling</strong>
                            <span>Website · CRM · 2026</span>
                          </div>
                        </figcaption>
                        <p>A website for piling and foundation services, paired with a CRM for managing customer enquiries and projects.</p>
                      </figure>
                    </div>
                  </div>
                </div>
                <div className="testimonial-marquee__row">
                  <div className="testimonial-marquee__track">
                    <div className="testimonial-marquee__group">
                      <figure className="testimonial-marquee__card">
                        <figcaption>
                          <img src="/images/services/frontend-engineering.webp" alt="TARSX robot" width="720" height="480" loading="lazy" decoding="async" />
                          <div>
                            <strong>TARSX Robot</strong>
                            <span>Raspberry Pi · Python · AI</span>
                          </div>
                        </figcaption>
                        <p>A real-life TARS-inspired robot, combining custom hardware, embedded systems, and conversational AI.</p>
                      </figure>
                      <figure className="testimonial-marquee__card">
                        <figcaption>
                          <img src="/images/projects/startupgrow-lossless.webp" alt="Startup Grow project" width="720" height="480" loading="lazy" decoding="async" />
                          <div>
                            <strong>Startup Grow</strong>
                            <span>Full-stack development</span>
                          </div>
                        </figcaption>
                        <p>Turning ideas into practical web applications through design, development, and iteration.</p>
                      </figure>
                      <figure className="testimonial-marquee__card">
                        <figcaption>
                          <img src="/images/case-studies/lobiatek.webp" alt="Lobiatek technology services website" width="720" height="480" loading="lazy" decoding="async" />
                          <div>
                            <strong>Lobiatek</strong>
                            <span>Website · 2025</span>
                          </div>
                        </figcaption>
                        <p>A website for a Dubai technology provider, covering CCTV, access control, networking, fire safety, and GPS services.</p>
                      </figure>
                      <figure className="testimonial-marquee__card">
                        <figcaption>
                          <img src="/images/case-studies/spakgen.webp" alt="Spakgen cleaning services website" width="720" height="480" loading="lazy" decoding="async" />
                          <div>
                            <strong>Spakgen</strong>
                            <span>Website · 2023</span>
                          </div>
                        </figcaption>
                        <p>A website presenting Spakgen’s professional cleaning services in Singapore, with its blue and yellow branding.</p>
                      </figure>
                    </div>
                  </div>
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
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-3.5">
                      <path d="M4 12 12 4M5 4h7v7" />
                    </svg>
                  </a>
                  <a href="/projects" className="btn ">
                    <span className="roll">
                      <span data-text="Explore my work">Explore my work</span>
                    </span>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="size-3.5">
                      <path d="M4 12 12 4M5 4h7v7" />
                    </svg>
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
