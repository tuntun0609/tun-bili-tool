import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

import './SideBar.scss';

export const routerItems: MenuProps['items'] = [
	{ label: '主站设置', key: 'main-setting' },
	{ label: '视频设置', key: 'video-setting' },
	{ label: '直播设置', key: 'live-setting' },
	{ label: '辅助功能', key: 'other-setting' },
];

export const SideBar: React.FC = () => {
	const navigate = useNavigate();
	const onMenuClick = (e: any) => {
		navigate(e.key);
	};
	return (
		<div className='side-bar'>
			<Menu
				style={{ width: 258, borderRight: 'none' }}
				defaultSelectedKeys={['1']}
				defaultOpenKeys={['sub1']}
				items={routerItems}
				onClick={onMenuClick}
			/>
		</div>
	);
};
