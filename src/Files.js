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

  render() {
    return (
      <div className="Files">
        <ul>
          {this.props.files.map((f, id) => (
            <li key={f.name}>
              <button type="button" onClick={this.handleClick(id)}>
                {f.name}
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={this.handleAddFile}>
              New
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default Files;
