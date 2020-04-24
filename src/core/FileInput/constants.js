import {capitalize, trimWhitespace} from '../format';

export const draggingClass = 'dragging-file';
export const filetypeDelimiter = {
	'text/tab-separated-values': '\t',
	'text/csv': ',',
};

export const requiredFields = {
	date: {
		parse: a => new Date(a.substr(0, 10)),
	},
	recipient: {
		parse: a => capitalize(trimWhitespace(a)),
	},
	sender: {
		parse: a => a,
	},
	amount: {
		parse: a => parseInt(100*parseFloat(a.replace(/\$| |,/g, ''))),
	},
	note: {
		parse: a => a,
	},
};

export const requiredFieldsCopy = () => {
	const newMap = {...requiredFields};
	for (let field in newMap) newMap[field] = '';
	return newMap;
};