const marquee = document.querySelector("[data-testimonial-marquee]");

if (marquee) {
  marquee.querySelectorAll(".testimonial-marquee__group").forEach((group) => {
    const clone = group.cloneNode(true);
    clone.setAttribute("data-marquee-copy", "");
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    group.after(clone);
  });

  const observer = new IntersectionObserver(([entry]) => {
    marquee.toggleAttribute("data-marquee-visible", entry.isIntersecting);
  });
  observer.observe(marquee.querySelector(".testimonial-marquee__rows"));
  marquee.setAttribute("data-marquee-motion", "");
}
