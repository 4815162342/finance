import React, {Component} from 'react';

class Input extends Component {
	render() {
		const {value, placeholder} = this.props;
		
		return (
			<input value={value} onChange={this.onChange} placeholder={placeholder}/>
		);
	}
	
	onChange = e => this.props.onChange(e.target.value);
}

export default Input;