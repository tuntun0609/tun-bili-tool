import type { PlasmoContentScript } from 'plasmo';
import hotkeys from 'hotkeys-js';
import { Storage } from '@plasmohq/storage';

import { isOriginLive } from '~utils';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://live.bilibili.com/*'],
	all_frames: true,
};

// ctrl+m静音
if (isOriginLive()) {
	hotkeys('ctrl+m', () => {
		const video: HTMLVideoElement = document.querySelector('.live-player-mounter video');
		video.muted = !video.muted;
	});
}

// 设置画质
const setQuality = async (liveQuality: string, time = 3000) => {
	setTimeout(() => {
		const livePlayer = document.querySelector('#live-player');
		if (livePlayer) {
			livePlayer.dispatchEvent(new MouseEvent('mousemove'));
			const qualityWrap = document.querySelector('.quality-wrap');
			if (qualityWrap) {
				qualityWrap.dispatchEvent(new MouseEvent('mouseenter'));
				setTimeout(() => {
					const qualityBtns = document.querySelectorAll('.quality-wrap .panel .quality-it');
					qualityBtns.forEach((el) => {
						if (el.innerHTML === liveQuality) {
							el.dispatchEvent(new Event('click'));
						}
					});
					document.querySelector('#live-player').dispatchEvent(new MouseEvent('mouselive'));
				}, 100);
			}
		}
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
