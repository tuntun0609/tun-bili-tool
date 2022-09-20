import React from 'react';
import { Form, InputProps, Switch, SwitchProps, Tooltip } from 'antd';

import './SettingForm.scss';

export type SettingFormItem = SwitchFormItem | InputFormItem;

interface CommonFormItem {
	label: string,
	name: string,
	extraRender?: React.ReactNode,
	extraDes?: React.ReactNode,
}

export enum FromType {
	SWITCH = 'Switch',
	INPUT = 'Input',
}

export interface SwitchFormItem extends CommonFormItem {
	type: FromType.SWITCH,
	formProps?: SwitchProps,
}

export interface InputFormItem extends CommonFormItem {
	type: FromType.INPUT,
	formProps?: InputProps,
}

const getFormItem = (item: SettingFormItem) => {
	switch (item.type) {
	case FromType.SWITCH: {
		const { formProps } = item;
		return <Switch
			{...formProps}
		></Switch>;
	}
	default:
		return null;
	}
};

export const SettingForm: React.FC<{ items: SettingFormItem[] }> = ({ items }) => {
	const layout = {
		labelCol: {
			style: {
				minWidth: '250px',
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
						label={
							<Tooltip
								trigger='hover'
								title={item.extraDes}
								style={{ fontSize: '14px' }}
								color='#fb7299'
								placement='topLeft'
							>
								{item.label}
							</Tooltip>
						}
						name={item.name}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{ getFormItem(item) }
							{ item.extraRender ? item.extraRender : null }
						</div>
					</Form.Item>
				))
			}
		</Form>
	);
};
