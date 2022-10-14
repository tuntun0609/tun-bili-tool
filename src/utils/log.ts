export const log = (content?: any) => {
	if (process.env.NODE_ENV === 'development' && content) {
		console.log(content);
	}
};
