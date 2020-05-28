import React, { Component } from 'react';
import Graph from 'core/Graph';
import ButtonGroup from 'core/Button/ButtonGroup';
import db from 'core/db/database';
import {aggregate} from 'util/aggregate';

const aggregateBtns = ['None', 'daily', 'monthly', 'yearly'];

class GraphsPage extends Component {
	state = {
		records: [],
		aggregatePref: 'monthly',
	};
	
	componentDidMount() {
		this.queryRecords();
	}
	
	componentDidUpdate(prevProps, prevState) {
		const watchFields = ['aggregatePref'];
		
		if (watchFields.some(f => prevState[f] !== this.state[f]))
			this.queryRecords();
	}
	
	queryRecords = () => {
		const {aggregatePref} = this.state;
		
		db.Transactions.get({}, {
			limit: 100,
			sort: {date: -1},
		}).then(records => {
			// Hack - should be handled in DB query
			let newRecords = records.filter(r=>!r.hidden);
			if (aggregatePref !== "None") newRecords = aggregate(newRecords, aggregatePref);
			
			this.setState({records: newRecords});
		});
	};
	
	render() {
		const {records, aggregatePref} = this.state;
		
		return (
			<div>
				<Graph data={records}/>
				<ButtonGroup
					buttons={aggregateBtns}
					active={aggregatePref}
					onChange={v => this.setState({aggregatePref: v})}
				/>
			</div>
		);
	}
}

export default GraphsPage;