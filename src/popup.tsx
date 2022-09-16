import React from 'react';
import { Button, ConfigProvider } from 'antd';

import './popup.scss';
import 'antd/dist/antd.variable.min.css';
// import 'antd/dist/antd.css';

// 自定义主题
ConfigProvider.config({
	theme: {
		primaryColor: '#fb7299',
		successColor: '#52c41a',
		warningColor: '#faad14',
		errorColor: '#f5222d',
	},
});

function Popup() {
	const openOptions = () => {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	};
	return (
		<div className='main'>
			<Button
				onClick={openOptions}
			>选项页</Button>
		</div>
	);
}

export default Popup;
