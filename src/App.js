import React, { Component } from 'react';
import './App.css';
import Files from './Files';
import CurFile from './CurFile';
import Storage from './lib/Storage';

/*
TODO:
- switch curFile to use name instead of index
- save files to localStorage
*/

class App extends Component {
  constructor(props) {
    super(props);

    this.Storage = new Storage();

    this.state = {
      curFile: this.Storage.first(),
      files: this.Storage.list(),
    };

    this.switchFile = this.switchFile.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.renameFile = this.renameFile.bind(this);
  }

  switchFile(curFile) {
    console.log('switch file', curFile);

    this.setState({ curFile });
  }

  updateFile(name, text) {
    console.log('save file', name);

    this.Storage.write(name, text);
  }

  addFile(name = 'new.monkey', text = '') {
    console.log('add file', name);

    this.Storage.write(name, text);

    let files = this.Storage.list();
    this.setState({
      files,
      curFile: name,
    });
  }

  renameFile(oldName, newName) {
    console.log('rename file', oldName, newName);

    this.Storage.move(oldName, newName);

    let files = this.Storage.list();
    console.log(files);
    this.setState({
      files,
      curFile: newName,
    });
  }

  render() {
    return (
      <section className="section">
        <section className="hero">
          <div className="hero-head">
            <div className="container has-text-centered">
              <h1 className="title">Monkey</h1>
            </div>
          </div>
        </section>

        <div className="container columns">
          <Files
            files={this.state.files}
            curFile={this.state.curFile}
            chooseFile={this.switchFile}
            addFile={this.addFile}
          />
          <CurFile
            name={this.state.curFile}
            text={this.Storage.read(this.state.curFile)}
            updateFile={this.updateFile}
            renameFile={this.renameFile}
          />
        </div>
      </section>
    );
  }
}

export default App;
