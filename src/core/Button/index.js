import React, {Component} from 'react';
import './index.css';

class Button extends Component {
	render() {
		const {onClick, children, type, classes} = this.props;
		const classNames = [];
		
		if (classes) classNames.push(classes);
		
		if (type === 'emoji') classNames.push('btn-emoji')
		else classNames.push('btn-default');
		
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