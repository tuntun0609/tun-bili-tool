import React from 'react';
import { ConfigProvider, Tabs } from 'antd';
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';

import { PopupFooter } from './components';
import {
	PopupRec, PopupDynHome, PopupLiveList,
	PopupQuickNav,
} from './pages';

import './popup.scss';
import 'antd/dist/reset.css';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

function Popup() {
	console.log('popup');
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#fb7299',
					colorSuccess: '#52c41a',
					colorWarning: '#faad14',
					colorError: '#f5222d',
				},
			}}
			locale={zhCN}
		>
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
							children: <PopupRec></PopupRec>,
						},
						{
							label: '视频动态',
							key: '2',
							children: <PopupDynHome></PopupDynHome>,
						},
						{
							label: '直播列表',
							key: '3',
							children: <PopupLiveList></PopupLiveList>,
						},
						{
							label: '快速导航',
							key: '4',
							children: <PopupQuickNav></PopupQuickNav>,
						},
					]}
				/>
				<PopupFooter></PopupFooter>
			</div>
		</ConfigProvider>
	);
}

export default Popup;
