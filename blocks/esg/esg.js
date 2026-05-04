import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'esg-card';

  const textCol = document.createElement('div');
  textCol.className = 'esg-text';

  const imageCol = document.createElement('div');
  imageCol.className = 'esg-image';

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture, img');
      if (pic) {
        moveInstrumentation(cell, imageCol);
        const img = cell.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
            { media: '(min-width: 768px)', width: '700' },
            { width: '400' },
          ]);
          imageCol.append(optimized);
        } else {
          while (cell.firstChild) imageCol.append(cell.firstChild);
        }
      } else if (cell.textContent.trim()) {
        moveInstrumentation(cell, textCol);
        while (cell.firstChild) textCol.append(cell.firstChild);
      }
    });
  });

  card.append(textCol, imageCol);
  block.append(card);
}
