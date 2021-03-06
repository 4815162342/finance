export default {
	storageKeys: {
		direction: 'transactionsListSortDirection',
		field: 'transactionsListSortField',
		search: 'transactionsListSearch',
	},
	headers: [{
		name: 'amount',
		sortable: true,
	}, {
		name: 'date',
		sortable: true,
	}, {
		name: 'sender',
		sortable: true,
	}, {
		name: 'recipient',
		sortable: true,
	}, {
		name: 'note',
		sortable: false,
	}],
}