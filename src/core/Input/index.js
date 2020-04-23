import React, {Component} from 'react';

class Input extends Component {
	static defaultProps = {
		type: "text",
	}
	
	render() {
		let {value, placeholder, type, checked} = this.props;
		
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