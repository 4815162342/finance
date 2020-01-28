export const money = amt => {
	amt = parseInt(amt);
	if (isNaN(amt)) return '';
	let parts = (amt / 100).toFixed(2).split('.');
	let prefix = (amt < 0) ? '- ' : '';
	return prefix + '$' + Math.abs(parts[0]).toLocaleString() + '.' + parts[1];
};

// Remove superfluous space chars
export const trimWhitespace = str => str.trim().replace(/ +/g, ' ');

// Capitalize the first letter of every word
export const capitalize = str => str? str.toLowerCase().split(' ').map(el=>el[0].toUpperCase() + el.slice(1)).join(' ') : str;