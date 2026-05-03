import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
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

  const items = [...ul.children];

  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.append(ul);

  const prev = document.createElement('button');
  prev.className = 'carousel-nav carousel-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>';

  const next = document.createElement('button');
  next.className = 'carousel-nav carousel-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 6 15 12 9 18"/></svg>';

  block.replaceChildren(prev, track, next);

  let current = 0;

  function getVisible() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function update() {
    const visible = getVisible();
    const max = Math.max(0, items.length - visible);
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
