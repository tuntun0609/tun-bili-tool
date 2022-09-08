import React from 'react';
import { useStorage } from '@plasmohq/storage';

import { FromType, SettingForm, SettingFormItem } from '~components';

export const MainSetting: React.FC = () => {
	const [twoRow, setTwoRow] = useStorage('isTwoRow', false);
	const [livingList, setLivingList] = useStorage('isLivingList', false);
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
	];
	return (
		<SettingForm items={formConfig}></SettingForm>
	);
};
