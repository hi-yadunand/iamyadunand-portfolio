import { GithubIcon, Linkedin01Icon } from "@hugeicons/core-free-icons";
import Icon from "../../components/Icon";
import Reveal from "../../components/Reveal";

const socials = [
  { label: "GitHub", href: "https://github.com/hi-yadunand", icon: GithubIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yadunand-pavithran/", icon: Linkedin01Icon },
];

export function PortfolioFooter({ reveal }) {
  const footer = (
    <footer data-profile-footer="" className="overflow-hidden bg-ink text-paper" data-dark={reveal ? undefined : ""}>
      <Reveal delay={0.1} className="portfolio-footer__content shell">
        <div className="portfolio-footer__top">
          <video data-profile-video="" className="portfolio-footer__profile-video" muted playsInline preload="metadata" width="540" height="540" aria-label="Video profile of Yadunand Pavithran">
            <source src="/assets/video/howdyiamyadunand.mp4#t=0.001" type="video/mp4" />
          </video>
          <div>
            <p className="portfolio-footer__label">Explore</p>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/projects">Projects</a>
              </li>
              <li>
                <a href="/services">Services</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="portfolio-footer__label">Follow</p>
            <ul>
              {socials.map(({ label, href, icon }) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="portfolio-footer__social-link">{label}<Icon icon={icon} className="portfolio-footer__social-icon" /></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="portfolio-footer__rule">
          <a className="portfolio-footer__contact" data-profile-video-trigger="" href="mailto:yadunandpavithran05@gmail.com">yadunandpavithran05@gmail.com</a>
          <p>Portfolio@26</p>
        </div>
      </Reveal>
      <p className="portfolio-footer__wordmark">
        <a data-profile-video-trigger="" href="mailto:yadunandpavithran05@gmail.com" className="portfolio-footer__talk-link">
          <span className="portfolio-footer__talk-text">Let's talk</span>
          <canvas className="portfolio-footer__halftone" aria-hidden="true" />
        </a>
      </p>
    </footer>
  );
  return reveal ? <div data-footer-reveal-stage="" data-dark="">{footer}</div> : footer;
}
