import React, { Component } from 'react';
import FileDrop from 'react-file-drop';

import './Files.scss';

class Files extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleAddFile = this.handleAddFile.bind(this);
  }

  handleClick(f) {
    return e => {
      this.props.chooseFile(f);
    };
  }

  handleAddFile() {
    this.props.addFile();
  }

  renderFile(file) {
    let isCurFile = this.props.curFile === file;
    return (
      <a
        key={file}
        className={'panel-block ' + (isCurFile ? 'is-active' : null)}
        onClick={this.handleClick(file)}
        href={'/#' + file}
      >
        {file}
      </a>
    );
  }

  readFile(inputFile) {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  }

  handleDrop = async (files, event) => {
    console.log(files, event);
    let file = files[0];

    if (file.type !== '') {
      // .monkey files
      return;
    }

    let name = file.name;
    let text = await this.readFile(file);

    this.props.addFile(name, text);
  };

  render() {
    return (
      <nav className="Files column is-one-quarter panel">
        <p className="panel-heading">Files</p>
        {this.props.files.map(file => this.renderFile(file))}

        <div className="panel-block">
          <button
            type="button"
            className="button is-info is-outlined is-fullwidth"
            onClick={this.handleAddFile}
          >
            New
          </button>
        </div>
        <FileDrop className="panel-block" onDrop={this.handleDrop}>
          Drag and drop file here to upload
        </FileDrop>
      </nav>
    );
  }
}

export default Files;
