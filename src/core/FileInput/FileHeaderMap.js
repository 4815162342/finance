import React, {Component} from 'react';
import Select from '../Select/';
import {requiredFieldsList} from './constants';
import {capitalize} from '../format';

class FileHeaderMap extends Component {
	render() {
		const {file, applyToAll} = this.props;
		
		return (
			<div className="fileHeaderPicker">
				<div>{file.name}</div>
				{requiredFieldsList.map(this.renderSelect)}
				<button onClick={() => applyToAll(file.headersMapped)} children="Apply to all"/>
			</div>
		);
	}
	
	renderSelect = field => {
		const {file, onChange} = this.props;
		const onChangeSelect = newValue => onChange(field, file.name, newValue);
		
		return (
			<div key={field}>
				{capitalize(field)}:
				<Select
					options={file.headers.concat('N/A')}
					onChange={onChangeSelect}
					value={file.headersMapped[field]}
				/>
			</div>
		);
	};
}

export default FileHeaderMap;