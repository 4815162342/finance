import React, {Component, Fragment} from 'react';
import db from '../db/database';

class TransactionsList extends Component {
	state = {
		records: [],
	};
	
	componentDidMount() {
		// This is a huge hack, I'm coming back to this
		setTimeout(() => {
			db.Transactions.get(
				IDBKeyRange.bound('0', 'A'),
				records => this.setState({records})
			)
		}, 500);
	}
	
	componentWillUnmount() {
		db.close();
	}

	render() {
		const {records} = this.state;
		
		return (
			<div>
				{records.map(this.renderTransaction)}
			</div>
		);
	}
	
	renderTransaction(transaction) {
		return (
			<div key={transaction._id}>{transaction.amount}</div>
		)
	}
}

export default TransactionsList;