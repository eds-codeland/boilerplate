import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  
  const leftColumnRow = rows[0];
  const leftColumns = leftColumnRow ? [...leftColumnRow.children] : [];
  
  const eyebrow = leftColumns[0]?.textContent?.trim() || '';
  const heading = leftColumns[1]?.textContent?.trim() || '';
  const description = leftColumns[2]?.textContent?.trim() || '';

  const cardRows = rows.slice(1);
  const cards = [];

  cardRows.forEach((row) => {
    const columns = [...row.children];
    if (columns.length >= 5) {
      const imageCell = columns[0];
      const titleLine1 = columns[1]?.textContent?.trim() || '';
      const titleLine2 = columns[2]?.textContent?.trim() || '';
      const cardDescription = columns[3]?.textContent?.trim() || '';
      const linkCell = columns[4];
      
      const img = imageCell?.querySelector('img');
      const imageSrc = img?.src || '';
      const imageAlt = img?.alt || `${titleLine1} ${titleLine2}`;
      
      let linkUrl = '';
      const linkElement = linkCell?.querySelector('a');
      if (linkElement) {
        linkUrl = linkElement.href;
      } else if (linkCell?.textContent?.trim()) {
        linkUrl = linkCell.textContent.trim();
      }

      if (imageSrc || titleLine1) {
        cards.push({
          imageSrc,
          imageAlt,
          titleLine1,
          titleLine2,
          description: cardDescription,
          link: linkUrl,
        });
      }
    }
  });

  block.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'technologies-inner';

  const leftColumn = document.createElement('div');
  leftColumn.className = 'technologies-left';

  if (eyebrow) {
    const eyebrowEl = document.createElement('div');
    eyebrowEl.className = 'technologies-eyebrow';
    eyebrowEl.textContent = eyebrow;
    leftColumn.appendChild(eyebrowEl);
  }

  if (heading) {
    const headingEl = document.createElement('h2');
    headingEl.className = 'technologies-heading';
    headingEl.textContent = heading;
    leftColumn.appendChild(headingEl);
  }

  if (description) {
    const descEl = document.createElement('div');
    descEl.className = 'technologies-description';
    const descContent = leftColumns[2]?.innerHTML || description;
    descEl.innerHTML = descContent;
    leftColumn.appendChild(descEl);
  }

  const rightColumn = document.createElement('div');
  rightColumn.className = 'technologies-right';

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'technologies-cards';

  cards.forEach((card, index) => {
    const cardEl = document.createElement('a');
    cardEl.className = 'technologies-card';
    cardEl.href = card.link || '#';
    if (!card.link) {
      cardEl.addEventListener('click', (e) => e.preventDefault());
    }

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'technologies-card-image';
    
    if (card.imageSrc) {
      const picture = createOptimizedPicture(
        card.imageSrc,
        card.imageAlt,
        index === 0,
        [{ media: '(min-width: 900px)', width: '800' }, { width: '600' }]
      );
      imageWrapper.appendChild(picture);
    }

    const overlay = document.createElement('div');
    overlay.className = 'technologies-card-overlay';

    const content = document.createElement('div');
    content.className = 'technologies-card-content';

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'technologies-card-title';
    
    if (card.titleLine1) {
      const titleLine1El = document.createElement('span');
      titleLine1El.className = 'technologies-card-title-line1';
      titleLine1El.textContent = card.titleLine1;
      titleWrapper.appendChild(titleLine1El);
    }

    if (card.titleLine2) {
      const titleLine2El = document.createElement('span');
      titleLine2El.className = 'technologies-card-title-line2';
      titleLine2El.textContent = card.titleLine2;
      titleWrapper.appendChild(titleLine2El);
    }

    content.appendChild(titleWrapper);

    if (card.description) {
      const descEl = document.createElement('div');
      descEl.className = 'technologies-card-description';
      descEl.textContent = card.description;
      content.appendChild(descEl);
    }

    const arrowEl = document.createElement('div');
    arrowEl.className = 'technologies-card-arrow';
    content.appendChild(arrowEl);

    cardEl.appendChild(imageWrapper);
    cardEl.appendChild(overlay);
    cardEl.appendChild(content);
    cardsContainer.appendChild(cardEl);
  });

  rightColumn.appendChild(cardsContainer);

  container.appendChild(leftColumn);
  container.appendChild(rightColumn);
  block.appendChild(container);

  block.classList.add('technologies-block');
}

