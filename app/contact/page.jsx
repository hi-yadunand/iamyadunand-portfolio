import { ArrowDown01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import Icon from "../../components/Icon";
import Reveal from "../../components/Reveal";
import { SiteFrame } from "../site/site-frame";
import { pageMetadata } from "../site/metadata";

export const metadata = pageMetadata.contact;

export default function ContactPage() {
  return (
    <SiteFrame page="contact">
      <main data-dark="" className="contact-page">
        <div data-gradient-ascii="" className="gradient-ascii-container" aria-hidden="true">
          <canvas className="gradient-ascii-canvas" />
        </div>
        <section className="contact-layout" aria-labelledby="contact-heading">
          <Reveal data-nav-intro="" className="contact-intro">
            <h1 id="contact-heading">— Let’s start<br />a project.</h1>
            <p className="contact-intro__description">Have an idea, a question, or a project in mind? Tell me what you’re thinking. I’d love to hear about it and work out how I can help.</p>
            <div className="contact-intro__person">
              <img className="contact-intro__portrait" src="/images/profile/iamyadunandhero.webp" alt="Yadunand Pavithran" width="160" height="160" decoding="async" />
              <div className="contact-intro__email">
                <p>Say hi!</p>
                <a href="mailto:yadunandpavithran05@gmail.com">yadunandpavithran05@gmail.com</a>
              </div>
            </div>
          </Reveal>
          <form id="brief" className="contact-form" data-contact-form="" action="mailto:yadunandpavithran05@gmail.com" method="post" encType="text/plain" aria-label="Project enquiry" aria-describedby="contact-form-note">
            <Reveal className="contact-form__field">
              <label htmlFor="contact-name">What’s your name?</label>
              <input id="contact-name" name="name" type="text" placeholder="Your name" autoComplete="name" maxLength="120" required />
            </Reveal>
            <Reveal delay={1 * 0.08} className="contact-form__field">
              <label htmlFor="contact-email">What’s your email address?</label>
              <input id="contact-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" maxLength="254" required />
            </Reveal>
            <Reveal delay={2 * 0.08} className="contact-form__field">
              <label htmlFor="contact-company">Company or organisation <span className="contact-form__optional">(optional)</span></label>
              <input id="contact-company" name="company" type="text" placeholder="Your company" autoComplete="organization" maxLength="160" />
            </Reveal>
            <Reveal as="fieldset" delay={3 * 0.08} className="contact-form__services">
              <legend>What can I help you with?</legend>
              <div className="contact-form__choices">
                <label className="contact-form__choice roll-parent">
                  <input type="checkbox" name="services" value="Web Design" />
                  <span className="btn">
                    <span className="roll">
                      <span data-text="Web Design">Web Design</span>
                    </span>
                  </span>
                </label>
                <label className="contact-form__choice roll-parent">
                  <input type="checkbox" name="services" value="Web Development" />
                  <span className="btn">
                    <span className="roll">
                      <span data-text="Web Development">Web Development</span>
                    </span>
                  </span>
                </label>
                <label className="contact-form__choice roll-parent">
                  <input type="checkbox" name="services" value="Branding" />
                  <span className="btn">
                    <span className="roll">
                      <span data-text="Branding">Branding</span>
                    </span>
                  </span>
                </label>
              </div>
            </Reveal>
            <Reveal delay={4 * 0.08} className="contact-form__field">
              <label htmlFor="contact-budget">What’s your budget?</label>
              <div className="contact-form__select">
                <select id="contact-budget" name="budget" defaultValue={""}>
                  <option value="">Select budget</option>
                  <option value="Under ₹25,000">Under ₹25,000</option>
                  <option value="₹25,000 – ₹50,000">₹25,000 – ₹50,000</option>
                  <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                  <option value="₹1,00,000+">₹1,00,000+</option>
                  <option value="Let’s discuss">Let’s discuss</option>
                </select>
                <Icon icon={ArrowDown01Icon} size={18} className="contact-form__select-icon" />
              </div>
            </Reveal>
            <Reveal delay={5 * 0.08} className="contact-form__field">
              <label htmlFor="contact-deadline">Do you have a deadline in mind? <span className="contact-form__optional">(optional)</span></label>
              <input id="contact-deadline" name="deadline" type="text" placeholder="A date, a month, or no rush" maxLength="160" />
            </Reveal>
            <Reveal delay={6 * 0.08} className="contact-form__field">
              <label htmlFor="contact-message">Tell me a little about your project.</label>
              <textarea data-lenis-prevent="" id="contact-message" name="message" rows="3" placeholder="Your idea, goals, and anything else I should know…" maxLength="3000" required />
            </Reveal>
            <Reveal delay={7 * 0.08} className="contact-form__actions">
              <button className="contact-form__send" type="submit">
                <span className="roll">
                  <span data-text="Send message">Send message</span>
                </span>
                <Icon icon={Mail01Icon} size={18} className="contact-form__send-icon" />
              </button>
              <p id="contact-form-note" className="contact-form__note">Opens your email app with your project details ready to send.</p>
              <p className="contact-form__status" data-form-status="" role="status" aria-live="polite" />
            </Reveal>
          </form>
        </section>
      </main>
    </SiteFrame>
  );
}
