/* eslint-disable react/react-in-jsx-scope */
import type { CSSProperties, ReactNode } from 'react';

export const PopupTitle = (props: { style?: CSSProperties, children: ReactNode }) => (
	<div style={props.style} className='popup-title'>{ props.children }</div>
);
