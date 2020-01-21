import React, {Component, Fragment} from 'react';
import db from '../db/database';

class TransactionsList extends Component {
	state = {
		records: [],
	};
	
	// componentDidMount() {
	// 	db = new Database();
	// 	console.log(db, db.Transactions)
	// 	//db.Transactions.get(IDBKeyRange.lowerBound('Z'), console.log)
	// }
	
	// componentWillUnmount() {
	// 	db.close();
	// }

	render() {
		const {records} = this.state;
		console.log(db)
		
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