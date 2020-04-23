import React, {Component} from 'react';
import Select from '../Select/';
import Input from '../Input/';
import {requiredFields} from './constants';
import {capitalize} from '../format';

const fieldsArr = Object.keys(requiredFields);

class FileHeaderMap extends Component {
	render() {
		const {file, applyToAll} = this.props;
		
		return (
			<div className="fileHeaderPicker">
				<div>{file.name}</div>
				{fieldsArr.map(this.renderInput)}
				<button onClick={() => applyToAll(file.headersMapped)} children="Apply to all"/>
			</div>
		);
	}
	
	renderInput = field => {
		const {file, onChange} = this.props;
		const {inputComponent} = requiredFields[field];
		
		let onChangeInput, comp;
		
		if (inputComponent === 'Select') {
			comp = <Select
				options={file.headers.concat('N/A')}
				onChange={onChangeInput}
				value={file.headersMapped[field]}
			/>;
			onChangeInput = newValue => onChange(field, file.name, newValue);
		} else {
			comp = <Input onChange={onChangeInput} value={file.headersMapped[field]}/>;
			onChangeInput = e => onChange(field, file.name, e.target.value);
		}
		
		return (<div key={field}>{capitalize(field)}: {comp}</div>);
	};
}

export default FileHeaderMap;