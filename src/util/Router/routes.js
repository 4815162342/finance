import React from 'react';
import TransactionsListPage from 'pages/TransactionsList';
import GraphsPage from 'pages/Graphs';

const routes = [{
	path: '/',
	name: 'List',
	component: <TransactionsListPage />,
}, {
	path: '/graph',
	name: 'Graph',
	component: <GraphsPage />,
}, {
	path: '*',
	component: "not found :(",
}];

export {routes}