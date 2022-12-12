import type { PlasmoContentScript } from 'plasmo';
import { Storage } from '@plasmohq/storage';

import recCss from 'data-text:../css/bilibili-home-rec.css';
import closeFullSreenPreview from 'data-text:../css/home-close-full-screen-preview.css';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://www.bilibili.com/*'],
};

const injectRecCss = async () => {
	try {
		const isHomeRecRepaint = await storage.get('isHomeRecRepaint');
		if (isHomeRecRepaint) {
			const styleDom = document.createElement('style');
			styleDom.id = 'tuntun-bilibili-home-rec';
			styleDom.innerHTML = recCss;
			document.body.appendChild(styleDom);
		}
	} catch (error) {
		console.error(error);
	}
};

const closeHomeFullScreenPreview = async () => {
	try {
		const isCloseHomeFullScreenPreview = await storage.get('isCloseHomeFullScreenPreview');
		if (isCloseHomeFullScreenPreview) {
			localStorage.setItem('preview-fullscreen-opened', '0');
			localStorage.setItem('preview-volume-opened', '0');
			const styleDom = document.createElement('style');
			styleDom.id = 'tuntun-bilibili-home-close-full-screen-preview';
			styleDom.innerHTML = closeFullSreenPreview;
			document.body.appendChild(styleDom);
		}
	} catch (error) {
		console.error(error);
	}
};

const pageType = [
	'/video',
	'/bangumi',
	'/read',
];

const isHome = () => {
	const { pathname } = location;
	return !pageType.some(item => pathname.startsWith(item));
};


const init = async () => {
	if (isHome()) {
		injectRecCss();
		closeHomeFullScreenPreview();
	}
};

init();
