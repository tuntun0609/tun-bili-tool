import React from 'react';
import { Button } from 'antd';

import './PopupFooter.scss';

export const PopupFooter: React.FC = () => {
	const openOptions = () => {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	};
	return (
		<div className={'footer'}>
			<Button
				size='small'
				onClick={openOptions}
			>选项页</Button>
		</div>
	);
};
