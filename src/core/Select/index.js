import React, {Component} from 'react';

class Select extends Component {
	render() {
		const {options, value} = this.props;
		
		return (
			<select value={value} onChange={this.onChange}>
				{options.map(this.renderOption)}
			</select>
		);
	}
	
	renderOption = (op, index) => <option key={op} value={index}>{op}</option>;
	
	onChange = e => this.props.onChange(e.target.value);
}

export default Select;