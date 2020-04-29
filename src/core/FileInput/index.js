import React, {Component} from 'react';
import ObjectHash from 'object-hash';
import db from '../db/database';
import FileHeaderMap from './FileHeaderMap'
import {draggingClass, filetypeDelimiter, requiredFieldsCopy, requiredFields} from './constants';
import {parseCSV} from './parseCSV';
import './index.css';

class FileInput extends Component {
	state = {
		incomingData: [],
		showTest: true,
	};
	
	componentDidMount() {
		window.addEventListener('dragenter', this.handleDragEnter);
		window.addEventListener('dragleave', this.handleDragLeave);
		window.addEventListener('dragover', this.handleDragOver)
		window.addEventListener('drop', this.handleDrop);
	}
	
	handleDragEnter = e => {
		this.props.onDragEnter(draggingClass);
	}
	
	handleDragLeave = e => {
		if (!e.x && !e.y) this.props.onDragLeave(draggingClass);
	}
	
	handleDragOver = e => {
		e.preventDefault();
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
				const headerEnd = fr.result.indexOf('\n');
				const headers = fr.result.slice(0, headerEnd)
					.replace(/"/g, '')
					.split(delimiter)
					.map(header => header.trim());
				
				incomingData.push({
					headers,
					headersMapped: {},
					delimiter,
					rows: fr.result.slice(headerEnd+1),
					name: files[i].name,
					source: '',
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
		const {incomingData, showTest} = this.state;
		
		return (
			<div>
				<div className="file-drop-container">
					{this.renderUserFileInput()}
					{showTest? this.renderTestData() : null}
				</div>
				{incomingData.length? this.renderMapHeaders(): null}
			</div>
		);
	}
	
	renderUserFileInput() {
		return (
			<div>
				<input
					type="file"
					onChange={this.handleFileInput}
					accept=".csv,.tsv"
					className="input-file-drop"
					ref={this.hiddenInput}
					multiple={true}
				/>
				<div onClick={this.handleClickDrop} className="file-drop">
					<div>Drop files anywhere</div>
					<div>Or</div>
					<div>Click here to upload</div>
				</div>
			</div>
		);
	}
	
	renderTestData() {
		return (
			<div>
				<div onClick={this.loadTestData} className="file-drop">Download test data</div>
			</div>
		);
	}
	
	loadTestData = () => {
		document.location = '/fakeData.csv';
		this.setState({showTest: false});
	}
	
	renderMapHeaders() {
		const {incomingData} = this.state;
		//const numTrans = incomingData.reduce((acc, cur) => acc+cur.rows.length, 0)
		const applyToAll = incomingData.length > 1 ? this.applyToAll : null;
		
		return (
			<div>
				<div className="file-header-container">
					{incomingData.map(file =>
						<FileHeaderMap
							key={file.name}
							file={file}
							onChange={this.onChangeHeaderMap}
							applyToAll={applyToAll}
						/>
					)}
				</div>
				<div>
					<button className="btn" onClick={this.importRows}>Import transactions</button>
				</div>
			</div>
		);
	};
	
	onChangeHeaderMap = (field, fileName, newValue) => {
		const {incomingData} = this.state;
		const newState = [...incomingData];
		
		const existingFile = newState.find(file => file.name === fileName);
		if (field === 'source') existingFile.source = newValue;
		else existingFile.headersMapped[field] = newValue;
		
		this.setState({incomingData: newState});
	};
	
	importRows = () => {
		const {incomingData} = this.state;
		
		incomingData.forEach(file => {
			const headerEntries = Object.entries(file.headersMapped);
			
			parseCSV({
				data: file.rows,
				delimiter: file.delimiter,
				onRowEnd: row => {
					const transaction = {
						raw: {},
						source: file.source,
						...requiredFieldsCopy(),
					};
					
					row.forEach((cell, colIndex) => {
						transaction.raw[file.headers[colIndex]] = cell;
						
						const requiredField = headerEntries.find(el => parseInt(el[1]) === colIndex);
						if (requiredField)
							transaction[requiredField[0]] = requiredFields[requiredField[0]].parse(cell);
					});
					
					transaction._id = ObjectHash(transaction.raw, {algorithm: 'sha1'});
					
					db.Transactions.put(transaction);
				},
			});
		});
		
		this.setState({incomingData: []});
	}
	
	applyToAll = newHeadersMapped => {
		const {incomingData} = this.state;
		const newState = [...incomingData].map(file => {
			file.headersMapped = newHeadersMapped;
			return file;
		});
		
		this.setState({incomingData: newState});
	}
}

export default FileInput;