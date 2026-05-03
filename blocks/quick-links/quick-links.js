import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const link = row.querySelector('a');
    const label = link ? link.textContent.trim() : row.textContent.trim();

    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.title = label;

      const icon = document.createElement('span');
      icon.className = 'quick-links-icon';
      icon.setAttribute('aria-hidden', 'true');

      const text = document.createElement('span');
      text.className = 'quick-links-label';
      text.textContent = label;

      a.append(icon, text);
      li.append(a);
    } else {
      const span = document.createElement('span');
      span.className = 'quick-links-label';
      span.textContent = label;
      li.append(span);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
