import React from 'react';
import { useStorage } from '@plasmohq/storage';

import { FromType, SettingForm, SettingFormItem } from '~components';

export const LiveSetting: React.FC = () => {
	const [liveTool, setLiveTool] = useStorage('isLiveTool', false);
	const formConfig: SettingFormItem[] = [
		{
			type: FromType.SWITCH,
			label: '是否自动开启直播工具',
			name: 'liveTool',
			formProps: {
				checked: liveTool,
				onClick: (checked) => {
					setLiveTool(checked);
				},
			},
		},
	];
	return (
		<SettingForm items={formConfig}></SettingForm>
	);
};
