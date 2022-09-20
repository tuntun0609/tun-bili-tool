import React from 'react';
import { useStorage, Storage } from '@plasmohq/storage';
import { Button, message } from 'antd';

import { FromType, SettingForm, SettingFormItem } from '~components';

const storage = new Storage();

export const LiveSetting: React.FC = () => {
	const [liveTool, setLiveTool] = useStorage('isLiveTool', false);

	const resetLiveToolPosition = () => {
		try {
			storage.set('liveToolPosition', {
				top: 100,
				right: 100,
			});
			message.success('重置成功');
		} catch (error) {
			message.error('重置失败');
		}
	};

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
			extraRender: (
				<Button
					style={{
						marginLeft: '10px',
					}}
					onClick={resetLiveToolPosition}
				>重置按钮位置</Button>
			),
		},
	];
	return (
		<SettingForm items={formConfig}></SettingForm>
	);
};
