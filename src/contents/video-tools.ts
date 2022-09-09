import type { PlasmoContentScript } from 'plasmo';
import { Storage } from '@plasmohq/storage';

const storage = new Storage();

import historyWarp from 'url:~utils/history-wrap';
import { injectScript } from '~utils';

export const config: PlasmoContentScript = {
	matches: ['*://www.bilibili.com/video/*'],
};

let firstVisible = true;

// 点击循环
const repeat = (time = 0) => {
	setTimeout(() => {
		const setting = document.querySelector(
			'.bpx-player-ctrl-setting',
		);
		if (setting !== null) {
			const mouseoverEvent = new MouseEvent('mouseover');
			setting.dispatchEvent(mouseoverEvent);
			const btn: HTMLInputElement = document.querySelector(
				'.bpx-player-ctrl-setting-loop input',
			);
			if (!btn.checked) {
				btn.click();
			}
			const mouseoutEvent = new MouseEvent('mouseout');
			setting.dispatchEvent(mouseoutEvent);
			if (firstVisible) {
				firstVisible = !firstVisible;
			}
		}
	}, time);
};
// 点击宽屏
const widescreen = (time = 0) => {
	setTimeout(() => {
		const widescreenBtn: HTMLInputElement = document.querySelector(
			'.bpx-player-ctrl-wide',
		);
		if (widescreenBtn) {
			widescreenBtn.click();
		}
	}, time);
};

window.addEventListener(
	'load',
	async () => {
		const isVideoLoop = await storage.get('isVideoLoop');
		const isWidescreen = await storage.get('isWidescreen');
		const pathChangeFun = () => {
			if (isVideoLoop) {
				repeat();
			}
		};
		if (isVideoLoop) {
			repeat(3000);
		}
		if (isWidescreen) {
			widescreen(1500);
		}
		window.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible' && firstVisible && isVideoLoop) {
				if(isVideoLoop) {
					repeat(3000);
				}
				if (isWidescreen) {
					widescreen(1500);
				}
				firstVisible = !firstVisible;
			}
		});
		window.addEventListener('pushState', pathChangeFun);
		window.addEventListener('popstate', pathChangeFun);
	},
	false,
);

injectScript( historyWarp, 'body');