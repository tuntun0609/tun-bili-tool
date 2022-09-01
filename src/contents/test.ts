import type { PlasmoContentScript } from 'plasmo';

export const config: PlasmoContentScript = {
	matches: ['*://www.bilibili.com/*'],
};

window.addEventListener('load', () => {
	console.log(document.querySelector('.bili-video-card'));
});
