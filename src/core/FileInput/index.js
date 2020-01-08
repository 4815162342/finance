import React, {Component, Fragment} from 'react';
import Database from '../db/';
import './index.css';

const draggingClass = 'dragging-file';
const filetypeDelimiter = {
	'text/tab-separated-values': '\t',
	'text/csv': ',',
};

const db = new Database();

class FileInput extends Component {
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
		alert();
		this.props.onDragLeave(draggingClass);
		this.handleFile(e.dataTransfer.files)
	}
	
	// User uses OS file picker
	handleFileInput = e => {
		this.handleFile(e.target.files)
	}
	
	// Handle the raw file data
	handleFile = files => {
		for (let i = 0; i < files.length; i++) {
			const delimiter = filetypeDelimiter[files[i].type];
			
			const fr = new FileReader();
			fr.onload = e => {
				const rows = fr.result.split('\n');
				const headers = rows[0].split(delimiter).map(header => header.trim());
				
				
				rows.forEach((row, rowIndex) => {
					if (rowIndex === 0) return;
					
					const transaction = {};
					row.split(delimiter).forEach((val, colIndex) => transaction[headers[colIndex]] = val);
					
					db.Transactions.put({
						raw: transaction,
						importedOn: new Date(),
					});
				});
			}
			fr.readAsText(files[i]);
		}
	}
	
	handleClickDrop = () => {
		this.hiddenInput.current.click();
	}
	
	hiddenInput = React.createRef();
	
	render() {
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
			</Fragment>
		);
	}
}

export default FileInput;