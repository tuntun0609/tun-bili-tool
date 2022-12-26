/* eslint-disable react/react-in-jsx-scope */
import type { CSSProperties, ReactNode } from 'react';

export const PopupTitle = (props: {
	style?: CSSProperties,
	extra?: React.ReactNode,
	children: ReactNode,
}) => (
	<div style={{
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		...props.style,
	}}>
		<span className='popup-title'>{ props.children }</span>
		{ props.extra }
	</div>
);
