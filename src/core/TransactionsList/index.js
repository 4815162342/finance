import React, {Component} from 'react';
import db from '../db/database';
import Input from '../Input/';
import {money, elipsesText, ymd, plural} from '../format';
import './index.css';

class TransactionsList extends Component {
	state = {
		records: [],
		viewCount: 300,
		selectedRows: [],
	};
	
	componentDidMount() {
		// This is a huge hack, I'm coming back to this
		setTimeout(() => {
			const {viewCount} = this.state;
			
			db.Transactions.get(
				//{amount: IDBKeyRange.bound(0, 1000)},
				{transactionDate: IDBKeyRange.lowerBound(new Date('2019-12-01'))},
				{count: viewCount},
				records => this.setState({records})
			)
		}, 500);
	}
	
	componentWillUnmount() {
		db.close();
	}

	render() {
		const {records, viewCount, selectedRows} = this.state;
		
		if (!records.length) return null;
		
		let selectedRowInfoClasses = ['transactions-list-tools'];
		if (!selectedRows.length) {
			selectedRowInfoClasses.push('no-display');
		}
		
		const selectedSum = selectedRows.reduce((acc, cur) => {
			return acc + records.find(r => r._id === cur).amount || 0;
		}, 0);
		
		return (
			<div>
				<div className={selectedRowInfoClasses.join(' ')}>
					<div><button
						onClick={this.onClickHide}
						children={`Hide ${plural(selectedRows.length, 'transaction')}`}
					/></div>
					<div>Sum: <b children={money(selectedSum)}/></div>
					<div>Count: <b children={selectedRows.length}/></div>
					<div>Average: <b children={money(selectedSum/selectedRows.length)}/></div>
				</div>
				<div className="transactions-list-wrapper">
					<table className="transactions-list">
						<thead>
							<tr>
								<th>
									<Input
										type="checkbox"
										checked={selectedRows.length === records.length}
										onChange={this.toggleAllRows}
									/>
								</th>
								<th className="money">Amount</th>
								<th>Date</th>
								<th>From</th>
								<th>To</th>
								<th>Note</th>
								<th></th>
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
	
	renderTransaction = transaction => {
		const {selectedRows} = this.state;
		
		const isSelected = selectedRows.includes(transaction._id);
		let rowClasses = [];
		if (isSelected) rowClasses.push('selected');
		
		return (
			<tr key={transaction._id} className={rowClasses.join(' ')}>
				<td>
					<Input
						type="checkbox"
						checked={isSelected}
						onChange={() => this.toggleRow(transaction._id)}
					/>
				</td>
				<td className="money">{money(transaction.amount)}</td>
				<td>{ymd(transaction.date)}</td>
				<td>{transaction.sender}</td>
				<td>{elipsesText(transaction.recipient)}</td>
				<td>{elipsesText(transaction.note)}</td>
				<td>
					<button
						onClick={() => this.openNote(transaction)}
						children={transaction._id.substr(0, 5)}
					/>
				</td>
			</tr>
		);
	}
	
	openNote = transaction => {
		const note = prompt('Enter new note', transaction.note);
		if (note !== null)
			db.Transactions.update(transaction._id, {$set:{note}})
	}
	
	toggleAllRows = () => {
		const {records, selectedRows} = this.state;
		
		const newState = records.length === selectedRows.length?
			[]:
			records.map(r=>r._id);
		
		this.setState({'selectedRows': newState});
	}
	
	toggleRow = _id => {
		const {selectedRows} = this.state;
		
		let newSelectedRows = selectedRows.includes(_id)?
			selectedRows.filter(a => a !== _id):
			[...selectedRows, _id];
		
		this.setState({'selectedRows': newSelectedRows});
	}
	
	onClickHide = () => {
		const {selectedRows} = this.state;
		
		selectedRows.forEach(_id => db.Transactions.update(_id, {$set:{'hidden': true}}))
	}
}

export default TransactionsList;