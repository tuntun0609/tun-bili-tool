// 是否在iframe中
export const isInIframe = () => {
	if (self.frameElement && self.frameElement.tagName === 'IFRAME') {
		return true;
	}
	return false;
};
