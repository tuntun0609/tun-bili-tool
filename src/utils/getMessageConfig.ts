import type { ConfigOptions } from 'antd/es/message/interface';

export const getMessageConfig = (selector: string): ConfigOptions => ({
	top: 70,
	duration: 1.5,
	maxCount: 3,
	getContainer: () => document.querySelector(selector).shadowRoot.querySelector('#plasmo-shadow-container'),
});
