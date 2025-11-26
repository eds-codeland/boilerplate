import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const fragment = await loadFragment('/nav');
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  const topRow = document.createElement('div');
  topRow.className = 'nav-top';

  const bottomRow = document.createElement('div');
  bottomRow.className = 'nav-bottom';

  const sections = fragment.querySelectorAll(':scope .section');

  sections.forEach((section, i) => {
    const div = document.createElement('div');

    if (i === 0) {
      div.className = 'nav-brand';
      while (section.firstChild) {
        div.appendChild(section.firstChild);
      }
      topRow.appendChild(div);
    } else if (i === 1) {
      div.className = 'nav-sections';
      while (section.firstChild) {
        div.appendChild(section.firstChild);
      }
      div.querySelectorAll(':scope ul > li').forEach((li) => {
        if (li.querySelector('ul')) {
          li.classList.add('nav-drop');
          li.setAttribute('aria-expanded', 'false');
          li.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = li.getAttribute('aria-expanded') === 'true';
            div.querySelectorAll('.nav-drop').forEach((drop) => {
              drop.setAttribute('aria-expanded', 'false');
            });
            li.setAttribute('aria-expanded', String(!isExpanded));
          });
        }
      });
      bottomRow.appendChild(div);
    } else if (i === 2) {
      div.className = 'nav-tools';

      const wrapper = section.querySelector('.default-content-wrapper');
      if (wrapper) {
        const paragraphs = wrapper.querySelectorAll('p');

        if (paragraphs[0]) {
          const langDiv = document.createElement('div');
          langDiv.className = 'nav-lang';
          const langHtml = paragraphs[0].innerHTML;
          const langs = langHtml.split(/<br\s*\/?>/i).map((l) => l.trim()).filter(Boolean);
          const firstLang = langs[0] || 'ITA';
          langDiv.innerHTML = `<span>${firstLang}</span><span class="nav-lang-arrow">∨</span>`;
          div.appendChild(langDiv);
        }

        if (paragraphs[1]) {
          const btnDiv = document.createElement('div');
          btnDiv.className = 'nav-buttons';
          const html = paragraphs[1].innerHTML;
          const items = html.split(/<br\s*\/?>/i)
            .map((item) => item.trim())
            .filter((item) => item && item !== '—' && item !== '-');

          items.forEach((item) => {
            const btn = document.createElement('a');
            btn.className = 'nav-btn';
            if (item.startsWith('<a')) {
              const temp = document.createElement('div');
              temp.innerHTML = item;
              const link = temp.querySelector('a');
              if (link) {
                btn.href = link.href;
                btn.textContent = link.textContent;
              }
            } else {
              const slug = item.toLowerCase().replace(/\s+/g, '-');
              btn.href = `/${slug}`;
              btn.textContent = item;
            }
            btnDiv.appendChild(btn);
          });
          div.appendChild(btnDiv);
        }
      }
      topRow.appendChild(div);
    }
  });

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Menu">
    <span class="nav-hamburger-icon"></span>
  </button>`;

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
  });

  nav.appendChild(topRow);
  nav.appendChild(bottomRow);
  nav.prepend(hamburger);

  block.textContent = '';
  block.appendChild(nav);
}
