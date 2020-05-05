import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {routes} from 'util/Router/routes';
import {draggingClass} from 'core/FileInput/constants';
import Header from './core/Header';
import Footer from './core/Footer';
import './App.css';
import './darkMode.css';

class App extends Component {
	state = {appClasses: ["App"]};
	
	componentDidMount() {
		window.addEventListener('dragenter', this.onDragEnter);
		window.addEventListener('dragleave', this.onDragLeave);
		window.addEventListener('dragover', this.onDragOver)
		window.addEventListener('drop', this.onDrop);
	}
	
	onDragEnter = e => {
		const {appClasses} = this.state;
		
		if (!appClasses.find(el => el === draggingClass)) {
			this.setState({appClasses:appClasses.concat(draggingClass)});
		}
	}
	
	onDragLeave = e => {
		const {appClasses} = this.state;
		
		if (!e.x && !e.y) {
			this.setState({
				appClasses: appClasses.filter(el => el !== draggingClass)
			});
		}
	}
	
	onDragOver = e => {
		e.preventDefault();
	}
	
	onDrop = e => {
		const {appClasses} = this.state;
		
		e.stopPropagation();
		e.preventDefault();
		this.setState({
			appClasses: appClasses.filter(el => el !== draggingClass)
		});
	}
	
	render() {
		return (
			<Router>
				<Switch>
					{routes.map(this.renderRoute)}
				</Switch>
			</Router>
		);
	}
	
	renderRoute = route => {
		const {appClasses} = this.state;
		
		return (
			<Route path={route.path} key={route.path} exact>
				<Header />
				<div className={appClasses.join(' ')}>
					<div className="wrapper">
						{route.component}
						<Footer />
					</div>
				</div>
			</Route>
		);
	};
}

export default App;