import React, { Component, Fragment } from 'react';
import TransactionsList from 'core/TransactionsList';
import FileInput from 'core/FileInput';

class TransactionsListPage extends Component {
	render() {
		return (
			<Fragment>
				<FileInput />
				<TransactionsList />
			</Fragment>
		);
	}
}

export default TransactionsListPage;