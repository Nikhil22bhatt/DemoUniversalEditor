import { moveInstrumentation } from '../../scripts/scripts.js';

const ICON_MAP = {
  'locate': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  'nav': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18"/><path d="M8 4v4"/><path d="M16 4v4"/><text x="12" y="17" text-anchor="middle" font-size="5" font-weight="700" fill="currentColor" stroke="none">NAV</text></svg>`,
  'fund': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="12" height="16" rx="1.5"/><path d="M8 7h6M8 10h6M8 13h4"/><polyline points="14 17 17 20 22 14"/></svg>`,
  'account': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>`,
  'article': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
};

function getIcon(label) {
  const l = label.toLowerCase();
  if (l.includes('locate') || l.includes('branch') || l.includes('distributor')) return ICON_MAP.locate;
  if (l.includes('nav') || l.includes('track')) return ICON_MAP.nav;
  if (l.includes('fund') || l.includes('glance')) return ICON_MAP.fund;
  if (l.includes('account') || l.includes('statement')) return ICON_MAP.account;
  return ICON_MAP.article;
}

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
      icon.innerHTML = getIcon(label);

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
