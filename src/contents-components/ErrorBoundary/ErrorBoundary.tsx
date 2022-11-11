import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type Props = any;

export class ErrorBoundary extends React.Component<Props, {
	hasError: boolean,
}> {
	constructor(props: Props | Readonly<Props>) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: any, errorInfo: any) {
		console.error(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{
					position: 'fixed',
					left: '12px',
					bottom: '12px',
					fontSize: '16px',
					width: 'auto',
					padding: '10px',
					backgroundColor: '#fef0f1',
					borderLeft: '5px solid #fb7299',
					borderRadius: '7px',
					color: '#4b1113',
					boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
				}}>
					<div>
						<div style={{
							height: '24px',
							display: 'flex',
							fontSize: '18px',
							alignItems: 'center',
							color: '#fb7299',
						}}>
							<ExclamationCircleOutlined style={{
								marginRight: '4px',
							}} />
							tun bili tool提示：
						</div>
						有一些错误导致了插件崩溃,请联系
						<a target={'_blank'} href='https://message.bilibili.com/#/whisper/mid47706697' rel="noreferrer">开发者</a>
						或者重新
						<a onClick={(e) => {
							e.preventDefault();
							location.reload();
						}}>刷新页面</a>
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}
