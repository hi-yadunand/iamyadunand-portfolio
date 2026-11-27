import { SiteFrame } from "../site/site-frame";
import { pageMetadata } from "../site/metadata";

export const metadata = pageMetadata.privacy;

export default function PrivacyPage() {
  return (
    <SiteFrame page="privacy">
      <main>
        <section data-nav-intro="" className="shell pt-32 md:pt-40" style={{"paddingBottom": "6rem"}}>
          <p className="label">Yadunand Pavithran · Portfolio</p>
          <h1 className="display mt-6 text-display-lg">Privacy</h1>
          <div className="mt-10 max-w-2xl" style={{"overflowWrap": "anywhere"}}>
            <h2 className="display text-display-sm">Getting in touch</h2>
            <p className="mt-4 text-lg leading-[1.4] text-graphite">The contact link opens your email app. Information you choose to include in an email is shared with Yadunand Pavithran so I can respond to your enquiry.</p>
            <h2 className="display mt-10 text-display-sm">External services</h2>
            <p className="mt-4 text-lg leading-[1.4] text-graphite">Project and social links may take you to other websites. Those services handle information according to their own privacy policies.</p>
            <h2 className="display mt-10 text-display-sm">Questions</h2>
            <p className="mt-4 text-lg leading-[1.4] text-graphite">For questions about information shared through this portfolio, email <a href="mailto:yadunandpavithran05@gmail.com">yadunandpavithran05@gmail.com</a>.</p>
          </div>
        </section>
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
