import React, { HTMLAttributeAnchorTarget, ReactNode } from 'react';
import { LinkOutlined } from '@ant-design/icons';

import logo from 'data-base64:~assets/icon512.png';

import './Header.scss';

export interface HeaderProps {
	name: string,
	url: string,
	icon?: ReactNode,
	target?: HTMLAttributeAnchorTarget,
}

export const Header: React.FC<{items: HeaderProps[]}> = ({ items }) => {
	console.log('Header');
	return (
		<div className='header'>
			<div className='logo'>
				<img className='img' src={logo} alt="tuntun-logo" />
				<div className='title'>BiliBili Tools</div>
			</div>
			<div className='content'>
				{
					items.map(item => (
						<a key={item.name} rel='noreferrer' target={item.target ?? '_blank'} className='item' href={item.url}>
							<div className='text'>{item.name}</div>
							<div className='icon' >
								{item.icon ?? <LinkOutlined />}
							</div>
						</a>
					))
				}
			</div>
		</div>
	);
};
