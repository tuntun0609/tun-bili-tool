import React, { MouseEventHandler } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

import './PopupQuickNavItem.scss';

export const PopupQuickNavItem: React.FC<{
	item: { name: string, url: string }
	onDelete?: MouseEventHandler<Element>
}> = ({ item, onDelete }) => (
	<div className='popup-quick-nav-item' onClick={() => {
		chrome.tabs.create({
			url: item.url ?? '',
			active: false,
		});
	}}>
		<div className='popup-quick-nav-name' title={item.name}>
			{item.name}
		</div>
		<div className='popup-quick-nav-delete' onClick={onDelete}>
			<DeleteOutlined style={{
				fontSize: '18px',
				color: '#fb7299',
			}}/>
		</div>
	</div>
);
