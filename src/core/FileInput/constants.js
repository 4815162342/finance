import {capitalize, trimWhitespace} from '../format';

export const draggingClass = 'dragging-file';
export const filetypeDelimiter = {
	'text/tab-separated-values': '\t',
	'text/csv': ',',
};

export const requiredFieldsParse = {
	date: a => new Date(a.substr(0, 10)),
	recipient: a => capitalize(trimWhitespace(a)),
	sender: a => a,
	amount: a => parseInt(100*parseFloat(a.replace(/\$| |,/g, ''))),
	note: a => a,
};
export const requiredFieldsList = Object.keys(requiredFieldsParse);
export const requiredFieldsCopy = () => {
	const newMap = {...requiredFieldsParse};
	for (let field in newMap) newMap[field] = '';
	return newMap;
};