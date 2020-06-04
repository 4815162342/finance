import React, { Component } from 'react';
import {money} from '../format';
import {elipsesText} from '../format';
import './index.css';

class Graph extends Component {
	constructor(props) {
		super(props);
		
		this.max = Number.NEGATIVE_INFINITY;
		this.yTicks = 6;
	}
	render() {
		const {data} = this.props;
		if (!data.length) return null;
		
		// clean & sort data
		let cols = data.filter(d=>!isNaN(d.amount)).sort((a, b) => a.date - b.date);
		
		// Determine max
		let newMax = Number.NEGATIVE_INFINITY;
		cols.forEach(p => newMax = Math.max(newMax, p.amount));
		this.max = newMax;
		
		const yTicks = [...Array(this.yTicks).keys()];
		
		return (
			<div className="graph">
				<div className="graph-top">
					<div className="graph-y-axis" children={yTicks.map(this.renderYtick)}/>
					<div className="graph-content" children={cols.map(this.renderBar)} />
				</div>
				<div className="graph-bottom">
					<div className="graph-x-axis">
						<div/>
					</div>
				</div>
			</div>
		);
	}
	
	renderBar = (point) => {
		const height = 300 * point.amount / this.max;
		const style = {height: `${height}px`};
		
		const date = point.date.toISOString().substring(0, 10);
		
		return (
			<div key={point._id} className="graph-bar tooltip" style={style}>
				<span className="tooltiptext">
					<div>{date}</div>
					<div>{money(point.amount)}</div>
					<div>{point.recipient}</div>
					<div>{point.sender}</div>
					<div>{elipsesText(point.note || '')}</div>
				</span>
			</div>
		);
	}
	
	renderYtick = (i) => {
		const val = money(this.max * i / (this.yTicks-1));
		
		return (
			<div key={i} children={val} />
		);
	}
}

export default Graph;