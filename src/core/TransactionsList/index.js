import React, {Component} from 'react';
import db from '../db/database';
import Input from '../Input/';
import {money, elipsesText, ymd} from '../format';
import './index.css';

class TransactionsList extends Component {
	state = {
		records: [],
		viewCount: 100,
	};
	
	componentDidMount() {
		// This is a huge hack, I'm coming back to this
		setTimeout(() => {
			const {viewCount} = this.state;
			
			db.Transactions.get(
				{amount: IDBKeyRange.bound(0, 1000)},
				{count: viewCount},
				records => this.setState({records})
			)
		}, 500);
	}
	
	componentWillUnmount() {
		db.close();
	}

	render() {
		const {records, viewCount} = this.state;
		
		if (!records.length) return null;
		
		return (
			<div>
				<div className="transactions-list-wrapper">
					<table className="transactions-list">
						<thead>
							<tr>
								<th className="money">Amount</th>
								<th>Date</th>
								<th>From</th>
								<th>To</th>
								<th>Note</th>
							</tr>
						</thead>
						<tbody children={records.map(this.renderTransaction)} />
					</table>
				</div>
				<Input
					value={viewCount}
					onChange={viewCount => this.setState({viewCount})}
				/>
			</div>
		);
	}
	
	renderTransaction(transaction) {
		return (
			<tr key={transaction._id}>
				<td className="money">{money(transaction.amount)}</td>
				<td>{ymd(transaction.date)}</td>
				<td>{transaction.sender}</td>
				<td>{elipsesText(transaction.recipient)}</td>
				<td>{elipsesText(transaction.note)}</td>
				<td>{transaction._id.substr(0, 5)}</td>
			</tr>
		);
	}
}

export default TransactionsList;