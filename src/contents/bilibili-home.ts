import type { PlasmoContentScript } from 'plasmo';
import { Storage } from '@plasmohq/storage';

import recCss from 'data-text:../css/bilibili-home-rec.css';

const storage = new Storage();

export const config: PlasmoContentScript = {
	matches: ['*://www.bilibili.com/*'],
};

const injectRecCss = () => {
	const styleDom = document.createElement('style');
	styleDom.id = 'tuntun-bilibili-home-rec';
	styleDom.innerHTML = recCss;
	document.body.appendChild(styleDom);
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
		const isHomeRecRepaint = await storage.get('isHomeRecRepaint');
		if (isHomeRecRepaint) {
			injectRecCss();
		}
	}
};

init();
