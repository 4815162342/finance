import React, {Component} from 'react';
import './index.css';

class Button extends Component {
	static defaultProps = {
	}
	
	render() {
		let {onClick, children, type} = this.props;
		const classNames = [];
		
		if (type === 'emoji') classNames.push('btn-emoji')
		
		return (
			<button
				onClick={onClick}
				children={children}
				className={classNames.join(' ')}
			/>
		);
	}
}

export default Button;