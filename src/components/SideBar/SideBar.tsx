import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { routerConfig } from '../../pages/Content/Content';

import './SideBar.scss';

export const SideBar: React.FC = () => {
	const navigate = useNavigate();
	const [selectItem, setSelectItem] = useState<string>();

	useEffect(() => {
		if (location.hash !== '') {
			const hash = location.hash.slice(2);
			const key = routerConfig.find(item => item.key === hash)?.key;
			setSelectItem(key);
		} else {
			setSelectItem(routerConfig[0].key);
		}
	}, []);

	const onMenuClick = (e: any) => {
		navigate(e.key);
	};

	return (
		<div className='sidebar'>
			{
				routerConfig.map(item => (
					item.label && item.key !== '*'
						? <div
							key={item.key}
							className={'sidebar-item' + (selectItem === item.key ? ' sidebar-item-select' : '')}
							onClick={() => {
								onMenuClick(item);
								setSelectItem(item.key);
							}}
						>
							<div className={'sidebar-item-label' + (selectItem === item.key ? ' sidebar-item-label-select' : '')}>{item.label}</div>
						</div> : null
				))
			}
		</div>
	);
};
