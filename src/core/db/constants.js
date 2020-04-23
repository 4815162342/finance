const databaseSchemas = [{
	name: 'FinanceManager',
	objectStoreSchema: [{
		name: 'Transactions',
		indexes: [
			{name: 'transactionDate', path: 'date'},
			{name: 'amount', path: 'amount'},
			{name: 'recipient', path: 'recipient'},
			{name: 'sender', path: 'sender'},
		],
	}],
}];

export {databaseSchemas}