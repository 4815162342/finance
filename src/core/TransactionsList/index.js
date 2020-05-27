import React, { Component } from 'react';
import db from '../db/database';
import Input from '../Input';
import Touchable from '../Touchable';
import Button from '../Button';
import TransactionsListItem from './TransactionsListItem';
import {money, plural, capitalize} from '../format';
import transConst from './constants';
import './index.css';

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
			editingRowId: null,
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
	}
	
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
		
		db.Transactions.count({}).then(totalCount => this.setState({totalCount}));
	}
	
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
						<tbody children={records.map(this.renderListItem)} />
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
	}
	
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
	}
	
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
	
	renderListItem = transaction => {
		const {selectedRows, editingRowId, search} = this.state;
		
		const isEditing = editingRowId === transaction._id;
		const isSelected = selectedRows.includes(transaction._id);
		
		return (
			<TransactionsListItem
				key={transaction._id}
				transaction={transaction}
				isEditing={isEditing}
				isSelected={isSelected}
				toggleEdit={this.toggleEdit}
				toggleSelect={this.toggleSelect}
				search={search}
			/>
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
	
	toggleEdit = editedTrans => {
		const {editingRowId} = this.state;
		
		const clickedSave = editingRowId === editedTrans?._id;
		this.setState({editingRowId: clickedSave? null: editedTrans?._id});
		
		if (clickedSave)
			db.Transactions.update(editedTrans._id, {$set: editedTrans});
	}
	
	toggleSelect = _id => {
		const {selectedRows} = this.state;
		
		let newSelectedRows = selectedRows.includes(_id)?
			selectedRows.filter(a => a !== _id):
			[...selectedRows, _id];
		
		this.setState({'selectedRows': newSelectedRows});
	}
	
	toggleAllRows = () => {
		const {records, selectedRows} = this.state;
		
		const newState = records.length === selectedRows.length?
			[]:
			records.map(r=>r._id);
		
		this.setState({'selectedRows': newState});
	}
		
	onClickHide = () => {
		const {selectedRows} = this.state;
		
		selectedRows.forEach(_id => db.Transactions.update(_id, {$set:{'hidden': true}}))
	}
}

export default TransactionsList;