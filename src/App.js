import React, { Component } from 'react';
import './App.css';
import Files from './Files';
import CurFile from './CurFile';

/*
TODO:
- switch curFile to use name instead of index
- save files to localStorage
*/

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [
        {
          name: 'example.monkey',
          text: `let double = fn(n){ n * 2 }
let a = double(102)
a * 21 - 84
let hello = fn(name){ "Hello, " + name + "!" }
hello("Paul")
let bigNum = fn(x){x>500}`,
        },
        {
          name: 'blank.monkey',
          text: '',
        },
      ],
    };
    this.state.curFile = 0;

    this.switchFile = this.switchFile.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.renameFile = this.renameFile.bind(this);
  }

  switchFile(curFile) {
    console.log('switch file', curFile, this.state.files[curFile].name);
    this.setState({
      curFile,
    });
  }

  updateFile(name, text) {
    console.log('save file', name);

    let files = this.state.files;

    files.forEach((f, key) => {
      if (f.name === name) {
        files[key].text = text;
      }
    });

    this.setState({ files });
  }

  addFile(name = 'new.monkey') {
    let newFile = {
      name,
      text: '',
    };
    let files = [...this.state.files, newFile];
    let curFile = files.length - 1;
    this.setState({
      files,
      curFile,
    });
  }

  renameFile(oldName, newName) {
    console.log('rename file', oldName, newName);

    let files = this.state.files;

    files.forEach((f, key) => {
      if (f.name === oldName) {
        files[key].name = newName;
      }
    });

    this.setState({ files });
  }

  render() {
    return (
      <div className="App">
        <div style={{ display: 'flex' }}>
          <Files files={this.state.files} chooseFile={this.switchFile} addFile={this.addFile} />
          <CurFile
            file={this.state.files[this.state.curFile]}
            updateFile={this.updateFile}
            renameFile={this.renameFile}
          />
        </div>
      </div>
    );
  }
}

export default App;
