import React from 'react';
import { Form, Switch } from 'antd';

import './SettingForm.scss';

export interface SettingFormItem {
	type: string,
	label: string,
	name: string,
	onChange?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void,
	onClick?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void,
	value: any;
}

export const SettingForm: React.FC<{ items: SettingFormItem[] }> = ({ items }) => {
	const getFormItem = (item: SettingFormItem) => {
		switch (item.type) {
		case 'Switch':
			return <Switch onClick={item.onClick} checked={item.value}></Switch>;
		default:
			return null;
		}
	};
	return (
		<Form
			labelAlign={'left'}
			labelCol={{ span: 6 }}
			size={'large'}
		>
			{
				items.map(item => (
					<Form.Item key={item.name} label={<div style={{ fontSize: '14px' }}>{item.label}</div>} name={item.name}>
						{
							getFormItem(item)
						}
					</Form.Item>
				))
			}
		</Form>
	);
};
