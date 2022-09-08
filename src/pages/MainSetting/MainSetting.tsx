/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useStorage } from '@plasmohq/storage';

import { FromType, SettingForm, SettingFormItem } from '~components';

export const MainSetting: React.FC = () => {
	const [videoLoop, setVideoLoop] = useStorage('isVideoLoop', false);
	const [widescreen, setWidescreen] = useStorage('isWidescreen', false);
	const formConfig: SettingFormItem[] = [
		{
			type: FromType.SWITCH,
			label: '是否自动开启洗脑循环',
			name: 'isVideoLoop',
			formProps: {
				checked: videoLoop,
				onClick: (checked) => {
					setVideoLoop(checked);
				},
			},
		},
		{
			type: FromType.SWITCH,
			label: '是否开启默认宽屏',
			name: 'isWidescreen',
			formProps: {
				checked: widescreen,
				onClick: (checked) => {
					setWidescreen(checked);
				},
			},
		},
	];
	return (
		<SettingForm items={formConfig}></SettingForm>
	);
};
