import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

export const InfiniteScrollLoader: React.FC = () => (
	<div style={{
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: '8px',
	}}>
		<LoadingOutlined style={{
			fontSize: '18px',
			color: '#fb7299',
			marginRight: '8px',
		}} />
			加载中...
	</div>
);
