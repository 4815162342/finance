const databaseSchemas = [{
	name: 'FinanceManager',
	version: 2,
	objectStoreSchema: [{
		name: 'Transactions',
		indexes: [
			{name: 'date', path: 'date'},
			{name: 'amount', path: 'amount'},
			{name: 'recipient', path: 'recipient'},
			{name: 'sender', path: 'sender'},
		],
	}],
}];

export {databaseSchemas}