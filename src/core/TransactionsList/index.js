import React, { Component, Fragment } from 'react';

import db from '../db/database';
import Input from '../Input';
import Button from '../Button';
import {money, elipsesText, ymd, plural} from '../format';
import './index.css';

class TransactionsList extends Component {
	state = {
		records: [],
		viewCount: 300,
		selectedRows: [],
		editingRow: {},
	};
	
	// example = () => {
	// 	const [count, setCount] = useState(0);
	//
	// 	// Similar to componentDidMount and componentDidUpdate:
	// 	useEffect(() => {
	// 	// Update the document title using the browser API
	// 		document.title = `You clicked ${count} times`;
	// 	});
	//
	// 	return (
	// 		<div>
	// 			<p>You clicked {count} times</p>
	// 			<button onClick={() => setCount(count + 1)}>
	// 				Click me
	// 			</button>
	// 		</div>
	// 	);
	// }
	//
	componentDidMount() {
		// This is a huge hack, I'm coming back to this
		const {viewCount} = this.state;
		
		db.Transactions.registerListener({
			type: 'put',
			fn: newRecord => {
				console.log(this.state, newRecord)
				const newRecords = [...this.state.records, newRecord];
				this.setState({records: newRecords});
			},
			name: 'transaction_list_put',
		});
		
		db.Transactions.registerListener({
			type: 'update',
			fn: updatedRecord => {
				const newRecords = this.state.records.map(r => r._id === updatedRecord._id? updatedRecord: r);
				this.setState({records: newRecords});
			},
			name: 'transaction_list_update',
		});
		
		setTimeout(() => {
			db.Transactions.get(
				//{amount: IDBKeyRange.bound(0, 1000)},
				{transactionDate: IDBKeyRange.lowerBound(new Date('2019-12-01'))},
				{count: viewCount},
				records => {
					// Another hack - should be handled in DB query
					this.setState({records: records.filter(r=>!r.hidden)})
				}
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
		const {selectedRows, editingRow} = this.state;
		
		const isSelected = selectedRows.includes(transaction._id);
		const isEditing = editingRow._id === transaction._id;
		
		let rowClasses = [];
		if (isSelected) rowClasses.push('selected');
		
		const renderRowFn = isEditing? this.renderEditRow : this.renderDefaultRow;
		
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
				{renderRowFn(transaction)}
				<td onClick={() => this.toggleEdit(transaction)}>
					<Button
						children={isEditing? '✅':'✏️'}
						type="emoji"
					/>
				</td>
			</tr>
		);
	}
	
	renderEditRow = transaction => {
		const {editingRow} = this.state;
		
		const onSubmit = () => this.toggleEdit(transaction);
		const onEscape = () => this.setState({editingRow: {}});
		
		return (
			<Fragment>
				<td className="transactions-list-sender"><Input
					value={editingRow.sender}
					onChange={val => this.editTransaction('sender', val)}
					onSubmit={onSubmit}
					onEscape={onEscape}
				/></td>
				<td className="transactions-list-recipient"><Input
					value={editingRow.recipient}
					onChange={val => this.editTransaction('recipient', val)}
					onSubmit={onSubmit}
					onEscape={onEscape}
				/></td>
				<td className="transactions-list-note"><Input
					value={editingRow.note}
					onChange={val => this.editTransaction('note', val)}
					onSubmit={onSubmit}
					onEscape={onEscape}
				/></td>
			</Fragment>
		);
	};
	
	renderDefaultRow = transaction => {
		return (
			<Fragment>
				<td children={transaction.sender} className="transactions-list-sender"/>
				<td children={elipsesText(transaction.recipient)} className="transactions-list-recipient"/>
				<td children={elipsesText(transaction.note)} className="transactions-list-note"/>
			</Fragment>
		);
	}
	
	toggleEdit = transaction => {
		const {editingRow} = this.state;
		this.setState({editingRow: editingRow._id === transaction._id? {}: transaction});
		
		db.Transactions.update(transaction._id, {$set: editingRow});
	};
	
	editTransaction = (field, val) => {
		const {editingRow} = this.state;
		
		const newState = {...editingRow};
		newState[field] = val;
		
		this.setState({editingRow: newState});
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