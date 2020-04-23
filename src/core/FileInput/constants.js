import {capitalize, trimWhitespace} from '../format';

export const draggingClass = 'dragging-file';
export const filetypeDelimiter = {
	'text/tab-separated-values': '\t',
	'text/csv': ',',
};

export const requiredFields = {
	date: {
		parse: a => new Date(a.substr(0, 10)),
		inputComponent: 'Select',
	},
	recipient: {
		parse: a => capitalize(trimWhitespace(a)),
		inputComponent: 'Select',
	},
	sender: {
		parse: a => a,
		inputComponent: 'Select',
	},
	amount: {
		parse: a => parseInt(100*parseFloat(a.replace(/\$| |,/g, ''))),
		inputComponent: 'Select',
	},
	note: {
		parse: a => a,
		inputComponent: 'Select',
	},
	source: {
		parse: a => a,
		inputComponent: 'input',
	}
};

export const requiredFieldsCopy = () => {
	const newMap = {...requiredFields};
	for (let field in newMap) newMap[field] = '';
	return newMap;
};