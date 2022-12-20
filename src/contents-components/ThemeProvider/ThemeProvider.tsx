import React, { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

export const ThemeProvider = ({ children }: { children: null | ReactNode }) => (
	<ConfigProvider
		theme={{
			token: {
				colorPrimary: '#fb7299',
				colorSuccess: '#52c41a',
				colorWarning: '#faad14',
				colorError: '#f5222d',
			},
		}}
		locale={zhCN}
	>
		{children}
	</ConfigProvider>
);
