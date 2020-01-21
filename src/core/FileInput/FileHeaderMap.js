import React, {Component} from 'react';
import Select from '../Select/';
import {requiredFieldsList} from './constants';

class FileHeaderMap extends Component {
	render() {
		const {file} = this.props;
		
		return (
			<div className="fileHeaderPicker">
				<div>{file.name}</div>
				{requiredFieldsList.map(this.renderSelect)}
			</div>
		);
	}
	
	renderSelect = field => {
		const {file, onChange} = this.props;
		const onChangeSelect = newValue => onChange(field, file.name, newValue);
		
		return (
			<div key={field}>
				{field}:
				<Select
					options={file.headers}
					onChange={onChangeSelect}
					value={file.headersMapped[field]}
				/>
			</div>
		);
	};

}

export default FileHeaderMap;