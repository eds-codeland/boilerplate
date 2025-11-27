import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
  const rows = [...block.querySelectorAll(":scope > div")];

  // Create hero-with-text-wrapper as the main parent
  const wrapper = document.createElement("div");
  wrapper.classList.add("hero-with-text-wrapper");

  // Row 1: main image + title
  const row1 = rows[0];
  const mainImageCell = row1?.children[0];
  const titleCell = row1?.children[1];

  const mainImage = mainImageCell?.querySelector("img");
  if (mainImage) {
    mainImage.classList.add("hero-main-image");
    wrapper.appendChild(mainImage);
  }

  const overlay = document.createElement("div");
  overlay.classList.add("hero-overlay");

  // --- Read metadata ---
  const area = getMetadata("area");
  if (area) {
    const areaEl = document.createElement("span");
    areaEl.classList.add("hero-area");
    areaEl.textContent = area;
    overlay.appendChild(areaEl);
  }

  if (titleCell) {
    const title = document.createElement("h1");
    title.textContent = titleCell.textContent;
    overlay.appendChild(title);
  }

  // Row 2: small image + description
  const row2 = rows[1];
  const smallImageCell = row2?.children[0];
  const descCell = row2?.children[1];

  if (descCell) {
    const desc = document.createElement("p");
    desc.textContent = descCell.textContent;
    overlay.appendChild(desc);
  }

  wrapper.appendChild(overlay);

  const smallImage = smallImageCell?.querySelector("img");
  if (smallImage) {
    smallImage.classList.add("hero-small-image");
    wrapper.appendChild(smallImage);
  }

  // Row 3: two-column text
  const row3 = rows[2];
  if (row3) {
    const col1 = row3?.children[0];
    const col2 = row3?.children[1];

    const textRow = document.createElement("div");
    textRow.classList.add("hero-text-row");

    if (col1) {
      const leftText = document.createElement("div");
      leftText.classList.add("hero-text-col");
      leftText.innerHTML = col1.innerHTML;
      textRow.appendChild(leftText);
    }

    if (col2) {
      const rightText = document.createElement("div");
      rightText.classList.add("hero-text-col");
      rightText.innerHTML = col2.innerHTML;
      textRow.appendChild(rightText);
    }

    wrapper.appendChild(textRow);
  }

  // Replace the block entirely with ONE wrapper
  block.replaceWith(wrapper);
}
