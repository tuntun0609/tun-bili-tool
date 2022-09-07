import React, { ReactNode } from 'react';
import { Card } from 'antd';
import { Route, Routes } from 'react-router-dom';

import { LiveSetting, MainSetting, NotFind, OtherSetting, VideoSetting } from '~pages';

import './Content.scss';

const cardStyle = {
	width: '100%',
	height: '100%',
	borderRadius: '10px',
	boxShadow: '0px 2px 8px 0px rgba(99, 99, 99, 0.1)',
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
	console.log('Content');
	return (
		<div className='option-content'>
			<div className='option-card'>
				<Card style={cardStyle}>
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
