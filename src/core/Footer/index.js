import React, {PureComponent} from 'react';
import Touchable from 'core/Touchable';
import db from '../db/database';
import './index.css';

class Footer extends PureComponent {
	render() {
		
		return (
			<div className="footer">
				<div>
				Made by <Touchable href="https://www.linkedin.com/in/adamcarysanders/" target="_blank">Adam Sanders</Touchable> in NYC, 2020</div>
				<div>
					<Touchable href="https://github.com/4815162342/finance" target="_blank" children="GitHub repo" />
				</div>
				<div>
					<Touchable onClick={this.export}>Export</Touchable> your data
				</div>
			</div>
		);
	}
	
	export() {
		db.Transactions.get({_id: null}, {}).then(data => {
			const file = new Blob([JSON.stringify(data)], {type: 'json'});
			const a = document.createElement("a");
			const url = URL.createObjectURL(file);
			a.href = url;
			a.download = 'finances_export.json';
			document.body.appendChild(a);
			a.click();
			setTimeout(function() {
			    document.body.removeChild(a);
			    window.URL.revokeObjectURL(url);
			}, 0);
		});
	}
}

export default Footer;