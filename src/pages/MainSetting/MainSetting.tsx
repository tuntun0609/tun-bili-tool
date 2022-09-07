/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useStorage } from '@plasmohq/storage';

import { SettingForm, SettingFormItem } from '~components';

export const MainSetting: React.FC = () => {
	const [videoLoop, setVideoLoop] = useStorage(
		'isVideoLoop',
	);
	const formConfig: SettingFormItem[] = [
		{
			type: 'Switch',
			label: '是否自动开启洗脑循环',
			name: 'isVideoLoop',
			value: videoLoop,
			onClick: (checked) => {
				setVideoLoop(checked);
			},
		},
	];
	return (
		<SettingForm items={formConfig}></SettingForm>
	);
};
