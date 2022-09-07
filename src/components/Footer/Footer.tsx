import React from 'react';
import { LinkOutlined } from '@ant-design/icons';

import logo from 'data-base64:~assets/icon512.png';

import './Footer.scss';

export const Footer: React.FC = () => {
	console.log('Footer');
	return (
		<div className={'footer'}>
			<div className='logo'>
				<img className='img' src={logo} alt="tuntun-logo" />
				<div className='title'>BiliBili Tools</div>
			</div>
			<div className='content'>
				<a rel='noreferrer' target='_blank' className='item' href='https://github.com/tuntun0609/bilibil-tool-mv3'>
					<div className='text'>GitHub</div>
					<LinkOutlined className='icon' />
				</a>
			</div>
		</div>
	);
};
