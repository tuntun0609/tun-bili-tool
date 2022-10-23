/* eslint-disable react/react-in-jsx-scope */
import { List, Modal, ModalProps } from 'antd';

interface ScListModalProps extends ModalProps {
	scList: (string | number)[]
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
					<List.Item>
						{item}
					</List.Item>
				)}
				pagination={{
					pageSize: 10,
				}}
			></List>
		</Modal>
	);
};
