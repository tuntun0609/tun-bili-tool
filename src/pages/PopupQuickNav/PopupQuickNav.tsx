import React, { useState } from 'react';
import { useStorage } from '@plasmohq/storage';
import { Form, Input, Modal } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import { PopupQuickNavItem } from '../../components';
import './PopupQuickNav.scss';

export const PopupQuickNav: React.FC = () => {
	const [quickNav, setQuickNav] = useStorage('quickNavigationData', []);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [form] = Form.useForm();
	const addQuickNav = () => {
		setAddModalOpen(true);
	};
	const onAddModalCancel = () => {
		setAddModalOpen(false);
	};
	const onAddModalOk = () => {
		form
			.validateFields()
			.then((values) => {
				setQuickNav([...quickNav, values]);
				setAddModalOpen(false);
				form.resetFields();
			});
	};
	const onItemDelete = (item: {
		name: string,
		url: string,
	}) => {
		setQuickNav(quickNav.filter(qn => (qn.name !== item.name)));
	};
	return (
		<div className='popup-list' style={{
			display: 'flex',
			justifyContent: 'space-between',
			flexWrap: 'wrap',
			alignContent: 'flex-start',
		}}>
			{
				quickNav.map(item => (
					<PopupQuickNavItem key={item.name} item={item} onDelete={(e) => {
						e.stopPropagation();
						onItemDelete(item);
					}}></PopupQuickNavItem>
				))
			}
			<div className='popup-quick-nav-add' onClick={addQuickNav}>
				<PlusCircleOutlined style={{
					fontSize: '24px',
					color: '#fb7299',
				}} />
			</div>
			<Modal
				open={addModalOpen}
				title={'增加导航'}
				width={300}
				okText={'添加'}
				cancelText={'返回'}
				onCancel={onAddModalCancel}
				onOk={onAddModalOk}
			>
				<Form
					form={form}
					layout={'vertical'}
					name={'addQuickNav'}
				>
					<Form.Item
						name={'name'}
						label={'名称'}
						rules={[
							{ required: true, message: '请输入名称' },
							{ validator: async (rule, value) => {
								if (!quickNav.every(item => (item.name !== value))) {
									throw new Error('请不要输入重复名称');
								}
							}, message: '请不要输入重复名称' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name={'url'}
						label={'跳转链接(需包含https/http)'}
						rules={[{ required: true, message: '请输入跳转链接' }]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};
