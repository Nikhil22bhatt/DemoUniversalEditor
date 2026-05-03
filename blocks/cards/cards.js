import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildCarousel(block, ul) {
  const items = [...ul.children];
  if (items.length < 2) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'cards-carousel';

  const track = document.createElement('div');
  track.className = 'cards-track';
  track.append(ul);

  const prev = document.createElement('button');
  prev.className = 'cards-nav cards-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>';

  const next = document.createElement('button');
  next.className = 'cards-nav cards-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 6 15 12 9 18"/></svg>';

  wrapper.append(prev, track, next);
  block.replaceChildren(wrapper);

  let current = 0;

  function getVisible() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function update() {
    const visible = getVisible();
    const max = items.length - visible;
    current = Math.max(0, Math.min(current, max));
    const pct = (current / items.length) * 100;
    ul.style.transform = `translateX(-${pct}%)`;
    prev.disabled = current === 0;
    next.disabled = current >= max;
  }

  prev.addEventListener('click', () => { current -= 1; update(); });
  next.addEventListener('click', () => { current += 1; update(); });
  window.addEventListener('resize', update, { passive: true });
  update();
}

export default function decorate(block) {
  const isCarousel = block.classList.contains('carousel');
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  if (isCarousel) {
    block.replaceChildren(ul);
    buildCarousel(block, ul);
  } else {
    block.replaceChildren(ul);
  }
}
