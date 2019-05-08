import React, { Component } from 'react';
import './App.scss';
import Files from './Files';
import CurFile from './CurFile';
import Storage from './lib/Storage';

import { ReactComponent as GithubLogo } from './github.svg';

const EXT = 'monkey';

class App extends Component {
  constructor(props) {
    super(props);

    this.Storage = new Storage();

    let files = this.Storage.list();
    if (!files || files.length === 0) {
      this.Storage.write('new.monkey', 'let example = 1;');
      files = this.Storage.list();
    }

    let curFile = this.getFileFromUrl() || this.Storage.first();
    window.location.hash = curFile;
    this.state = {
      curFile,
      files,
    };

    this.switchFile = this.switchFile.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.renameFile = this.renameFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  getFileFromUrl() {
    if (!window.location.hash) return false;

    let file = window.location.hash.substr(1);

    if (!this.Storage.exists(file)) {
      return false;
    }

    return file;
  }

  switchFile(curFile) {
    console.log('switch file', curFile);
    window.location.hash = curFile;

    this.setState({ curFile });
  }

  updateFile(name, text) {
    console.log('save file', name);

    this.Storage.write(name, text);
  }

  addFile(name = 'new.monkey', text = 'let example = 1;') {
    // get an available new file name
    let newName = name;
    while (true) {
      if (this.Storage.read(newName) === null) break;
      let fileName = name.substr(0, name.indexOf('.'));
      let randNum = Math.floor(Math.random() * Math.floor(100));
      text = `let example = ${randNum};`;
      newName = `${fileName}-${randNum}.${EXT}`;
    }

    console.log('add file', newName);

    this.Storage.write(newName, text);
    window.location.hash = newName;

    let files = this.Storage.list();
    this.setState({
      files,
      curFile: newName,
    });
  }

  renameFile(oldName, newName) {
    console.log('rename file', oldName, newName);

    this.Storage.move(oldName, newName);
    window.location.hash = newName;

    let files = this.Storage.list();
    this.setState({
      files,
      curFile: newName,
    });
  }

  deleteFile(name) {
    console.log('delete file', name);

    this.Storage.delete(name);

    let curFile = this.Storage.first();
    window.location.hash = curFile;

    let files = this.Storage.list();
    this.setState({
      files,
      curFile,
    });
  }

  render() {
    return (
      <section className="section" style={{ padding: 0 }}>
        <section className="hero is-info" style={{ marginBottom: '2em' }}>
          <div className="hero-head">
            <nav className="navbar">
              <div className="navbar-brand">
                <a className="navbar-item" href="/">
                  Monkey
                </a>
              </div>

              <div className="navbar-menu">
                <div className="navbar-end">
                  <a
                    className="navbar-item"
                    href="https://github.com/thrashr888/monkey-playground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubLogo width="25" height="25" style={{ marginLeft: '1em' }} />
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </section>

        <div className="columns">
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
            deleteFile={this.deleteFile}
          />
        </div>
      </section>
    );
  }
}

export default App;
