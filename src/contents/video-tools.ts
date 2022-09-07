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
window.addEventListener(
	'load',
	async () => {
		const isVideoLoop = await storage.get('isVideoLoop');
		if (isVideoLoop) {
			repeat(3000);
			document.addEventListener('visibilitychange', () => {
				repeat(3000);
			});
			window.addEventListener('pushState', () => {
				repeat();
			});
			window.addEventListener('popstate', () => {
				repeat();
			});
		}
	},
	false,
);

injectScript( historyWarp, 'body');
