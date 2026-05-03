import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  let picture = null;
  const textNodes = [];

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        picture = cell.querySelector('picture');
        moveInstrumentation(cell, picture);
      } else if (cell.textContent.trim()) {
        textNodes.push(cell);
      }
    });
  });

  block.innerHTML = '';

  // Background image
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt || '', true, [
        { media: '(min-width: 900px)', width: '1920' },
        { width: '750' },
      ]);
      moveInstrumentation(picture, optimized);
      picture = optimized;
    }
    const bg = document.createElement('div');
    bg.className = 'hero-background';
    bg.append(picture);
    block.append(bg);
  }

  // Red text overlay
  const content = document.createElement('div');
  content.className = 'hero-content';

  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';

  textNodes.forEach((node) => {
    [...node.children].forEach((child) => overlay.append(child));
  });

  content.append(overlay);
  block.append(content);
}
