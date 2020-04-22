import React, {PureComponent} from 'react';
import Touchable from 'core/Touchable'
import db from '../db/database';
import './index.css';

class Footer extends PureComponent {
	render() {
		
		return (
			<div className="footer">
				<div>
				Made by <Touchable href="https://www.linkedin.com/in/adamcarysanders/" target="_blank">Adam Sanders</Touchable> in NYC, 2020</div>
				<div>
					<Touchable onClick={this.export}>Export</Touchable> your data
				</div>
			</div>
		);
	}
	
	export() {
		return db.Transactions.get({amount: 1}, {}, console.log);
		const file = new Blob([JSON.stringify()], {type: 'json'});
		const a = document.createElement("a");
		const url = URL.createObjectURL(file);
		a.href = url;
		a.download = 'finances';
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
		    document.body.removeChild(a);
		    window.URL.revokeObjectURL(url);
		}, 0);
	}
}

export default Footer;