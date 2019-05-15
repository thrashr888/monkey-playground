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

    this.state = {
      curFile: null,
      files: [],
      error: null,
    };

    this.switchFile = this.switchFile.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.addFile = this.addFile.bind(this);
    this.renameFile = this.renameFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  async componentDidMount() {
    let files = await this.Storage.list();
    if (!files || files.length === 0) {
      await this.Storage.write('new.monkey', 'let example = 1;');
      files = await this.Storage.list();
    }

    let curFile = (await this.getFileFromUrl()) || (await this.Storage.first());
    window.location.hash = curFile;
    this.setState({
      curFile,
      files,
    });
  }

  async getFileFromUrl() {
    if (!window.location.hash) return false;

    let file = window.location.hash.substr(1);

    try {
      let exists = await this.Storage.read(file);
      if (!exists) {
        return false;
      }
      return file;
    } catch (err) {
      return false;
    }
  }

  switchFile(curFile) {
    console.info('switch file', curFile);
    window.location.hash = curFile;

    this.setState({ curFile });
  }

  async updateFile(name, text) {
    console.info('save file', name);

    await this.Storage.write(name, text);
  }

  async addFile(name = 'new.monkey', text = null) {
    // get an available new file name
    let newName = name;
    let newText = text ? text : 'let example = 1;';

    let newNum = 0;
    while (true) {
      // rename with randNum if file name already exists
      try {
        await this.Storage.read(newName);
      } catch {
        break;
      }
      let fileName = name.substr(0, name.indexOf('.'));
      newNum++;
      if (!text) newText = `let example = ${newNum};`; // only if not given
      newName = `${fileName}-${newNum}.${EXT}`;
    }

    console.info('add file', newName);

    await this.Storage.write(newName, newText);
    window.location.hash = newName;

    let files = await this.Storage.list();
    this.setState({
      files,
      curFile: newName,
    });
  }

  async renameFile(oldName, newName) {
    console.info('rename file', oldName, newName);

    try {
      await this.Storage.move(oldName, newName);
      this.setState({ error: null, curFile: newName, files: await this.Storage.list() });
      window.location.hash = newName;
    } catch (err) {
      let error = `cannot rename file to ${newName}`;
      console.error('App.renameFile error:', error, err);
      this.setState({ error });
    }
  }

  async deleteFile(name) {
    console.info('delete file', name);

    await this.Storage.delete(name);

    let curFile = await this.Storage.first();
    window.location.hash = curFile;

    let files = await this.Storage.list();
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

        {this.state.error ? <div>Error: {this.state.error}</div> : null}

        <div className="columns">
          {this.state.files && this.state.curFile ? (
            <Files
              files={this.state.files}
              curFile={this.state.curFile}
              chooseFile={this.switchFile}
              addFile={this.addFile}
            />
          ) : (
            <div>Loading...</div>
          )}
          {this.state.curFile ? (
            <CurFile
              name={this.state.curFile}
              text={this.Storage.read(this.state.curFile)}
              updateFile={this.updateFile}
              renameFile={this.renameFile}
              deleteFile={this.deleteFile}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </section>
    );
  }
}

export default App;
