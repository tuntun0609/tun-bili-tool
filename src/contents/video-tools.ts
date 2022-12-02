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
// 视频简介自动打开
const videoDescOpen = (time = 0) => {
	setTimeout(() => {
		const openBtn = document.querySelector('#v_desc>div[report-id=abstract_spread]');
		if (openBtn) {
			const clickEvent = new Event('click');
			openBtn.dispatchEvent(clickEvent);
		}
	}, time);
};

interface ShieldOption {
	name: string | number,
	label?: string | number,
	style?: string,
}

const shieldOptions: ShieldOption[] = [
	{
		name: 'top-left-follow',
		label: '左上角关注按钮',
		style: '.bpx-player-top-left-follow {display:none !important;}',
	},
];

// 插入屏蔽style
const injectShieldStyle = (selector: string, options: { [key: string]: any }) => {
	const shieldStyle = document.querySelector(selector);
	const styleText = shieldOptions.map(item => (
		options[item.name]
			? item.style : ''
	)).join(' ');
	if (shieldStyle) {
		shieldStyle.innerHTML = styleText;
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
				if(isVideoLoop) {
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

		const shieldStyle = document.createElement('style');
		shieldStyle.id = 'tun-shield-style';
		document.body.appendChild(shieldStyle);
		injectShieldStyle('#tun-shield-style', {
			'top-left-follow': true,
		});
	},
	false,
);

injectScript( historyWarp, 'body');
