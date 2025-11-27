import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
	const rows = [...block.querySelectorAll(":scope > div")];

	// Detect variant from block class
	const isWithText = block.classList.contains("with-text");

	// Create hero-wrapper as the main parent
	const wrapper = document.querySelector(".hero-wrapper");
	// wrapper.classList.add("hero-wrapper");

	// Row 1: main image + title
	const row1 = rows[0];
	const mainImageCell = row1?.children[0];
	const titleCell = row1?.children[1];

	const mainImage = mainImageCell?.querySelector("img");
	if (mainImage) {
		mainImage.classList.add("hero-main-image");
		block.appendChild(mainImage);
	}

	const overlay = document.createElement("div");
	overlay.classList.add("hero-overlay");

	// Metadata
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

	block.appendChild(overlay);

	const smallImage = smallImageCell?.querySelector("img");
	if (smallImage) {
		smallImage.classList.add("hero-small-image");
		block.appendChild(smallImage);
	}

	// Row 3: only render if variant is active
	if (isWithText && rows[2]) {
		const row3 = rows[2];
		const col1 = row3?.children[0];
		const col2 = row3?.children[1];

		const textRow = document.createElement("div");
		textRow.classList.add("hero-text-row");

		if (col1) {
			const leftText = document.createElement("div");
			leftText.classList.add("hero-text-left");
			leftText.innerHTML = col1.innerHTML;
			textRow.appendChild(leftText);
		}

		if (col2) {
			const rightText = document.createElement("div");
			rightText.classList.add("hero-text-right");
			rightText.innerHTML = col2.innerHTML;
			textRow.appendChild(rightText);
		}

		wrapper.appendChild(textRow);
		// block.classList.add("with-text");
	}

	// block.replaceWith(wrapper);
}
