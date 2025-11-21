export default function decorate(block) {
  // Gallery Carousel component: 4-column image grid with lightbox

  const rows = Array.from(block.querySelectorAll(':scope > div'));
  console.warn('🎯 GALLERY CAROUSEL DEBUG - Total rows:', rows.length);

  // Log all rows for debugging
  rows.forEach((row, idx) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    const cellTexts = cells.map(cell => cell.textContent.trim().substring(0, 50)).join(' | ');
    console.warn(`🎯 Row ${idx}: ${cellTexts}`);
  });

  const container = document.createElement('div');
  container.classList.add('gallery-carousel-items');

  let imageCount = 0;

  // Process each row as a gallery item (skip first row which is the block name)
  rows.forEach((row, idx) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    console.log(`Row ${idx + 1} - Cells:`, cells.length);

    if (cells.length >= 1) {
      let imageUrl = null;
      let caption = '';

      const firstCell = cells[0];
      const secondCell = cells[1];

      // Check first cell for image
      let img = firstCell.querySelector('img');
      if (img) {
        imageUrl = img.src;
        caption = img.alt || '';
        console.log(`Row ${idx + 1} - Found image in first cell:`, imageUrl);
      }

      // Check second cell for image (pasted images)
      if (!imageUrl && secondCell) {
        img = secondCell.querySelector('img');
        if (img) {
          imageUrl = img.src;
          caption = img.alt || '';
          console.log(`Row ${idx + 1} - Found image in second cell:`, imageUrl);
        }
      }

      // Check second cell for link (URL)
      const link = secondCell?.querySelector('a');
      if (link && !imageUrl) {
        imageUrl = link.href;
        caption = link.textContent || '';
        console.log(`Row ${idx + 1} - Found link in second cell:`, imageUrl);
      } else if (link && imageUrl) {
        imageUrl = link.href;
        console.log(`Row ${idx + 1} - Using link as full-size image:`, imageUrl);
      }

      // Check for text content in second cell
      if (!imageUrl && secondCell) {
        const text = secondCell.textContent.trim();
        if (text.startsWith('http')) {
          imageUrl = text;
          console.log(`Row ${idx + 1} - Found URL in text:`, imageUrl);
        }
      }

      if (imageUrl) {
        imageCount++;
        const item = document.createElement('div');
        item.classList.add('gallery-carousel-item');

        // Create gallery link with lightbox
        const galleryLink = document.createElement('a');
        galleryLink.href = imageUrl;
        galleryLink.classList.add('gallery-carousel-link');
        galleryLink.setAttribute('data-fancybox', 'gallery');
        // Don't show URL as caption - leave it empty
        galleryLink.setAttribute('data-caption', '');

        // Create image
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = '';
        imgElement.classList.add('gallery-carousel-image');

        galleryLink.append(imgElement);
        item.append(galleryLink);
        container.append(item);

        console.log(`Image ${imageCount} added:`, imageUrl);
      }
    }
  });

  console.log('Gallery carousel - Total images added:', imageCount);

  block.textContent = '';
  block.append(container);

  // Load Fancybox if available
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox="gallery"]', {
      on: {
        reveal: (fancybox, slide) => {
          // Optional: add custom behavior
        }
      }
    });
  }
}
