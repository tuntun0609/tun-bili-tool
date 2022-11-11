import React from 'react';

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
				<div>
					<span>有一些错误导致了崩溃,请联系<a target={'_blank'} href='https://message.bilibili.com/#/whisper/mid47706697' rel="noreferrer">开发者</a>或者重新刷新页面</span>
				</div>
			);
		}
		return this.props.children;
	}
}
