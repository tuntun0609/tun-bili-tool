import React from 'react';
import { Button, Space } from 'antd';

import './PopupFooter.scss';

export const PopupFooter: React.FC = () => {
	const openOptions = () => {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	};
	const bugReport = () => {
		chrome.tabs.create({
			url: 'https://message.bilibili.com/#/whisper/mid47706697',
		});
	};
	return (
		<div className={'footer'}>
			<Space>
				<Button
					size='small'
					onClick={bugReport}
				>
					错误反馈
				</Button>
				<Button
					size='small'
					onClick={openOptions}
				>选项页</Button>
			</Space>
		</div>
	);
};
