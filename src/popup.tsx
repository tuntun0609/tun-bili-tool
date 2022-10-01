import React from 'react';
import { ConfigProvider, Tabs } from 'antd';

import { PopupFooter } from './components';
import { PopupIndex } from './pages';

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
	console.log('popup');
	return (
		<div className='main'>
			<Tabs
				centered
				style={{}}
				size={'small'}
				defaultActiveKey='1'
				tabBarStyle={{
					marginBottom: 0,
				}}
				items={[
					{
						label: '首页推荐',
						key: '1',
						children: <PopupIndex></PopupIndex>,
					},
					{
						label: '视频动态',
						key: '2',
						children: '视频动态',
					},
					{
						label: '直播',
						key: '3',
						children: '直播',
					},
				]}
			/>
			<PopupFooter></PopupFooter>
		</div>
	);
}

export default Popup;
