import Ph_VideoWrapper from "../videoWrapper.js";

export default class Ph_SimpleVideo extends Ph_VideoWrapper {
	video: HTMLVideoElement;
	lastNon0Volume: number;
	isFullscreen: boolean = false;

	constructor(sources: { src: string, type: string }[]) {
		super();

		this.video = document.createElement("video");
		this.video.setAttribute("loop", "");
		this.appendChild(this.video);
		for (const source of sources)
			this.video.insertAdjacentHTML("beforeend", `<source src="${source.src}" type="${source.type}">`);

		this.lastNon0Volume = this.video.volume;
	}

	play(): void {
		this.video.play();
	}

	pause(): void {
		this.video.pause();
	}

	togglePlay(): boolean {
		if (this.video.paused)
			this.video.play();
		else
			this.video.pause();
		
		return !this.video.paused;
	}

	seekTo(time: number): void {
		this.video.currentTime = time;
	}

	getCurrentTime(): number {
		return this.video.currentTime;
	}

	getMaxTime(): number {
		return this.video.duration;
	}

	toggleMute(): boolean {
		if (this.video.volume === 0)
			this.setVolume(this.lastNon0Volume ? this.lastNon0Volume : .5);
		else
			this.setVolume(0);
		
		return this.video.volume !== 0;
	}

	setVolume(vol: number): void {
		this.video.volume = Math.min(1, Math.max(0, vol));
		if (this.video.volume > 0)
			this.lastNon0Volume = this.video.volume;
	}

	volumePlus(): void {
		this.setVolume(this.video.volume + .1)
	}
	
	volumeMinus(): void {
		this.setVolume(this.video.volume - .1)
	}

	getVolume(): number {
		return this.video.volume;
	}

	setTimeUpdateCallback(callback: () => void): void {
		this.video.addEventListener("timeupdate", callback);
	}

	toggleFullscreen(): boolean {
		if (this.isFullscreen) {
			document.exitFullscreen();
			return this.isFullscreen = false;
		}
		else if (this.parentElement.requestFullscreen) {
			this.parentElement.requestFullscreen();
			return this.isFullscreen = true;
		}
	}
}

customElements.define("ph-video", Ph_SimpleVideo);