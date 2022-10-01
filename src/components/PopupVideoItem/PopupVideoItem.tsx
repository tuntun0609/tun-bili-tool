import React from 'react';

import { Tool as tool } from '../../utils';

import './PopupVideoItem.scss';

export const PopupVideoItem: React.FC<{ data: any }> = ({ data }) => (
	<div className='popup-video-item'>
		<a href={data.uri} onClick={() => {
			chrome.tabs.create({
				url: data.uri ?? '',
			});
		}}>
			<div className='popup-video-item-img-card'>
				<img className='popup-video-item-img' src={data.pic} alt="" />
				<div className='popup-video-item-video-info'>
					<div style={{
						display: 'flex',
						alignItems: 'center',
					}}>
						<svg className='play-icon'>
							<path
								fillRule={'evenodd'}
								clipRule={'evenodd'}
								id={'path48'}
								d={'M3.742 3.424A52.952 52.952 0 0 1 8 3.25c1.714 0 3.208.088 4.258.174A1.45 1.45 0 0 1 13.6 4.745c.078.862.151 2.004.151 3.255s-.073 2.393-.15 3.255a1.45 1.45 0 0 1-1.342 1.321c-1.05.086-2.544.174-4.258.174s-3.208-.088-4.258-.174A1.45 1.45 0 0 1 2.4 11.254 36.666 36.666 0 0 1 2.25 8c0-1.25.073-2.393.15-3.254a1.45 1.45 0 0 1 1.342-1.322ZM8 2.25c-1.747 0-3.27.09-4.34.177a2.45 2.45 0 0 0-2.255 2.229C1.325 5.539 1.25 6.712 1.25 8c0 1.288.075 2.461.155 3.344a2.45 2.45 0 0 0 2.255 2.229A53.91 53.91 0 0 0 8 13.75c1.747 0 3.27-.09 4.34-.177a2.45 2.45 0 0 0 2.255-2.229c.08-.882.155-2.056.155-3.344 0-1.288-.075-2.462-.155-3.345a2.45 2.45 0 0 0-2.255-2.228A53.953 53.953 0 0 0 8 2.25Zm1.75 6.328a.667.667 0 0 0 0-1.155l-2.5-1.444a.667.667 0 0 0-1 .577v2.888c0 .513.555.834 1 .578l2.5-1.444Z'}
							></path>
						</svg>
						<div style={{ marginLeft: '4px' }}>{tool.formatBigNumber(data.stat?.view ?? 0)}</div>
					</div>
					<div>{tool.formatDuration(data.duration)}</div>
				</div>
			</div>
			<div
				title={data.title ?? ''}
				className='popup-video-item-title'
			>{data.title ?? ''}</div>
			<div className='popup-video-item-video-owner'>
				<svg className='up-icon'>
					<path
						fillRule={'evenodd'}
						clipRule={'evenodd'}
						id={'path48'}
						d={'M0 2.5A2.5 2.5 0 0 1 2.5 0h8.334a2.5 2.5 0 0 1 2.5 2.5v5.666a2.5 2.5 0 0 1-2.5 2.5H2.5a2.5 2.5 0 0 1-2.5-2.5ZM2.5 1A1.5 1.5 0 0 0 1 2.5v5.666a1.5 1.5 0 0 0 1.5 1.5h8.334a1.5 1.5 0 0 0 1.5-1.5V2.5a1.5 1.5 0 0 0-1.5-1.5zM3 2.833a.5.5 0 0 1 .5.5v2.5a1 1 0 1 0 2 0v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-4 0v-2.5a.5.5 0 0 1 .5-.5Zm4.667 0a.5.5 0 0 0-.5.5v4a.5.5 0 1 0 1 0v-.667H9.25a1.917 1.917 0 1 0 0-3.833zM9.25 5.666H8.167V3.833H9.25a.917.917 0 1 1 0 1.833z'}
					></path>
				</svg>
				<div style={{
					marginLeft: '4px',
					// maxWidth: '90px',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
				}} title={data.owner?.name ?? ''}>{data.owner?.name ?? ''}</div>
				<div className='popup-video-item-video-pubdate'>
					· {tool.diffTime(data.pubdate)}
				</div>
			</div>
		</a>
	</div>
);
