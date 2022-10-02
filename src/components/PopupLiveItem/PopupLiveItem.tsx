import React from 'react';

import './PopupLiveItem.scss';

export const PopupLiveItem: React.FC<{ data: any }> = ({ data }) => (
	<div className='popup-live-item' onClick={() => {
		chrome.tabs.create({
			url: data.link ?? '',
			active: false,
		});
	}}>
		<div>
			<img className='popup-live-item-img' src={data.face} alt={data.uname} />
		</div>
		<div className='popup-live-item-info'>
			<div title={data.uname} className='popup-live-item-info-name'>{data.uname}</div>
			<div title={data.title} className='popup-live-item-info-title'>{data.title}</div>
		</div>
	</div>
);
