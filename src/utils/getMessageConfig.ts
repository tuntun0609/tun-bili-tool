import type { ConfigOptions } from 'antd/es/message/interface';

export const getMessageConfig = (selector?: string, config?: ConfigOptions): ConfigOptions => ({
	top: 70,
	duration: 1.5,
	maxCount: 3,
	getContainer: () => selector ? document.querySelector(selector).shadowRoot.querySelector('#plasmo-shadow-container') : document.body,
	...config,
});
