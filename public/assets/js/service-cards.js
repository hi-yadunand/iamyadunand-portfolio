import { requestSiteRefresh } from './site-scroll.js';

const list = document.querySelector('.service-cards');

if (list) {
  const canHover = window.matchMedia('(hover: hover)');
  let openCard = list.querySelector('.service-card[data-open]');
  let hovering = false;

  function setOpenCard(card) {
    if (openCard === card) return;

    openCard?.removeAttribute('data-open');
    openCard?.querySelector('button').setAttribute('aria-expanded', 'false');
    openCard = card;
    openCard?.setAttribute('data-open', '');
    openCard?.querySelector('button').setAttribute('aria-expanded', 'true');
  }

  // Height changes also move the rows under the pointer. Only switch cards
  // on pointer movement so the expanding panels cannot trigger each other.
  list.addEventListener('pointermove', (event) => {
    if (!canHover.matches || event.pointerType !== 'mouse' || event.buttons !== 0) return;
    const card = event.target.closest('.service-card');
    if (!card) return;
    hovering = true;
    setOpenCard(card);
  });

  list.addEventListener('pointerleave', (event) => {
    if (!hovering || event.pointerType !== 'mouse') return;
    hovering = false;
    setOpenCard(null);
  });

  list.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') hovering = false;
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('.service-card__button');
    const hoverClick = canHover.matches && hovering && event.detail > 0 &&
      (!event.pointerType || event.pointerType === 'mouse');
    if (!button || hoverClick) return;

    hovering = false;
    const card = button.closest('.service-card');
    setOpenCard(card === openCard ? null : card);
  });

  new ResizeObserver(requestSiteRefresh).observe(list);
}
