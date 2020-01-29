import React, {Component, Fragment} from 'react';
import Database from '../db/';
import FileHeaderMap from './FileHeaderMap'
import {draggingClass, filetypeDelimiter, requiredFieldsCopy, requiredFieldsParse} from './constants';
import {parseCSV} from './parseCSV';
import './index.css';

let db;

class FileInput extends Component {
	state = {
		incomingData: [],
	};
	
	componentDidMount() {
		window.addEventListener('dragenter', this.handleDragEnter);
		window.addEventListener('dragleave', this.handleDragLeave);
		window.addEventListener('drop', this.handleDrop);
		
		db = new Database();
	}
	
	componentWillUnmount() {
		db.close();
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
		//const numTrans = incomingData.reduce((acc, cur) => acc+cur.rows.length, 0)
		
		return (
			<div>
				<div className="fileHeaderContainer">
					{incomingData.map(file =>
						<FileHeaderMap
							key={file.name}
							file={file}
							onChange={this.onChangeHeaderMap}
							applyToAll={this.applyToAll}
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
		newState.find(file => file.name === fileName).headersMapped[field] = newValue;
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
						...requiredFieldsCopy(),
					};
					
					row.forEach((cell, colIndex) => {
						transaction.raw[file.headers[colIndex]] = cell;
						
						const requiredField = headerEntries.find(el => parseInt(el[1]) === colIndex);
						if (requiredField)
							transaction[requiredField[0]] = requiredFieldsParse[requiredField[0]](cell);
					});
					
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