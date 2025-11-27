export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.innerHTML = '';

  const row1 = rows[0];
  const mainImageCell = row1?.children[0];
  const titleCell = row1?.children[1];

  const mainImage = mainImageCell?.querySelector('img');
  if (mainImage) {
    mainImage.classList.add('hero-main-image');
    block.appendChild(mainImage);
  }

  const overlay = document.createElement('div');
  overlay.classList.add('hero-overlay');

  if (titleCell) {
    const title = document.createElement('h1');
    title.textContent = titleCell.textContent;
    overlay.appendChild(title);
  }

  const row2 = rows[1];
  const smallImageCell = row2?.children[0];
  const descCell = row2?.children[1];

  if (descCell) {
    const desc = document.createElement('p');
    desc.textContent = descCell.textContent;
    overlay.appendChild(desc);
  }

  block.appendChild(overlay);

  const smallImage = smallImageCell?.querySelector('img');
  if (smallImage) {
    smallImage.classList.add('hero-small-image');
    block.appendChild(smallImage);
  }

  block.classList.add('hero-wrapper');
}
