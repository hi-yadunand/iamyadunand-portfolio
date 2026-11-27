export function Preloader() {
  return (
    <div data-preloader="" aria-hidden="true">
      <div className="preloader__stack">
        <div data-preloader-card="" className="preloader__card">
          <img className="preloader__image" src="/images/case-studies/karuvin.webp" alt="" width="720" height="480" loading="eager" decoding="async" />
        </div>
        <div data-preloader-card="" className="preloader__card">
          <img className="preloader__image" src="/images/case-studies/lobiatek.webp" alt="" width="720" height="480" loading="eager" decoding="async" />
        </div>
        <div data-preloader-card="" className="preloader__card">
          <img className="preloader__image" src="/images/case-studies/zappo.webp" alt="" width="720" height="480" loading="eager" decoding="async" />
        </div>
        <div data-preloader-card="" className="preloader__card">
          <img className="preloader__image" src="/images/case-studies/spakgen.webp" alt="" width="720" height="480" loading="eager" decoding="async" />
        </div>
      </div>
      <p data-preloader-count="" className="preloader__count">0%</p>
    </div>
  );
}
