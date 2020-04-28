import React, {Component} from 'react';

class Input extends Component {
	static defaultProps = {
		type: "text",
		onSubmit: a => a,
	}
	
	render() {
		let {value, placeholder, type, checked} = this.props;
		
		return (
			<input
				value={value}
				onChange={this.onChange}
				onKeyDown={this.onKeyDown}
				placeholder={placeholder}
				type={type}
				checked={checked}
			/>
		);
	}
	
	onKeyDown = e => {
		if (e.key === "Enter") this.props.onSubmit();
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