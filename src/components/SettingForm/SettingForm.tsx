import React from 'react';
import { Form, InputProps, Switch, SwitchProps } from 'antd';

import './SettingForm.scss';

export type SettingFormItem = SwitchFormItem | InputFormItem;

interface CommonFormItem {
	label: string,
	name: string,
}

export enum FromType {
	SWITCH = 'Switch',
	INPUT = 'Input',
}

export interface SwitchFormItem extends CommonFormItem {
	type: FromType.SWITCH,
	formProps: SwitchProps,
}

export interface InputFormItem extends CommonFormItem {
	type: FromType.INPUT,
	formProps: InputProps,
}

export const SettingForm: React.FC<{ items: SettingFormItem[] }> = ({ items }) => {
	const getFormItem = (item: SettingFormItem) => {
		switch (item.type) {
		case FromType.SWITCH: {
			const { formProps } = item;
			return <Switch
				onClick={formProps.onClick}
				checked={formProps.checked}
				defaultChecked={formProps.checked}
			></Switch>;
		}
		default:
			return null;
		}
	};
	const layout = {
		labelCol: {
			style: {
				minWidth: '200px',
			},
		},
	};
	return (
		<Form
			{...layout}
			labelWrap
			labelAlign={'left'}
			size={'middle'}
		>
			{
				items.map(item => (
					<Form.Item
						key={item.name}
						label={<div style={{ fontSize: '14px' }}>{item.label}</div>}
						name={item.name}
					>
						{
							getFormItem(item)
						}
					</Form.Item>
				))
			}
		</Form>
	);
};
