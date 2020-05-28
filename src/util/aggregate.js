const aggregateMap = {
	daily: 10,
	monthly: 7,
	yearly: 4,
};

/*
Params
	records: [{
		date: Date,
		amount: Number,
	}],
	period: String ('daily', 'monthly', 'yearly')
*/

export const aggregate = (records, period) => {
	const dateMap = {};
	
	// Aggregate & add to map
	records.forEach(r => {
		const aggDate = r.date.toISOString().substring(0, aggregateMap[period]);
		if (dateMap[aggDate])
			dateMap[aggDate] += r.amount;
		else
			dateMap[aggDate] = r.amount;
	});
	
	// Convert map to array
	const output = [];
	
	for (let key in dateMap) {
		
		let dateString = key;
		if (dateString.length === 4) dateString += '-00';
		if (dateString.length === 7) dateString += '-01';
		
		output.push({
			_id: new Date(...dateString.split('-')),
			date: new Date(...dateString.split('-')),
			amount: dateMap[key],
		});
	}
	
	return output;
};