/**
 * A set of images that can be replaced by each other
 */
export default class Ph_SwitchingImage extends HTMLElement {
	dict = {};
	lastActive: HTMLImageElement

	constructor(imgDictionary: { src: string, key: any }[], isButton = false) {
		super();

		this.className = "switchableImg imgWrapper";
		this.setAttribute("draggable", "false");

		let root: HTMLElement;
		if (isButton) {
			const wrapperBtn = document.createElement("button");
			this.appendChild(wrapperBtn);
			root = wrapperBtn
		}
		else
			root = this;

		for (const src of imgDictionary) {
			this.dict[src.key] = document.createElement("img");
			this.dict[src.key].alt = src.src;
			this.dict[src.key].src = src.src;
			this.dict[src.key].className = "hide";
			root.appendChild(this.dict[src.key]);
		}

		this.lastActive = this.dict[imgDictionary[0].key];
		this.lastActive.classList.remove("hide");
	}

	showImage(key: any) {
		this.lastActive.classList.add("hide");
		this.dict[key].classList.remove("hide");
		this.lastActive = this.dict[key];
	}
}

customElements.define("ph-switching-image", Ph_SwitchingImage);
