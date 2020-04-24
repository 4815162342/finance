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
				{this.renderSource()}
				<button onClick={() => applyToAll(file.headersMapped)} children="Apply to all"/>
			</div>
		);
	}
	
	renderInput = field => {
		const {file, onChange} = this.props;
		
		return (<div key={field}>
			{capitalize(field)}:
			<Select
				options={file.headers.concat('N/A')}
				onChange={newValue => onChange(field, file.name, newValue)}
				value={file.headersMapped[field]}
			/>
		</div>);
	};
	
	renderSource = () => {
		const {file, onChange} = this.props;
		
		return (<div>
			Source:
			<Input onChange={newValue => onChange('source', file.name, newValue)} value={file.source}/>
		</div>)
	}
}

export default FileHeaderMap;