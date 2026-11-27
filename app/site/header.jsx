const links = [
  { page: "home", href: "/", label: "Home", image: "case-studies/zappo.webp", alt: "Zappo sports booking app" },
  { page: "projects", href: "/projects", label: "Projects", image: "projects/codeandthrive.webp", alt: "Code and Thrive website" },
  { page: "services", href: "/services", label: "Services", image: "services/frontend-engineering.webp", alt: "Frontend engineering" },
  { page: "contact", href: "/contact", label: "Contact", image: "profile/iamyadunandhero.webp", alt: "Yadunand Pavithran" },
];

function Roll({ children }) {
  return <span className="roll"><span data-text={children}>{children}</span></span>;
}

export function SiteHeader({ page }) {
  const dark = page === "home" || page === "contact";

  return (
    <>
      <header data-header="" data-on-dark={dark ? "" : undefined} className="fixed inset-x-0 top-0 z-50">
        <div className="shell grid grid-cols-[1fr_auto] items-center gap-6 py-4 lg:grid-cols-[1fr_auto_1fr]">
          <a href="/" className="flex items-center gap-2 text-lg font-medium tracking-[-0.03em]" aria-label="Yadunand Pavithran, home">
            Yadunand Pavithran
          </a>
          <nav className="hidden items-center gap-7 text-sm lg:flex" aria-label="Main">
            {links.map(link => (
              <a key={link.page} href={link.href} aria-current={page === link.page ? "page" : undefined}>
                <Roll>{link.label}</Roll>
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-6">
            <a href="/contact#brief" className="btn hidden !py-1.5 md:inline-flex"><Roll>Let's talk</Roll></a>
            <button type="button" data-menu-toggle="" aria-controls="site-menu" aria-expanded="false" className="text-sm lg:hidden">
              <Roll>Menu</Roll>
            </button>
          </div>
        </div>
      </header>
      <div data-menu="" id="site-menu" inert className="fixed inset-0 z-40 bg-ink text-paper">
        <div className="shell grid h-full grid-cols-1 gap-8 pt-24 pb-8 md:grid-cols-12">
          <nav className="flex flex-col justify-end md:col-span-7" aria-label="Menu">
            {links.map((link, index) => (
              <a key={link.page} href={link.href} aria-current={page === link.page ? "page" : undefined}
                data-menu-link="true"
                className="display flex items-baseline gap-4 border-t border-line-light py-2 text-[clamp(2.75rem,8svh,6rem)] transition-colors hover:text-signal">
                <span className="label text-signal">{String(index + 1).padStart(2, "0")}</span>{link.label}
              </a>
            ))}
            <a href="/contact#brief" className="btn mt-8 self-start"><Roll>Start a project</Roll></a>
          </nav>
          <div className="stack relative hidden md:col-span-5 md:block">
            {links.map((link, index) => (
              <div key={link.page} data-menu-image="" data-active={index === 0 ? "" : undefined} className="absolute inset-0">
                <img src={`/images/${link.image}`} alt={link.alt} width="720" height="480" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
