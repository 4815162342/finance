import React, {Component} from 'react';

class Input extends Component {
	render() {
		let {value, placeholder, type, checked} = this.props;
		
		if (!type) type = "text";
		
		return (
			<input
				value={value}
				onChange={this.onChange}
				placeholder={placeholder}
				type={type}
				checked={checked}
			/>
		);
	}
	
	onChange = e => {
		const {type} = this.props;
		
		let newVal = type === "checkbox"?
			e.target.checked:
			e.target.value;
		
		return this.props.onChange(newVal);
	}
}

export default Input;