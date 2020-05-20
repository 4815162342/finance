import React, { Component, Fragment } from 'react';
import Input from '../Input';
import Button from '../Button';
import {money, elipsesText, ymd} from '../format';

const boldText = (string, text) => {
	const re = new RegExp(`(${text})`, 'gi');
	return string.replace(re, '<b>$1</b>')
};

const fields = [
	{name: 'amount', isEditable: true, display: money, parse: parseInt},
	{name: 'date', isEditable: false, display: ymd},
	{name: 'sender', isEditable: true},
	{name: 'recipient', isEditable: true},
	{name: 'note', isEditable: true},
];

class TransactionsListItem extends Component {
	render() {
		const {isSelected, isEditing, toggleSelect, transaction} = this.props;
		
		let rowClasses = [];
		if (isSelected) rowClasses.push('selected');
		
		const renderRowFn = isEditing? this.renderEditRow : this.renderDefaultRow;
		
		return (
			<tr className={rowClasses.join(' ')}>
				<td>
					<Input
						type="checkbox"
						checked={isSelected}
						onChange={() => toggleSelect(transaction._id)}
					/>
				</td>
				{renderRowFn(transaction)}
			</tr>
		);
	}
	
	renderEditRow = () => {
		const {editContent} = this.state;
		
		return (
			<Fragment>
				{fields.map(this.renderEditTd)}
				<td onClick={() => this.toggleEditWrapper(editContent)}>
					<Button children="✅" type="emoji"/>
				</td>
			</Fragment>
		);
	}
	
	renderEditTd = (field) => {
		const {editContent} = this.state;
		
		let children;
		const val = editContent[field.name], parse = field.parse || (a=>a);
		
		if (field.isEditable) {
			children = (<Input
				value={val}
				onChange={v => this.editTransaction(field.name, parse(v))}
				onSubmit={() => this.toggleEditWrapper(editContent)}
				onEscape={this.toggleEditWrapper}
			/>);
		} else {
			children = field.display? field.display(val) : val;
		}
		
		return (<td className={`transactions-list-${field.name}`} children={children} key={field.name}/>);
	};
	
	renderDefaultRow = () => {
		const {search, transaction} = this.props;
		
		return (
			<Fragment>
				<td className="transactions-list-amount">{money(transaction.amount)}</td>
				<td className="transactions-list-date">{ymd(transaction.date)}</td>
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
				<td onClick={() => this.toggleEditWrapper(transaction)}>
					<Button
						children="✏️"
						type="emoji"
					/>
				</td>
			</Fragment>
		);
	}
	
	toggleEditWrapper = (row) => {
		const newEditContent = this.props.isEditing?
			null:
			{...this.props.transaction};
		
		this.setState({editContent: newEditContent});
		
		this.props.toggleEdit(row);
	}
	
	editTransaction = (field, val) => {
		const {editContent} = this.state;
		
		const newState = {...editContent};
		newState[field] = val;
		
		this.setState({editContent: newState});
	}
}

export default TransactionsListItem;