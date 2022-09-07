import React, { FC } from 'react';
import {
	HashRouter, Route, Routes,
} from 'react-router-dom';
import { Card, ConfigProvider } from 'antd';

import { Footer, SideBar } from '~components';
import {
	MainSetting, VideoSetting, LiveSetting,
	NotFind, OtherSetting,
} from '~pages';

import './options.scss';

import 'antd/dist/antd.variable.min.css';

ConfigProvider.config({
	theme: {},
});

const cardStyle = {
	width: '100%',
	height: '100%',
	borderRadius: '10px',
	boxShadow: '0px 2px 8px 0px rgba(99, 99, 99, 0.1)',
};

const Options: FC = () => (
	<HashRouter>
		<div className='main'>
			<Footer></Footer>
			<SideBar></SideBar>
			<div className='option-content'>
				<div className='option-card'>
					<Card style={cardStyle}>
						<Routes>
							<Route index element={<MainSetting />} />
							<Route path="/main-setting" element={<MainSetting />} />
							<Route path="/video-setting" element={<VideoSetting />} />
							<Route path="/live-setting" element={<LiveSetting />} />
							<Route path="/other-setting" element={<OtherSetting />} />
							<Route path="*" element={<NotFind />} />
						</Routes>
					</Card>
				</div>
			</div>
		</div>
	</HashRouter>
);

export default Options;
