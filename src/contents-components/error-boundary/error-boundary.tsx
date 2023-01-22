import React from 'react';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Tool } from '~utils';

type Props = any;

export class ErrorBoundary extends React.Component<Props, {
	hasError: boolean,
	hide: boolean,
	errorInfo: any,
}> {
	constructor(props: Props | Readonly<Props>) {
		super(props);
		this.state = { hasError: false, hide: false, errorInfo: null };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: any, errorInfo: any) {
		this.setState({ errorInfo: `${error?.toString()}\n${errorInfo?.componentStack}` });
		console.error(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{
					display: this.state.hide ? 'none' : 'block',
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
							justifyContent: 'space-between',
							alignItems: 'center',
							color: '#fb7299',
						}}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<ExclamationCircleOutlined style={{
									marginRight: '4px',
								}} />
								tun bili tool提示：
							</div>
							<PlusOutlined
								rotate={45}
								onClick={() => this.setState({ hide: true })}
							/>
						</div>
						有一些错误导致了插件崩溃，请点击
						<a
							style={{
								cursor: 'pointer',
								color: '#f77399',
							}}
							onClick={(e) => {
								e.preventDefault();
								Tool.copyDataToClipboard(`${window.location.href}\n\n${this.state.errorInfo}`);
							}}
						>
							复制错误信息
						</a>
						后，联系
						<a
							style={{
								cursor: 'pointer',
								color: '#f77399',
							}}
							target={'_blank'}
							href='https://message.bilibili.com/#/whisper/mid47706697'
							rel="noreferrer"
						>开发者</a>
						或者重新
						<a
							style={{
								cursor: 'pointer',
								color: '#f77399',
							}}
							onClick={(e) => {
								e.preventDefault();
								location.reload();
							}}
						>刷新页面</a>
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}
