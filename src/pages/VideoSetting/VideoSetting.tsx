/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useStorage, Storage } from '@plasmohq/storage';
import { Button, message } from 'antd';

import { FromType, SettingForm, SettingFormItem } from '~components';

const storage = new Storage();

export const VideoSetting: React.FC = () => {
	const [videoLoop, setVideoLoop] = useStorage('isVideoLoop', false);
	const [wideScreen, setWideScreen] = useStorage('isWideScreen', false);
	const [videoTool, setVideoTool] = useStorage('isVideoTool', false);
	const [videoDescOpen, setVideoDescOpen] = useStorage('isVideoDescOpen', false);

	const resetVideoToolPosition = () => {
		try {
			storage.set('videoToolPosition', {
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
			label: '是否自动开启洗脑循环',
			name: 'isVideoLoop',
			extraDes: '视频默认开启循环',
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
			label: '视频简介自动展开',
			name: 'isVideoDescOpen',
			formProps: {
				checked: videoDescOpen,
				onClick: (checked) => {
					setVideoDescOpen(checked);
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
			extraRender: (
				<Button
					style={{
						marginLeft: '10px',
					}}
					onClick={resetVideoToolPosition}
				>重置按钮位置</Button>
			),
		},
	];
	return (
		<SettingForm items={formConfig}></SettingForm>
	);
};

