import React, {Component} from 'react';
import FileInput from './core/FileInput/';
import TransactionsList from './core/TransactionsList/';
import './App.css';
import './darkMode.css';

class App extends Component {
	state = {appClasses: ["App"]};
	
	onDragEnter = addClass => {
		const {appClasses} = this.state;
		
		if (!appClasses.find(el => el === addClass)) {
			this.setState({appClasses:appClasses.concat(addClass)});
		}
	}
	
	onDragLeave = removeClass => {
		const {appClasses} = this.state;
		
		if (appClasses.find(el => el === removeClass)) {
			this.setState({
				appClasses: appClasses.filter(el => el !== removeClass)
			});
		}
	}
	
	render() {
		const {appClasses} = this.state;
		
		return (
			<div className={appClasses.join(' ')}>
				<div className="wrapper">
					<FileInput
						onDragEnter={this.onDragEnter}
						onDragLeave={this.onDragLeave}
					/>
					<TransactionsList />
				</div>
			</div>
		);
	}
}

export default App;