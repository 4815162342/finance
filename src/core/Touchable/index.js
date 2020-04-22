import React, {PureComponent} from 'react';
import './index.css';

export default class Touchable extends PureComponent {
	render() {
		const {href, id, children, className, target, style} = this.props;
		
		let classes = ['touchable'];
		if (className) classes.push(className);
		
		if (href) {
			return (<a
				id={id}
				href={href}
				target={target}
				className={classes.join(' ')}
				children={children}
				onClick={this.clickWrapper}
			/>);
		} else {
			return (<div
				style={style}
				id={id}
				className={classes.join(' ')}
				children={children}
 				onClick={this.clickWrapper}
			/>)
		}
	}
	
	clickWrapper = (e) => {
		const {onClick} = this.props;
		
		if (onClick) {
			e.preventDefault();
			onClick(e);
		}
	}
}