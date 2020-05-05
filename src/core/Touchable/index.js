import React, {PureComponent} from 'react';
import {NavLink} from 'react-router-dom';
import './index.css';

export default class Touchable extends PureComponent {
	render() {
		const {href, id, children, className, target, style} = this.props;
		
		let classes = ['touchable'];
		if (className) classes.push(className);
		
		if (href) {
			const elType = href.includes('http')? 'a': NavLink;
			return React.createElement(elType, {
				id,
				target,
				href,
				to: href,
				className: classes.join(' '),
				onClick: this.clickWrapper,
			}, children);
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