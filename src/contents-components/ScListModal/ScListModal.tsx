/* eslint-disable react/react-in-jsx-scope */
import { List, Modal, ModalProps } from 'antd';

interface ScListModalProps extends ModalProps {
	scList: any[]
}

export const ScListModal = (props: ScListModalProps) => {
	const { scList } = props;
	return (
		<Modal
			destroyOnClose
			bodyStyle={{
				width: '100%',
			}}
			{...props}
		>
			<List
				bordered
				dataSource={scList}
				renderItem={item => (
					<List.Item style={{
						paddingRight: '0',
					}}>
						<div style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
						}}>
							<div style={{
								width: 'calc(100% - 240px)',
								whiteSpace: 'pre-line',
								wordBreak: 'break-all',
								wordWrap: 'break-word',
								paddingRight: '24px',
							}}>
								{item.danmu}
							</div>
							<div style={{
								width: '120px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderLeft: '1px solid #C9CCD0',
								whiteSpace: 'pre-line',
								wordBreak: 'break-all',
								wordWrap: 'break-word',
								padding: '0 8px',
							}}>
								<a style={{ color: '#000000d9' }} target={'_blank'} href={`https://space.bilibili.com/${item.uid}`} rel="noreferrer">
									{item.name}
								</a>
							</div>
							<div style={{
								width: '120px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderLeft: '1px solid #C9CCD0',
								whiteSpace: 'pre-line',
								wordBreak: 'break-all',
								wordWrap: 'break-word',
								padding: '0 8px',
							}}>
								{item.price}
							</div>
						</div>
					</List.Item>
				)}
				pagination={scList.length > 8 ? {
					pageSize: 8,
				} : false}
			></List>
		</Modal>
	);
};
