export const parseCSV = ({data, onRowEnd, delimiter}) => {
	let curIndex = 0;
	let row = [];
	let quotesOpen = false;
	let endOfCell = false;
	let endOfRow = false;
	let cell = '';
	
	while (curIndex < data.length) {
		let char = data.charAt(curIndex);
		
		if (char === '"')
			quotesOpen = !quotesOpen;
		else if (char === delimiter)
			quotesOpen? cell += char : endOfCell = true;
		else if (char === '\n') {
			if (quotesOpen)
				cell += char;
			else {
				endOfRow = true;
				endOfCell = true;
			}
		}
		else
			cell += char;
		
		if (endOfCell) {
			row.push(cell);
			endOfCell = false;
			cell = '';
		}
		
		if (endOfRow) {
			onRowEnd(row);
			row = [];
			endOfRow = false;
		}
		curIndex++;
	}
};