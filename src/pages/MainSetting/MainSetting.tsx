import React from 'react';
import { useStorage } from '@plasmohq/storage';

import { FromType, SettingForm, SettingFormItem } from '~components';

export const MainSetting: React.FC = () => {
	const [twoRow, setTwoRow] = useStorage('isTwoRow', false);
	const [livingList, setLivingList] = useStorage('isLivingList', false);
	const [isIndexDark, setIsIndexDark] = useStorage('isIndexDark', false);
	const [isHomeRecRepaint, setIsHomeRecRepaint] = useStorage('isHomeRecRepaint', false);
	const [isCloseHomeFullScreenPreview, setCloseIsHomeFullScreenPreview] = useStorage('isCloseHomeFullScreenPreview', false);
	const formConfig: SettingFormItem[] = [
		{
			type: FromType.SWITCH,
			label: '是否开启动态首页双列展示',
			name: 'isTwoRow',
			formProps: {
				checked: twoRow,
				onClick: (checked) => {
					setTwoRow(checked);
				},
			},
		},
		{
			type: FromType.SWITCH,
			label: '是否开启【正在直播】列表加强版',
			name: 'isLivingList',
			formProps: {
				checked: livingList,
				onClick: (checked) => {
					setLivingList(checked);
				},
			},
		},
		{
			type: FromType.SWITCH,
			label: '是否开启动态首页暗黑模式',
			name: 'isIndexDark',
			formProps: {
				checked: isIndexDark,
				onClick: (checked) => {
					setIsIndexDark(checked);
				},
			},
		},
		{
			type: FromType.SWITCH,
			label: '是否开启首页推荐视频布局优化',
			name: 'isHomeRecRepaint',
			formProps: {
				checked: isHomeRecRepaint,
				onClick: (checked) => {
					setIsHomeRecRepaint(checked);
				},
			},
		},
		{
			type: FromType.SWITCH,
			label: '是否关闭首页视频全屏预览',
			name: 'isHomeFullScreenPreview',
			formProps: {
				checked: isCloseHomeFullScreenPreview,
				onClick: (checked) => {
					setCloseIsHomeFullScreenPreview(checked);
				},
			},
		},
	];
	return (
		<SettingForm items={formConfig}></SettingForm>
	);
};
