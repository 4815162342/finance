export const money = amt => {
	amt = parseInt(amt);
	if (isNaN(amt)) return '';
	let parts = (amt / 100).toFixed(2).split('.');
	let prefix = (amt < 0) ? '- ' : '';
	return prefix + '$' + Math.abs(parts[0]).toLocaleString() + '.' + parts[1];
};

// Capitalize the first letter of every word
export const capitalize = str => str.split(' ').map(el=>el[0].toUpperCase() + el.slice(1)).join(' ');