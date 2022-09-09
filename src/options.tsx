import React, { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { YoutubeOutlined } from '@ant-design/icons';

import { Header, HeaderProps, SideBar } from '~components';
import {
	Content,
} from '~pages';

import './options.scss';
import 'antd/dist/antd.variable.min.css';
// import 'antd/dist/antd.css';

// 自定义主题
ConfigProvider.config({
	theme: {},
});

const HeaderItems: HeaderProps[] = [
	{
		name: 'GitHub',
		url: 'https://github.com/tuntun0609/bilibil-tool-mv3',
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
