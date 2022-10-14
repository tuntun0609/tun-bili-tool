import type { PlasmoContentScript } from 'plasmo';
import hotkeys from 'hotkeys-js';
import { Storage } from '@plasmohq/storage';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://live.bilibili.com/*'],
};

// 是否是原版直播间
const isOriginLive = () => {
	if(document.querySelector('article[id="app"]')) {
		return false;
	}
	return true;
};

// ctrl+m静音
if (isOriginLive()) {
	hotkeys('ctrl+m', () => {
		const video: HTMLVideoElement = document.querySelector('.live-player-mounter video');
		video.muted = !video.muted;
	});
} else {
	console.warn('tun-bili-tool: 需要在原版直播间使用');
}

// 设置画质
const setQuality = async (liveQuality: string, time = 3000) => {
	setTimeout(() => {
		document.querySelector('#live-player').dispatchEvent(new MouseEvent('mousemove'));
		const intervalId = setInterval(() => {
			document.querySelector('#live-player').dispatchEvent(new MouseEvent('mousemove'));
		}, 100);
		document.querySelector('.quality-wrap').dispatchEvent(new MouseEvent('mouseenter'));
		setTimeout(() => {
			const qualityBtns = document.querySelectorAll('.quality-wrap .panel .quality-it');
			qualityBtns.forEach((el) => {
				if (el.innerHTML === liveQuality) {
					el.dispatchEvent(new Event('click'));
				}
			});
			clearInterval(intervalId);
			document.querySelector('#live-player').dispatchEvent(new MouseEvent('mouselive'));
		}, 100);
	}, time);
};

window.addEventListener(
	'load',
	async () => {
		const liveQuality = await storage.get('liveDefaultQuality');
		if (liveQuality && liveQuality !== '不开启' && isOriginLive()) {
			setQuality(liveQuality);
		}
	},
);
