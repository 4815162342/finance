import React, {Component, Fragment} from 'react';
import db from '../db/database';
import './index.css';

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
		
		const table = (
			<table className="transactions-list">
				<thead>
					<tr>
						<th>Amount</th>
						<th>Date</th>
						<th>To</th>
					</tr>
				</thead>
				<tbody children={records.map(this.renderTransaction)} />
			</table>
		);
		
		return (<div
			className="transactions-list-wrapper"
			children={records.length? table : null}	
		/>);
	}
	
	renderTransaction(transaction) {
		if (isNaN(transaction.date)) return null;

		return (
			<tr key={transaction._id}>
				<td>{transaction.amount}</td>
				<td>{transaction.date.toISOString().substr(0, 10)}</td>
				<td>{transaction.recipient}</td>
				<td>{transaction._id}</td>
			</tr>
		)
	}
}

export default TransactionsList;