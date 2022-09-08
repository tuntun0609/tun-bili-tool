import React, { ReactNode, useMemo } from 'react';
import { Card, Typography } from 'antd';
import { Route, Routes, useLocation } from 'react-router-dom';

import { LiveSetting, MainSetting, NotFind, OtherSetting, VideoSetting } from '~pages';
import { routerItems } from '~components';

import './Content.scss';
import type { MenuItemType } from 'antd/lib/menu/hooks/useItems';

const { Title } = Typography;

const cardStyle: React.CSSProperties = {
	width: '100%',
	height: '100%',
	borderRadius: '10px',
	boxShadow: '0px 2px 8px 0px rgba(99, 99, 99, 0.1)',
};

const cardBodyStyle: React.CSSProperties = {
	padding: '20px 25px',
};

interface routerIndex {
	key: string,
	isIndex?: boolean,
	url?: string,
	render: ReactNode,
}

const routerConfig: routerIndex[] = [
	{
		key: 'index',
		isIndex: true,
		render: <MainSetting />,
	},
	{
		key: 'main',
		url: '/main-setting',
		render: <MainSetting />,
	},
	{
		key: 'video',
		url: '/video-setting',
		render: <VideoSetting />,
	},
	{
		key: 'live',
		url: '/live-setting',
		render: <LiveSetting />,
	},
	{
		key: 'other',
		url: '/other-setting',
		render: <OtherSetting />,
	},
	{
		key: '404',
		url: '*',
		render: <NotFind />,
	},
];

export const Content: React.FC = () => {
	const { pathname } = useLocation();
	const title = useMemo(() => {
		const formatPath = pathname.slice(1);
		if (formatPath === '') {
			return (routerItems[0] as MenuItemType).label;
		}
		return ((routerItems as MenuItemType[]).find(item => item.key === formatPath)).label;
	}, [pathname]);
	return (
		<div className='option-content'>
			<div className='option-card'>
				<Card style={cardStyle} bodyStyle={cardBodyStyle}>
					<Title level={2}>{title}</Title>
					<Routes>
						{
							routerConfig.map(item => (
								<Route
									key={item.key}
									index={item.isIndex ?? false}
									element={item.render}
									path={item.url}
								/>
							))
						}
					</Routes>
				</Card>
			</div>
		</div>
	);
};
