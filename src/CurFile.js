import React, { Component } from 'react';
import './CurFile.css';

import { NewEnvironment, Lexer, Parser, Eval } from 'monkey-typescript';

const SAVE_INTERVAL = 2000;

class CurFile extends Component {
  constructor(props) {
    super(props);
    this.env = NewEnvironment();
    this.env.Logger.Follow(this.followLogs.bind(this));
    this.env.Logger.Log('fdas');

    this.state = {
      dirty: false,
      name: props.name,
      text: props.text,
      output: this.evalInput(props.text),
      console: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    setTimeout(this.periodicSave.bind(this), SAVE_INTERVAL);
  }

  periodicSave() {
    this.handleSave();
    setTimeout(this.periodicSave.bind(this), SAVE_INTERVAL);
  }

  followLogs(date, messages) {
    console.log(date, ...messages);
    this.setState({
      console: messages.join('\n'),
    });
  }

  setFile(name, text) {
    this.env = NewEnvironment();
    this.env.Logger.Follow(this.followLogs.bind(this));
    this.setState({
      name,
      text,
      dirty: false,
      output: this.evalInput(text),
      console: '',
    });
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.name !== newProps.name) {
      this.setFile(newProps.name, newProps.text);
    }
  }

  handleRename(e) {
    let name = e.target.value;
    let oldName = this.props.name;

    this.setState({
      name,
    });
    this.props.renameFile(oldName, name);
  }

  handleSave() {
    if (this.state.dirty) {
      this.props.updateFile(this.state.name, this.state.text);
      this.setState({
        dirty: false,
      });
    }
  }

  handleDelete() {
    this.props.deleteFile(this.state.name);
    this.setState({
      name: '',
      text: '',
      dirty: false,
      output: [],
      console: '',
    });
  }

  handleChange(e) {
    this.env = NewEnvironment();
    this.env.Logger.Follow(this.followLogs.bind(this));
    this.setState({
      dirty: true,
      text: e.target.value,
      output: this.evalInput(e.target.value),
    });
  }

  evalInput(input) {
    let l = new Lexer(input);
    let p = new Parser(l);
    let program = p.ParseProgram();

    // parser errors
    if (p.Errors().length !== 0) {
      // return '';
      this.setState({
        errors: p.Errors(),
      });
      // return p.Errors().join(', ');
    }

    return program.Statements.map(s => {
      let out = Eval(s, this.env);
      return out ? out.Inspect() : '-';
    }).join('\n');
  }

  render() {
    return (
      <div className="CurFile column">
        <div>
          <div className="field is-grouped">
            <p className="control is-expanded">
              <input
                type="text"
                className="input is-family-code"
                value={this.state.name}
                onChange={this.handleRename}
              />
            </p>
            <p className="control">
              <button
                type="button"
                className="button is-white"
                onClick={this.handleSave}
                disabled={!this.state.dirty}
              >
                {this.state.dirty ? '•' : null} Save
              </button>
              <button type="button" className="button is-danger" onClick={this.handleDelete}>
                Delete
              </button>
            </p>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <textarea
              className="textarea is-family-code"
              rows="20"
              onChange={this.handleChange}
              value={this.state.text}
              focus="true"
            />
          </div>
          <div className="column">
            <textarea className="textarea is-family-code" rows="20" value={this.state.output} readOnly />
          </div>
        </div>
        <textarea className="textarea is-family-code" value={this.state.console} readOnly />
      </div>
    );
  }
}

export default CurFile;
