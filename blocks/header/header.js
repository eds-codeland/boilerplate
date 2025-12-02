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

  let toolsDiv = null;
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
        const langList = wrapper.querySelector('ul');
        const btnParagraph = wrapper.querySelector('p');

        if (langList) {
          const langDiv = document.createElement('div');
          langDiv.className = 'nav-lang';
          const firstLangItem = langList.querySelector('li');
          const firstLang = firstLangItem ? firstLangItem.textContent.trim() : 'ITA';
          langDiv.innerHTML = `<span>${firstLang}</span><span class="nav-lang-arrow">∨</span>`;
          div.appendChild(langDiv);
        }

        if (btnParagraph) {
          const btnDiv = document.createElement('div');
          btnDiv.className = 'nav-buttons';
          const links = btnParagraph.querySelectorAll('a');

          links.forEach((link) => {
            const btn = document.createElement('a');
            btn.className = 'nav-btn';
            btn.href = link.href;
            btn.textContent = link.textContent;
            btnDiv.appendChild(btn);
          });

          if (links.length > 0) {
            div.appendChild(btnDiv);
          }
        }
      }
      toolsDiv = div;
    }
  });

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Menu">
    <span class="nav-hamburger-icon"><span></span></span>
  </button>`;

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
  });

  topRow.appendChild(toolsDiv);
  nav.appendChild(topRow);
  nav.appendChild(bottomRow);
  nav.appendChild(toolsDiv.cloneNode(true));
  nav.lastChild.className = 'nav-tools-mobile';
  nav.prepend(hamburger);

  block.textContent = '';
  block.appendChild(nav);
}
