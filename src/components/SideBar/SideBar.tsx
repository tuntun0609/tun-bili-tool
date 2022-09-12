import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './SideBar.scss';

export const routerItems: { label: ReactNode, key: string }[] = [
	{ label: '主站设置', key: 'main-setting' },
	{ label: '视频设置', key: 'video-setting' },
	{ label: '直播设置', key: 'live-setting' },
	{ label: '辅助功能', key: 'other-setting' },
];

export const SideBar: React.FC = () => {
	const navigate = useNavigate();
	const [selectItem, setSelectItem] = useState(0);
	const onMenuClick = (e: any) => {
		navigate(e.key);
	};
	return (
		<div className='sidebar'>
			{
				routerItems.map((item, index) => (
					<div
						key={item.key}
						className={'sidebar-item' + (selectItem === index ? ' sidebar-item-select' : '')}
						onClick={() => {
							onMenuClick(item);
							setSelectItem(index);
						}}
					>
						<div className={'sidebar-item-label' + (selectItem === index ? ' sidebar-item-label-select' : '')}>{item.label}</div>
					</div>
				))
			}
		</div>
	);
};
