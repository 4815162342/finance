import React, {Component} from 'react';
import db from '../db/database';
import {money} from '../format';
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
						<th>From</th>
						<th>To</th>
						<th>Note</th>
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
		const dateFormatted = !transaction.date || isNaN(transaction.date)?
			'':
			transaction.date.toISOString().substr(0, 10);
		
		return (
			<tr key={transaction._id}>
				<td>{money(transaction.amount)}</td>
				<td>{dateFormatted}</td>
				<td>{transaction.sender}</td>
				<td>{transaction.recipient}</td>
				<td>{transaction.note.substr(0, 20)}</td>
				<td>{transaction._id.substr(0, 5)}</td>
			</tr>
		)
	}
}

export default TransactionsList;