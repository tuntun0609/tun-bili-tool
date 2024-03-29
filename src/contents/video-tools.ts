import type { PlasmoCSConfig } from 'plasmo';
import historyWarp from 'url:~utils/history-wrap';

import { Storage } from '@plasmohq/storage';

import { injectScript, videoWrapShieldCss } from '~utils';

const storage = new Storage();

export const config: PlasmoCSConfig = {
	matches: ['*://www.bilibili.com/video/*'],
};

let firstVisible = true;

// 点击循环
const repeat = (time = 0) => {
	setTimeout(() => {
		const setting = document.querySelector('.bpx-player-ctrl-setting');
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
// 视频简介自动打开
const videoDescOpen = (time = 0) => {
	setTimeout(() => {
		const openBtn = document.querySelector('.toggle-btn');
		if (openBtn) {
			const clickEvent = new Event('click');
			openBtn.dispatchEvent(clickEvent);
		}
	}, time);
};

// 注入视频卡片屏蔽css
const injectVideoWrapShieldCSS = async () => {
	const isVideoWrapShield = await storage.get('isVideoWrapShield');
	if (isVideoWrapShield) {
		const videoWrapShieldOptions =
			(await storage.get('videoWrapShieldOptions')) ?? [];
		// 创建style元素
		const shieldStyle = document.createElement('style');
		shieldStyle.id = 'tun-shield-style';
		document.body.appendChild(shieldStyle);
		// 插入css
		const styleText = videoWrapShieldCss
			.map((item) =>
				videoWrapShieldOptions.indexOf(item.value) !== -1 ? item.style : '',
			)
			.join(' ');
		if (shieldStyle) {
			shieldStyle.innerHTML = styleText;
		}
	}
};

window.addEventListener(
	'load',
	async () => {
		const isVideoLoop = await storage.get('isVideoLoop');
		const isWideScreen = await storage.get('isWideScreen');
		const isVideoDescOpen = await storage.get('isVideoDescOpen');
		const pathChangeFun = () => {
			if (isVideoLoop) {
				repeat();
			}
			if (isVideoDescOpen) {
				videoDescOpen(3000);
			}
		};
		if (isVideoLoop) {
			repeat(3000);
		}
		if (isWideScreen) {
			widescreen(1500);
		}
		if (isVideoDescOpen) {
			videoDescOpen(3000);
		}
		window.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible' && firstVisible) {
				if (isVideoLoop) {
					repeat(3000);
				}
				if (isWideScreen) {
					widescreen(1500);
				}
				if (isVideoDescOpen) {
					videoDescOpen(3000);
				}
				firstVisible = !firstVisible;
			}
		});
		window.addEventListener('pushState', pathChangeFun);
		window.addEventListener('popstate', pathChangeFun);

		injectVideoWrapShieldCSS();
	},
	false,
);

injectScript(historyWarp, 'body');
