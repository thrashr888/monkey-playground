import React, { Component } from 'react';
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
      </nav>
    );
  }
}

export default Files;
