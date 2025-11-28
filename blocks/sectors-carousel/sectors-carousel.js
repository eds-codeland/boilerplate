/**
 * Sectors Carousel Block
 */

let sectorsCarouselId = 0;

function showSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.sectors-slide');
  const navLinks = block.querySelectorAll('.sectors-nav-link');

  if (slides.length === 0) return;

  let realSlideIndex = slideIndex;
  if (slideIndex < 0) realSlideIndex = slides.length - 1;
  if (slideIndex >= slides.length) realSlideIndex = 0;

  slides.forEach((slide, idx) => {
    if (idx === realSlideIndex) {
      slide.classList.add('active');
      slide.setAttribute('aria-hidden', 'false');
    } else {
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
    }
  });

  // Update active nav link
  navLinks.forEach((link, idx) => {
    if (idx === realSlideIndex) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'true');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  block.dataset.activeSlide = realSlideIndex;
}

function setupAutoAdvance(block) {
  const slides = block.querySelectorAll('.sectors-slide');
  if (slides.length <= 1) return;

  let intervalId = null;
  const INTERVAL_MS = 3000;

  function advance() {
    const currentIndex = parseInt(block.dataset.activeSlide || '0', 10);
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(block, nextIndex);
  }

  function start() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(advance, INTERVAL_MS);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    stop();
    start();
  }

  // Store reset function on block for nav clicks
  block.resetAutoAdvance = reset;

  // Start auto-advance
  start();
}

function bindNavEvents(block) {
  const navLinks = block.querySelectorAll('.sectors-nav-link');

  navLinks.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(block, idx);
      // Reset the auto-advance timer when user clicks
      if (block.resetAutoAdvance) {
        block.resetAutoAdvance();
      }
    });
  });
}

export default async function decorate(block) {
  sectorsCarouselId += 1;
  const carouselId = sectorsCarouselId;

  block.setAttribute('id', `sectors-carousel-${carouselId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Sectors Carousel');

  // Parse table rows (from Google Docs)
  const rows = block.querySelectorAll(':scope > div');
  const slides = [];

  let startIdx = 0;
  if (rows.length > 0) {
    const firstRow = rows[0];
    const firstCell = firstRow.querySelector(':scope > div');
    if (firstCell && firstCell.textContent.trim().toLowerCase().includes('sectors-carousel')) {
      startIdx = 1;
    }
  }

  // Process data rows (4 columns: Background Image, Title, Description, Link)
  for (let idx = startIdx; idx < rows.length; idx += 1) {
    const row = rows[idx];
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 4) continue; // Skip rows without enough cells (4 columns required)

    const slideData = {
      backgroundImage: null,
      title: '',
      description: '',
      link: '',
    };

    // Column 1: Background image
    const bgCell = cells[0];
    const bgPicture = bgCell.querySelector('picture');
    const bgImg = bgCell.querySelector('img');
    if (bgPicture) {
      slideData.backgroundImage = bgPicture;
    } else if (bgImg) {
      slideData.backgroundImage = bgImg;
    }

    // Column 2: Title
    slideData.title = cells[1]?.textContent?.trim() || '';

    // Column 3: Description
    slideData.description = cells[2]?.textContent?.trim() || '';

    // Column 4: Link
    const linkCell = cells[3];
    const linkAnchor = linkCell?.querySelector('a');
    if (linkAnchor) {
      slideData.link = linkAnchor.href || linkAnchor.textContent.trim();
    } else if (linkCell) {
      slideData.link = linkCell.textContent?.trim() || '';
    }

    if (slideData.title && slideData.backgroundImage) {
      slides.push(slideData);
    }
  }

  if (slides.length === 0) {
    return;
  }

  // navigation sidebar
  const nav = document.createElement('div');
  nav.classList.add('sectors-nav');

  const navHeader = document.createElement('div');
  navHeader.classList.add('sectors-nav-header');
  navHeader.textContent = 'SETTORI';
  nav.append(navHeader);

  const navList = document.createElement('div');
  navList.classList.add('sectors-nav-list');

  slides.forEach((slide, idx) => {
    const navLink = document.createElement('a');
    navLink.href = '#';
    navLink.classList.add('sectors-nav-link');
    navLink.textContent = slide.title;
    navLink.setAttribute('aria-label', `Go to ${slide.title} slide`);
    if (idx === 0) {
      navLink.classList.add('active');
      navLink.setAttribute('aria-current', 'true');
    }
    navList.append(navLink);
  });

  nav.append(navList);

  // slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('sectors-slides');

  slides.forEach((slide, idx) => {
    const slideEl = document.createElement('div');
    slideEl.classList.add('sectors-slide');
    if (idx === 0) {
      slideEl.classList.add('active');
    }
    slideEl.setAttribute('aria-hidden', idx === 0 ? 'false' : 'true');
    slideEl.setAttribute('aria-label', slide.title);

    // Background image
    const bgWrapper = document.createElement('div');
    bgWrapper.classList.add('sectors-slide-bg');
    if (slide.backgroundImage) {
      if (slide.backgroundImage.tagName === 'PICTURE') {
        bgWrapper.append(slide.backgroundImage.cloneNode(true));
      } else {
        const img = slide.backgroundImage.cloneNode(true);
        bgWrapper.append(img);
      }
    }
    slideEl.append(bgWrapper);

    const gradient = document.createElement('div');
    gradient.classList.add('sectors-slide-gradient');
    slideEl.append(gradient);

    const caption = document.createElement('div');
    caption.classList.add('sectors-slide-caption');

    const title = document.createElement('h3');
    title.classList.add('sectors-slide-title');
    title.textContent = slide.title;
    caption.append(title);

    const textWrapper = document.createElement('div');
    textWrapper.classList.add('sectors-slide-text');

    const description = document.createElement('p');
    description.textContent = slide.description;
    textWrapper.append(description);

    if (slide.link) {
      const link = document.createElement('a');
      link.href = slide.link;
      link.classList.add('sectors-slide-link');
      link.setAttribute('aria-label', `Learn more about ${slide.title}`);

      const icon = document.createElement('span');
      icon.classList.add('icon', 'icon-circle-arrow');
      const iconImg = document.createElement('img');
      iconImg.src = 'https://www.acerbisoem.com/wp-content/themes/acerbis/img/circle-gt.svg';
      iconImg.alt = '';
      iconImg.loading = 'lazy';
      iconImg.width = 58;
      iconImg.height = 58;
      icon.append(iconImg);
      link.append(icon);

      textWrapper.append(link);
    }

    caption.append(textWrapper);
    slideEl.append(caption);

    slidesContainer.append(slideEl);
  });

  block.innerHTML = '';
  block.append(nav);
  block.append(slidesContainer);

  block.dataset.activeSlide = '0';
  bindNavEvents(block);
  setupAutoAdvance(block);
}
