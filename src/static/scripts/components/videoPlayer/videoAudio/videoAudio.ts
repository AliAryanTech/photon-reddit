import Ph_VideoWrapper from "../videoWrapper.js";

export default class Ph_VideoAudio extends Ph_VideoWrapper {
	video: HTMLVideoElement;
	audio: HTMLVideoElement;
	lastNon0Volume: number;

	constructor(videoMp4Url: string, audioMp4Url: string) {
		super();

		this.video = document.createElement("video");
		this.video.setAttribute("loop", "");
		this.video.innerHTML = `<source src="${videoMp4Url}" type="video/mp4">`;
		this.appendChild(this.video);
		
		this.audio = document.createElement("video");
		this.audio.setAttribute("loop", "");
		this.audio.classList.add("hide");
		this.audio.innerHTML = `<source src="${audioMp4Url}" type="video/mp4">`;
		this.appendChild(this.audio);

		this.video.addEventListener("play", () => this.audio.play());
		this.video.addEventListener("pause", () => this.audio.pause());
		this.video.addEventListener("seeking", () => this.audio.currentTime = this.video.currentTime);

		this.lastNon0Volume = this.video.volume;
	}

	play() {
		this.video.play();
	}

	pause() {
		this.video.pause();
	}

	togglePlay() {
		if (this.video.paused)
			this.play();
		else
			this.pause();
	}

	seekTo(time: number) {
		this.video.currentTime = time;
	}

	getCurrentTime(): number {
		return this.video.currentTime;
	}

	getMaxTime(): number {
		return this.video.duration;
	}

	toggleMute(): void {
		if (this.video.volume === 0)
			this.setVolume(this.lastNon0Volume ? this.lastNon0Volume : .5);
		else
			this.setVolume(0);
	}

	setVolume(vol: number): void {
		this.audio.volume = Math.min(1, Math.max(0, vol));
		if (this.audio.volume > 0)
			this.lastNon0Volume = this.audio.volume;
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

}

customElements.define("ph-video-audio", Ph_VideoAudio);
