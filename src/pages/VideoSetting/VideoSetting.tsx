import React, { useEffect } from 'react';
import { useStorage, Storage } from '@plasmohq/storage';
import { Button, Checkbox, Form, message, Switch } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

import { videoWrapShieldCheckboxOptions } from '../../utils';

const storage = new Storage();

export const VideoSetting: React.FC = () => {
	const [videoLoop, setVideoLoop] = useStorage('isVideoLoop', false);
	const [wideScreen, setWideScreen] = useStorage('isWideScreen', false);
	const [videoTool, setVideoTool] = useStorage('isVideoTool', false);
	const [videoDescOpen, setVideoDescOpen] = useStorage('isVideoDescOpen', false);
	const [videoWrapShield, setVideoWrapShield] = useStorage('isVideoWrapShield', false);
	const [videoWrapShieldOptions, setVideoWrapShieldOptions] = useStorage('videoWrapShieldOptions', []);
	const [form] = Form.useForm();

	useEffect(() => {
		if (videoWrapShield) {
			form.setFieldValue('videoWrapShieldOptions', videoWrapShieldOptions);
		}
	}, [videoWrapShield]);

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

	// 视频卡片配置项改变
	const onVideoWrapShieldChange = (checkedValues: CheckboxValueType[]) => {
		setVideoWrapShieldOptions(checkedValues);
	};

	return (
		<>
			<Form
				form={form}
				labelCol={{
					style: {
						minWidth: '250px',
					},
				}}
				labelWrap
				labelAlign={'left'}
				size={'middle'}
			>
				<Form.Item
					label={'是否自动开启洗脑循环'}
					name={'isVideoLoop'}
				>
					<Switch
						checked={videoLoop}
						onClick={(checked) => {
							setVideoLoop(checked);
						}}
					></Switch>
				</Form.Item>
				<Form.Item
					label={'是否开启默认宽屏'}
					name={'isWideScreen'}
				>
					<Switch
						checked={wideScreen}
						onClick={(checked) => {
							setWideScreen(checked);
						}}
					></Switch>
				</Form.Item>
				<Form.Item
					label={'视频简介自动展开'}
					name={'isVideoDescOpen'}
				>
					<Switch
						checked={videoDescOpen}
						onClick={(checked) => {
							setVideoDescOpen(checked);
						}}
					></Switch>
				</Form.Item>
				<Form.Item
					label={'是否开启视频工具'}
					name={'isVideoTool'}
				>
					<div>
						<Switch
							checked={videoTool}
							onClick={(checked) => {
								setVideoTool(checked);
							}}
						></Switch>
						<Button
							style={{
								marginLeft: '10px',
							}}
							onClick={resetVideoToolPosition}
						>重置按钮位置</Button>
					</div>
				</Form.Item>
				<Form.Item
					label={'是否开启视频卡片屏蔽'}
					name={'isVideoWrapShield'}
				>
					<Switch
						checked={videoWrapShield}
						onClick={(checked) => {
							setVideoWrapShield(checked);
						}}
					></Switch>
				</Form.Item>
				{
					videoWrapShield
						? <Form.Item
							name={'videoWrapShieldOptions'}
						>
							<Checkbox.Group
								options={videoWrapShieldCheckboxOptions}
								onChange={onVideoWrapShieldChange}
							/>
						</Form.Item>
						: null
				}
			</Form>
		</>
	);
};

