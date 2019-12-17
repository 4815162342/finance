import React, {Component, Fragment} from 'react';

const draggingClass = 'dragging-file';

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
	
	handleDrop = e => {
		e.stopPropagation();
		e.preventDefault();
		this.props.onDragLeave(draggingClass);
		this.handleFile(e.dataTransfer.files)
	}
	
	handleFile = file => {
		console.log(file);
	}
	
	handleFileInput = e => {
		this.handleFile(e.target.files)
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