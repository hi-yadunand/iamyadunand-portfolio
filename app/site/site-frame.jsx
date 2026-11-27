import { scriptsFor, stylesFor } from "./assets";
import { PortfolioFooter } from "./footer";
import { SiteHeader } from "./header";
import { Preloader } from "./preloader";
import { SiteRuntime } from "./runtime";

export function SiteFrame({ page, children }) {
  return (
    <>
      {stylesFor(page).map(href => <link key={href} rel="stylesheet" href={href} precedence="portfolio" />)}
      <Preloader />
      <SiteHeader page={page} />
      {children}
      <PortfolioFooter reveal={page !== "contact"} />
      {page !== "home" && (
        <div data-cursor="" aria-hidden="true" className="label pointer-events-none fixed top-0 left-0 z-50 -mt-9 -ml-9 hidden size-18 items-center justify-center rounded-full bg-signal text-white [@media(pointer:fine)]:flex" />
      )}
      <SiteRuntime scripts={scriptsFor(page)} />
    </>
  );
}
