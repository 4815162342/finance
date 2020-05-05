import React, {PureComponent} from 'react';
import Touchable from 'core/Touchable';
import {routes} from 'util/Router/routes';
import './index.css';

class Header extends PureComponent {
	render() {
		return (
			<div className="header-container">
				<div className="header" children={routes.filter(r => r.name).map(this.renderRoute)}/>
			</div>
		);
	}
	
	renderRoute = route => {
		return (
			<Touchable
				key={route.path}
				href={route.path}
				children={route.name}
				className="header-item"
			/>
		);
	}
}

export default Header;