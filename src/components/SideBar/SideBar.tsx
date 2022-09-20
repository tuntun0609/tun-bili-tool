import React, { ReactNode, useEffect, useState } from 'react';
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
	const [selectItem, setSelectItem] = useState<string>();

	useEffect(() => {
		console.log(location.hash);
		if (location.hash !== '') {
			const hash = location.hash.slice(2);
			const key = routerItems.find(item => item.key === hash)?.key ?? routerItems[0].key;
			setSelectItem(key);
		} else {
			setSelectItem(routerItems[0].key);
		}
	}, []);

	const onMenuClick = (e: any) => {
		navigate(e.key);
	};
	return (
		<div className='sidebar'>
			{
				routerItems.map(item => (
					<div
						key={item.key}
						className={'sidebar-item' + (selectItem === item.key ? ' sidebar-item-select' : '')}
						onClick={() => {
							onMenuClick(item);
							setSelectItem(item.key);
						}}
					>
						<div className={'sidebar-item-label' + (selectItem === item.key ? ' sidebar-item-label-select' : '')}>{item.label}</div>
					</div>
				))
			}
		</div>
	);
};
