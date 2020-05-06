import React, { Component, Fragment } from 'react';
import db from '../db/database';
import Input from '../Input';
import Touchable from '../Touchable';
import Button from '../Button';
import {money, elipsesText, ymd, plural, capitalize} from '../format';
import transConst from './constants';
import './index.css';

const boldText = (string, text) => {
	const re = new RegExp(`(${text})`, 'gi');
	return string.replace(re, '<b>$1</b>')
};

class TransactionsList extends Component {
	constructor(props) {
		super(props);
		
		const search = localStorage.getItem(transConst.storageKeys.search) || '';
		const sortField = localStorage.getItem(transConst.storageKeys.field) || 'date';
		let sortDirection = localStorage.getItem(transConst.storageKeys.direction) || -1;
		sortDirection = parseInt(sortDirection);
		
		this.state = {
			records: [],
			totalCount: 0,
			viewCount: 50,
			skip: 0,
			selectedRows: [],
			editingRow: {},
			search,
			sortField,
			sortDirection,
		};
	}
	
	componentDidMount() {
		db.Transactions.registerListener({
			type: 'put',
			fn: newRecord => {
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
		
		this.queryRecords()
	};
	
	queryRecords = () => {
		const {viewCount, sortField, sortDirection, search, skip} = this.state;
		
		const qry = {};
		if (search) qry.$text = {$search: search};
		
		const options = {limit: viewCount, sort: {}, skip};
		options.sort[sortField] = sortDirection;
		
		db.Transactions.get(qry, options).then(records => {
			// Another hack - should be handled in DB query
			this.setState({records: records.filter(r=>!r.hidden)})
		});
		
		db.Transactions.count({}).then(totalCount => this.setState({totalCount}))
	};
	
	componentWillUnmount() {
		//db.close();
	}
	
	componentDidUpdate(prevProps, prevState) {
		const watchFields = ['sortDirection', 'sortField', 'viewCount', 'search', 'skip'];
		
		if (watchFields.some(f => prevState[f] !== this.state[f]))
			this.queryRecords();
		
		localStorage.setItem(transConst.storageKeys.field, this.state.sortField);
		localStorage.setItem(transConst.storageKeys.direction, this.state.sortDirection);
		localStorage.setItem(transConst.storageKeys.search, this.state.search);
	}

	render() {
		const {records} = this.state;
		
		return (
			<div>
				{this.renderTools()}
				<div className="transactions-list-wrapper">
					<table className="transactions-list">
						{this.renderThead()}
						<tbody children={records.map(this.renderTransaction)} />
					</table>
				</div>
				{this.renderBottomBar()}
			</div>
		);
	}
	
	renderTools = () => {
		const {selectedRows, records, search} = this.state;
		
		const hideNoSelected = selectedRows.length? '' : 'no-display';
		
		const selectedSum = selectedRows.reduce((acc, cur) => {
			return acc + records.find(r => r._id === cur).amount || 0;
		}, 0);
		
		return (
			<div className='transactions-list-tools'>
				<div><button
					onClick={this.onClickHide}
					children={`Hide ${plural(selectedRows.length, 'transaction')}`}
					className={hideNoSelected}
				/></div>
				<div className={hideNoSelected}>Sum: <b children={money(selectedSum)}/></div>
				<div className={hideNoSelected}>Count: <b children={selectedRows.length}/></div>
				<div className={hideNoSelected}>Average: <b children={money(selectedSum/selectedRows.length)}/></div>
				<Input
					value={search}
					onChange={search => this.setState({search})}
					placeholder="Search"
				/>
			</div>
		);
	};
	
	renderThead = () => {
		const {selectedRows, records} = this.state;
		
		return (
			<thead>
				<tr>
					<th>
						<Input
							type="checkbox"
							checked={selectedRows.length === records.length}
							onChange={this.toggleAllRows}
						/>
					</th>
					{transConst.headers.map(this.renderTh)}
					<th></th>
				</tr>
			</thead>
		);
	};
	
	renderTh = header => {
		const {sortField, sortDirection} = this.state;
		
		let children = capitalize(header.name);
		if (sortField === header.name) {
			children += sortDirection === 1? ' ▴' : ' ▾';
		}
		
		return (
			<th className={`transactions-list-${header.name}`} key={header.name}>
				{header.sortable?
					<Touchable onClick={() => this.toggleSort(header.name)} children={children}/>:
					children
				}
				
			</th>
		);
	}
	
	toggleSort = newField => {
		const {sortField, sortDirection} = this.state;
		
		const newDirection = sortField === newField? -1 * sortDirection : -1;
		
		this.setState({
			sortField: newField,
			sortDirection: newDirection,
		});
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
				<td className="transactions-list-amount">{money(transaction.amount)}</td>
				<td className="transactions-list-date">{ymd(transaction.date)}</td>
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
		const {search} = this.state;
		
		return (
			<Fragment>
				<td
					dangerouslySetInnerHTML={{__html: boldText(transaction.sender, search)}}
					className="transactions-list-sender"
				/>
				<td
					dangerouslySetInnerHTML={{__html: boldText(elipsesText(transaction.recipient), search)}}
					className="transactions-list-recipient"
				/>
				<td
					dangerouslySetInnerHTML={{__html: boldText(elipsesText(transaction.note), search)}}
					className="transactions-list-note"
				/>
			</Fragment>
		);
	}
	
	renderBottomBar = () => {
		const {records, viewCount, totalCount, skip} = this.state;
		
		if (!records.length) return (<div>No results</div>);
		
		const end = Math.min(skip+viewCount, totalCount);
		const positionText = `Showing ${skip+1} - ${end} of ${totalCount.toLocaleString()}`;
		const leftBtn = skip?
			(<Button
				type="emoji"
				children="⬅️"
				onClick={() => this.setState({skip: skip-viewCount})}
			/>): null;
		
		return (
			<div className="transactions-list-bottom-bar">
				{leftBtn}
				<Input
					value={viewCount}
					onChange={v => this.setState({viewCount: parseInt(v || 0)})}
				/>
				<div>{positionText}</div>
				<Button
					type="emoji"
					children="➡️"
					onClick={() => this.setState({skip: skip+viewCount})}
				/>
			</div>
		)
	}
	
	toggleEdit = transaction => {
		const {editingRow} = this.state;
		
		const clickedSave = editingRow._id === transaction._id;
		this.setState({editingRow: clickedSave? {}: transaction});
		
		if (clickedSave)
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