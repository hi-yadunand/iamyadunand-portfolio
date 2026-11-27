const hero = document.querySelector('[data-helix-hero]');

if (hero) initHelixHero(hero);

function initHelixHero(hero) {
  const stage = hero.querySelector('.helix-hero__stage');
  const view = hero.querySelector('.helix-hero__view');
  const axis = hero.querySelector('.helix-hero__axis');
  const ribbon = hero.querySelector('[data-helix-images]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const images = ribbon.dataset.helixImages.trim().split(/\s+/).reverse();
  const slicesPerCard = 4;
  const turn = 2 * Math.PI;
  const cardAngle = turn / 7;
  const sliceAngle = cardAngle / slicesPerCard;

  let faces;
  let frame = 0;
  let progress = -1;
  let width, height, radius, pitch, reach, span, travel;

  const clamp = value => Math.min(1, Math.max(0, value));
  const segment = (value, start, end) => clamp((value - start) / (end - start));
  const degrees = radians => radians * 180 / Math.PI;
  const px = value => `${value.toFixed(2)}px`;

  function createFaces() {
    const fragment = document.createDocumentFragment();
    const faces = [];
    images.forEach((src, card) => {
      for (let slice = 0; slice < slicesPerCard; slice++) {
        const angle = card * cardAngle + (slice + .5) * sliceAngle;
        // The reverse face shows the opposite slice so previews read both ways.
        for (const back of [false, true]) {
          const element = document.createElement('div');
          element.className = 'helix-hero__face';
          element.style.backgroundImage = `url(${JSON.stringify(src)})`;
          const imageSlice = back ? slicesPerCard - 1 - slice : slice;
          faces.push({ element, angle, imageSlice, back, brightness: -1 });
          fragment.append(element);
        }
      }
    });
    ribbon.append(fragment);
    return faces;
  }

  function measure() {
    if (motion.matches) return;
    width = stage.clientWidth;
    height = stage.clientHeight;
    if (!width || !height) return;

    const scale = Math.max(Math.min(width, height * 1.6), height * .62);
    const cardWidth = scale * .4;
    const cardHeight = cardWidth / 1.5;
    radius = cardWidth / cardAngle;
    pitch = cardHeight * 1.34;
    span = pitch * (images.length - 1) * cardAngle / turn;
    reach = height / 2 + span / 2 + cardHeight * 1.6;
    // Keep moving the ribbon as the stage releases and Selected Projects enters.
    travel = hero.offsetHeight;
    view.style.perspective = px(scale * 1.05);

    const sliceWidth = 2 * radius * Math.sin(sliceAngle / 2);
    const sliceRise = pitch * sliceAngle / turn;
    const skew = -degrees(Math.atan2(sliceRise, sliceWidth));
    const faceWidth = px(sliceWidth + 2);
    for (const face of faces) {
      const top = -pitch * face.angle / turn - cardHeight / 2 + sliceRise / 2;
      // A one-pixel overlap on each edge keeps the curved image continuous.
      const reverse = face.back ? ` translateX(${faceWidth}) rotateY(180deg)` : '';
      Object.assign(face.element.style, {
        width: faceWidth,
        height: px(cardHeight),
        backgroundSize: `${px(sliceWidth * slicesPerCard)} ${px(cardHeight)}`,
        backgroundPosition: `${px(1 - face.imageSlice * sliceWidth)} 0`,
        transform: `rotateY(${degrees(face.angle)}deg) translate3d(${px(-sliceWidth / 2 - 1)}, ${px(top)}, ${px(radius)}) skewY(${skew}deg)${reverse}`,
      });
    }
    progress = -1;
    queueDraw();
  }

  function draw() {
    frame = 0;
    if (motion.matches || !travel) return;

    const scrolled = -hero.getBoundingClientRect().top;
    const next = clamp(scrolled / travel);
    if (next === progress) return;
    progress = next;

    const split = segment(progress, .07, .44);
    const offset = .5 - .5 * Math.cos(Math.PI * split);
    const footerExit = segment(progress, 0, .13);
    stage.style.setProperty('--helix-shift', px(width * offset));
    stage.style.setProperty('--helix-title-opacity', 1 - segment(progress, .36, .48));
    stage.style.setProperty('--helix-footer-opacity', 1 - footerExit);
    stage.style.setProperty('--helix-footer-shift', px(footerExit * 28));

    const turnProgress = segment(progress, .035, 1);
    const visible = turnProgress > 0 && turnProgress < 1;
    view.style.visibility = visible ? 'visible' : 'hidden';
    if (!visible) return;

    const rise = .35 * (.5 - .5 * Math.cos(Math.PI * turnProgress)) + .65 * turnProgress;
    const spin = (-.85 + turnProgress * 2.1) * Math.PI;
    const screwRise = -pitch * spin / turn;
    const release = Math.max(0, scrolled - (travel - height));
    const y = reach * (1 - 2 * rise) + span / 2 - screwRise + release * .45;
    axis.style.transform = `translate3d(${px(-width * .04)}, ${px(y)}, ${px(-radius)}) rotateZ(-17deg) rotateX(-9deg)`;
    ribbon.style.transform = `rotateY(${degrees(spin)}deg) translateY(${px(screwRise)})`;

    for (const face of faces) {
      const facing = Math.cos(face.angle + spin) * (face.back ? -1 : 1);
      if (facing < -.05) continue;
      const brightness = .66 + .34 * Math.max(0, facing);
      if (Math.abs(brightness - face.brightness) < .015) continue;
      face.brightness = brightness;
      face.element.style.filter = `brightness(${brightness.toFixed(3)})`;
    }
  }

  function queueDraw() {
    if (!frame && !motion.matches) frame = requestAnimationFrame(draw);
  }

  function playIntro() {
    if (motion.matches || hero.hasAttribute('data-helix-intro') || window.scrollY > 32 ||
        document.documentElement.hasAttribute('data-preloader-active')) return;

    hero.querySelectorAll('[data-helix-letters]').forEach((line, row) => {
      const letters = Array.from(line.textContent, (character, index) => {
        const letter = document.createElement('span');
        letter.className = 'helix-hero__letter';
        letter.style.setProperty('--helix-letter-delay', `${.08 + row * .22 + index * .045}s`);
        letter.textContent = character;
        return letter;
      });
      line.replaceChildren(...letters);
    });
    hero.setAttribute('data-helix-intro', '');
  }

  function syncMotion() {
    hero.toggleAttribute('data-helix-active', !motion.matches);
    if (motion.matches) {
      view.style.visibility = 'hidden';
      return;
    }
    faces ??= createFaces();
    measure();
  }

  window.addEventListener('scroll', queueDraw, { passive: true });
  window.addEventListener('pageshow', queueDraw);
  document.addEventListener('portfolio:preloader-complete', playIntro, { once: true });
  motion.addEventListener('change', syncMotion);
  new ResizeObserver(measure).observe(stage);
  syncMotion();
  playIntro();
}
