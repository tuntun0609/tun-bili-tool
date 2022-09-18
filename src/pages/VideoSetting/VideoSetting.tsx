/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useStorage } from '@plasmohq/storage';

import { FromType, SettingForm, SettingFormItem } from '~components';

export const VideoSetting: React.FC = () => {
	const [videoLoop, setVideoLoop] = useStorage('isVideoLoop', false);
	const [wideScreen, setWideScreen] = useStorage('isWideScreen', false);
	const [videoTool, setVideoTool] = useStorage('isVideoTool', false);
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
				checked: wideScreen,
				onClick: (checked) => {
					setWideScreen(checked);
				},
			},
		},
		{
			type: FromType.SWITCH,
			label: '是否开启视频工具',
			name: 'isVideoTool',
			formProps: {
				checked: videoTool,
				onClick: (checked) => {
					setVideoTool(checked);
				},
			},
		},
	];
	return (
		<SettingForm items={formConfig}></SettingForm>
	);
};

