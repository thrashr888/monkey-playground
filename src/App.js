import React, { Component } from 'react';
import './App.scss';
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

    let files = this.Storage.list();
    if (!files || files.length === 0) {
      this.Storage.write('new.monkey', 'let example = 1;');
      files = this.Storage.list();
    }

    this.state = {
      curFile: this.Storage.first(),
      files,
    };

    this.switchFile = this.switchFile.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.renameFile = this.renameFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  switchFile(curFile) {
    console.log('switch file', curFile);

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
      newName = name + Math.floor(Math.random() * Math.floor(100));
    }

    console.log('add file', newName);

    this.Storage.write(newName, text);

    let files = this.Storage.list();
    this.setState({
      files,
      curFile: newName,
    });
  }

  renameFile(oldName, newName) {
    console.log('rename file', oldName, newName);

    this.Storage.move(oldName, newName);

    let files = this.Storage.list();
    this.setState({
      files,
      curFile: newName,
    });
  }

  deleteFile(name) {
    console.log('delete file', name);

    this.Storage.delete(name);

    let files = this.Storage.list();
    this.setState({
      files,
      curFile: this.Storage.first(),
    });
  }

  render() {
    return (
      <section className="section" style={{ padding: 0 }}>
        <section className="hero" style={{ marginBottom: '2em' }}>
          <div className="hero-head">
            <nav className="navbar">
              <div className="navbar-brand">
                <a className="navbar-item" href="/">
                  Monkey
                </a>
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
