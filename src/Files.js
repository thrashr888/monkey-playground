import React, { Component } from 'react';
import './Files.css';

class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curFile: this.props.files[0],
    };

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

  renderFile(id, f) {
    let isCurFile = this.props.curFile === id;
    return (
      <li key={f.name}>
        <button
          type="button"
          className={'button ' + (isCurFile ? 'is-black' : '')}
          onClick={this.handleClick(id)}
        >
          {f.name}
        </button>
      </li>
    );
  }

  render() {
    return (
      <div className="Files column is-one-quarter">
        <ul>
          {this.props.files.map((f, id) => this.renderFile(id, f))}
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
