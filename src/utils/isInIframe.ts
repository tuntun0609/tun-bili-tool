// 是否在iframe中
export const isInIframe = () => self.frameElement && self.frameElement.tagName === 'IFRAME';
