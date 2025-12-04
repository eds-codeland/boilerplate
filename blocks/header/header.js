import { loadFragment } from '../fragment/fragment.js';

/**
 * Fetches the query-index.json and returns all page entries
 * @returns {Promise<Array>} Array of page objects from query-index
 */
async function fetchQueryIndex() {
  try {
    const response = await fetch('https://main--boilerplate--eds-codeland.aem.page/query-index.json');
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch query-index:', error);
    return [];
  }
}

/**
 * Filters pages by category from the query-index
 * @param {Array} pages - All pages from query-index
 * @param {string} category - Category name to filter by
 * @returns {Array} Filtered pages matching the category
 */
function getPagesByCategory(pages, category) {
  return pages.filter((page) => page.category
    && page.category.toLowerCase() === category.toLowerCase());
}

/**
 * Extracts a clean title from the full page title
 * e.g., "Settori | Agricoltura" -> "Agricoltura"
 * @param {string} fullTitle - The full title from query-index
 * @returns {string} The cleaned title
 */
function getCleanTitle(fullTitle) {
  if (fullTitle.includes('|')) {
    return fullTitle.split('|').pop().trim();
  }
  return fullTitle;
}

/**
 * Replaces placeholder links with dynamic content from query-index
 * @param {HTMLElement} navElement - The navigation element to process
 * @param {Array} allPages - All pages from query-index
 */
async function replacePlaceholders(navElement, allPages) {
  const allLinks = navElement.querySelectorAll('a');

  allLinks.forEach((link) => {
    const isPlaceholder = link.href.includes('placeholder')
      || link.textContent.toLowerCase().trim() === 'placeholder';

    if (isPlaceholder) {
      const parentLi = link.closest('li');
      if (!parentLi) return;

      const parentUl = parentLi.closest('ul');
      const grandparentLi = parentUl?.closest('li');

      if (grandparentLi) {
        const categoryLink = grandparentLi.querySelector(':scope > a');
        const categoryText = grandparentLi.childNodes[0];
        const category = categoryLink?.textContent?.trim()
          || categoryText?.textContent?.trim()
          || '';

        if (category) {
          const categoryPages = getPagesByCategory(allPages, category);

          if (categoryPages.length > 0) {
            categoryPages.forEach((page, index) => {
              const newLi = document.createElement('li');
              const newLink = document.createElement('a');
              newLink.href = page.path;
              newLink.textContent = getCleanTitle(page.title);
              newLi.appendChild(newLink);

              if (index === 0) {
                parentLi.replaceWith(newLi);
              } else {
                parentUl.appendChild(newLi);
              }
            });
          } else {
            parentLi.remove();
          }
        }
      }
    }
  });
}

export default async function decorate(block) {
  const fragment = await loadFragment('/nav');
  if (!fragment) return;

  const allPages = await fetchQueryIndex();
  await replacePlaceholders(fragment, allPages);

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
