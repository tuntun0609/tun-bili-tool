import React, { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { GithubOutlined, YoutubeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { Header, HeaderProps, SideBar } from '~components';
import {
	Content,
} from '~pages';

import './options.scss';
import 'antd/dist/reset.css';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const HeaderItems: HeaderProps[] = [
	{
		name: '错误反馈',
		url: 'https://message.bilibili.com/#/whisper/mid47706697',
	},
	{
		name: '插件功能文档',
		url: 'https://bili-tool-docs.tuntun.site/',
	},
	{
		name: 'GitHub',
		url: 'https://github.com/tuntun0609/tun-bili-tool',
		icon: <GithubOutlined />,
	},
	{
		name: 'bilibili',
		url: 'https://space.bilibili.com/47706697',
		icon: <YoutubeOutlined />,
	},
];

const Options: FC = () => (
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
		<HashRouter>
			<Header items={HeaderItems}></Header>
			<SideBar></SideBar>
			<Content></Content>
		</HashRouter>
	</ConfigProvider>
);

export default Options;
