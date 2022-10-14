import type { PlasmoContentScript } from 'plasmo';
import hotkeys from 'hotkeys-js';
// import { Storage } from '@plasmohq/storage';

// const storage = new Storage();

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
	console.error('tun-bili-tool: 需要在原版直播间使用');
}

