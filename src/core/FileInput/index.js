import React, {Component, Fragment} from 'react';
import Database from '../db/';
import FileHeaderMap from './FileHeaderMap'
import {draggingClass, filetypeDelimiter, requiredFieldsMap, requiredFieldsParse} from './constants';
import './index.css';

const db = new Database();

class FileInput extends Component {
	state = {
		incomingData: [],
	};
	
	componentDidMount() {
		window.addEventListener('dragenter', this.handleDragEnter);
		window.addEventListener('dragleave', this.handleDragLeave);
		window.addEventListener('drop', this.handleDrop);
	}
	
	handleDragEnter = () => {
		this.props.onDragEnter(draggingClass);
	}
	
	handleDragLeave = () => {
		this.props.onDragLeave(draggingClass);
	}
	
	// User drops file
	handleDrop = e => {
		e.stopPropagation();
		e.preventDefault();
		this.props.onDragLeave(draggingClass);
		this.handleFiles(e.dataTransfer.files)
	}
	
	// User uses OS file picker
	handleFileInput = e => {
		this.handleFiles(e.target.files)
	}
	
	// Handle the raw file data
	handleFiles = files => {
		const incomingData = [];
		
		for (let i = 0; i < files.length; i++) {
			const delimiter = filetypeDelimiter[files[i].type];
			
			const fr = new FileReader();
			fr.onload = e => {
				const rows = fr.result.split('\n');
				const headers = rows.shift(1).split(delimiter).map(header => header.trim());
				
				incomingData.push({
					headers,
					headersMapped: requiredFieldsMap(),
					delimiter,
					rows,
					name: files[i].name,
				});
				this.setState({incomingData});
			};
			fr.readAsText(files[i]);
		}
	}
	
	handleClickDrop = () => {
		this.hiddenInput.current.click();
	}
	
	hiddenInput = React.createRef();
	
	render() {
		const {incomingData} = this.state;
		
		return (
			<Fragment>
				<input
					type="file"
					onChange={this.handleFileInput}
					accept=".csv,.tsv"
					className="inputFileDrop"
					ref={this.hiddenInput}
					multiple={true}
				/>
				<div onClick={this.handleClickDrop} className="divFileDrop">
					<div>Drop files here</div>
					<div>Or</div>
					<div>Click to upload</div>
				</div>
				{incomingData.length? this.renderMapHeaders(): null}
			</Fragment>
		);
	}
	
	renderMapHeaders() {
		const {incomingData} = this.state;
		const numTrans = incomingData.reduce((acc, cur) => acc+cur.rows.length, 0)
		
		return (
			<div>
				<div className="fileHeaderContainer">
					{incomingData.map(file =>
						<FileHeaderMap
							key={file.name}
							file={file}
							onChange={this.onChangeHeaderMap}
						/>
					)}
				</div>
				<div>
					<button className="btn" onClick={this.importRows}>Import {numTrans} transactions</button>
				</div>
			</div>
		);
	};
	
	onChangeHeaderMap = (field, fileName, newValue) => {
		const {incomingData} = this.state;
		const newState = [...incomingData];
		newState.find(file => file.name === fileName).headersMapped[field] = newValue;
		this.setState({incomingData: newState});
	};
	
	importRows = () => {
		const {incomingData} = this.state;
		
		incomingData.forEach(file => {
			const headerEntries = Object.entries(file.headersMapped);
			
			file.rows.forEach(row => {
				const transaction = {
					importedOn: new Date(),
					raw: {},
				};
				row.split(file.delimiter).forEach((val, colIndex) => {
					transaction.raw[file.headers[colIndex]] = val;
					
					const requiredField = headerEntries.find(el => parseInt(el[1]) === colIndex);
					if (requiredField)
						transaction[requiredField[0].toLowerCase()] = requiredFieldsParse[requiredField[0]](val);
				});
				
				db.Transactions.put(transaction);
			});
		});
		
		this.setState({incomingData: []});
	}
}

export default FileInput;