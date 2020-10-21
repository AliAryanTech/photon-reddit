import { RedditApiType } from "../../utils/types.js";
import Ph_SimpleVideo from "./simpleVideo/simpleVideo.js";
import Ph_VideoAudio from "./videoAudio/videoAudio.js";
import Ph_VideoWrapper from "./videoWrapper.js";

export default class Ph_VideoPlayer extends HTMLElement {
	video: Ph_VideoWrapper;
	hideTimeout = null;
	url: string;

	constructor(postData: RedditApiType) {
		super();

		this.url = postData.data["url"]; 
		this.classList.add("videoPlayer");
		switch (this.url.match(/^https?:\/\/([\w\.]+)/)[1]) {
			case "imgur.com":
			case "i.imgur.com":
				const typelessUrl = this.url.match(/^https?:\/\/i?\.?imgur\.com\/\w+/)[0];
				this.appendChild(this.video = new Ph_SimpleVideo([
					{ src: typelessUrl + ".mp4", type: "video/mp4" },
				]));
				break;
			case "gfycat.com":
				const capitalizedPath = postData.data["media"]["oembed"]["thumbnail_url"].match(/^https?:\/\/thumbs\.gfycat\.com\/(\w+)/)[1];
				this.appendChild(this.video = new Ph_SimpleVideo([
					{ src: `https://thumbs.gfycat.com/${capitalizedPath}-mobile.mp4`, type: "video/mp4" },
					{ src: `https://giant.gfycat.com/${capitalizedPath}.webm`, type: "video/webm" },
					{ src: `https://giant.gfycat.com/${capitalizedPath}.mp4`, type: "video/mp4" },
					{ src: `https://thumbs.gfycat.com/${capitalizedPath}-mobile.mp4`, type: "video/mp4" },
				]));
				break;
			case "v.redd.it":
				const videoUrl = postData.data["url"] + "/DASH_720.mp4";
				const audioUrl = postData.data["url"] + "/DASH_audio.mp4";
				this.appendChild(this.video = new Ph_VideoAudio(videoUrl, audioUrl));
				break;
			default:
				this.innerText = `Unknown video provider for ${postData.data["url"]}`;
				break;
		}

		if (this.video)
			this.makeControls();
	}

	makeControls() {
		const controls = document.createElement("div");
		this.appendChild(controls);
		controls.className = "controls";

		this.addEventListener("mouseenter", this.showControls.bind(this));
		this.addEventListener("mousemove", this.restartHideTimeout.bind(this));
		this.addEventListener("mouseleave", this.hideControls.bind(this));
		this.addEventListener("click", (e: MouseEvent) => {
			if (e.target === controls || controls.contains(e.target as HTMLElement))
				return;
			this.video.togglePlay()
		});

		const playButton = document.createElement("button");
		controls.appendChild(playButton);
		playButton.innerText = ">";
		playButton.addEventListener("click", () => this.video.togglePlay());

		const muteButton = document.createElement("button");
		controls.appendChild(muteButton);
		muteButton.innerText = "M";
		muteButton.addEventListener("click", () => this.video.toggleMute());
	}

	showControls() {
		this.classList.add("controlsVisible");

		this.hideTimeout = setTimeout(() => this.hideControls(), 5000);
	}

	restartHideTimeout() {
		if (!this.classList.contains("controlsVisible")) {
			this.clearHideTimeout();
			this.showControls();
			return;
		}

		this.clearHideTimeout();

		this.hideTimeout = setTimeout(() => this.hideControls(), 5000);
	}

	clearHideTimeout() {
		if (this.hideTimeout !== null) {
			clearTimeout(this.hideTimeout);
			this.hideTimeout = null;
		}
	}

	hideControls() {
		this.classList.remove("controlsVisible");
		
		this.clearHideTimeout();
	}
}

customElements.define("ph-video-player", Ph_VideoPlayer);
