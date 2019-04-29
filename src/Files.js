import React, { Component } from 'react';
import './Files.css';

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
      <li key={file}>
        <button
          type="button"
          className={'button ' + (isCurFile ? 'is-black' : '')}
          onClick={this.handleClick(file)}
        >
          {file}
        </button>
      </li>
    );
  }

  render() {
    return (
      <div className="Files column is-one-quarter">
        <ul>
          {this.props.files.map(file => this.renderFile(file))}
          <li>
            <button type="button" className="button is-primary" onClick={this.handleAddFile}>
              New
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default Files;
