export const draggingClass = 'dragging-file';
export const filetypeDelimiter = {
	'text/tab-separated-values': '\t',
	'text/csv': ',',
};

export const requiredFieldsParse = {
	Date: a => new Date(a),
	Recipient: a => a,
	Amount: a => parseFloat(a.replace(/\$| /g, '')),
};
export const requiredFieldsList = Object.keys(requiredFieldsParse);
export const requiredFieldsMap = () => {
	const newMap = {...requiredFieldsMap};
	for (let field in newMap) newMap[field] = '';
	return newMap;
};