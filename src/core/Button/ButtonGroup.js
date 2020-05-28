import React, {Component} from 'react';
import Button from './index.js';
import './index.css';

class ButtonGroup extends Component {
	render() {
		const {buttons} = this.props;
		
		return(
			<div children={buttons.map(this.renderButton)}/>
		);
	}
	
	renderButton = (btn) => {
		const {active} = this.props;
		
		return (<Button
			onClick={e => this.props.onChange(e.target.innerText)}
			children={btn}
			key={btn}
			classes={active === btn? "btn-active" : ""}
		/>);
	}
	
	onClick = (e) => {
		this.props.onChange()
	}
}

export default ButtonGroup;