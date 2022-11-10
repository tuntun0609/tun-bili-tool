import React, { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { GithubOutlined, YoutubeOutlined } from '@ant-design/icons';

import { Header, HeaderProps, SideBar } from '~components';
import {
	Content,
} from '~pages';

import './options.scss';
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

const HeaderItems: HeaderProps[] = [
	{
		name: '错误反馈',
		url: 'https://message.bilibili.com/#/whisper/mid47706697',
	},
	{
		name: '插件功能文档',
		url: 'https://tun-bili-tool-doc.vercel.app/',
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
	<HashRouter>
		<Header items={HeaderItems}></Header>
		<SideBar></SideBar>
		<Content></Content>
	</HashRouter>
);

export default Options;
