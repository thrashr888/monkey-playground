import React, { Component } from 'react';
import './CurFile.scss';

import { NewEnvironment, Lexer, Parser, Eval } from 'monkey-typescript';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

const SAVE_INTERVAL = 2000;

class CurFile extends Component {
  constructor(props) {
    super(props);
    this.env = NewEnvironment();
    this.env.Logger.Follow(this.followLogs.bind(this));
    this.env.Logger.Log('fdas');

    let [errors, output] = this.evalInput(props.text);

    this.state = {
      dirty: false,
      name: props.name,
      text: props.text,
      errors,
      output,
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

  followLogs(date, messages = []) {
    console.log(date, ...messages);
    if (this.state) messages = [this.state.console, ...messages];
    this.setState({
      console: messages.join('\n'),
    });
  }

  setFile(name, text) {
    this.env = NewEnvironment();
    this.env.Logger.Follow(this.followLogs.bind(this));

    let [errors, output] = this.evalInput(text);

    this.setState({
      name,
      text,
      dirty: false,
      errors,
      output,
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
    let value = e.target ? e.target.value : e;

    this.env = NewEnvironment();
    this.env.Logger.Follow(this.followLogs.bind(this));

    let [errors, output] = this.evalInput(value);

    this.setState({
      dirty: true,
      text: value,
      errors,
      output,
      console: '',
    });
  }

  evalInput(input) {
    let l = new Lexer(input);
    let p = new Parser(l);
    let program = p.ParseProgram();

    let errors;
    let output;

    // parser errors
    if (p.Errors().length !== 0) {
      errors = p.Errors().join('\n');
    }

    output = program.Statements.map(s => {
      let out = Eval(s, this.env);
      return out ? out.Inspect() : '-';
    }).join('\n');

    return [errors, output];
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
                className="button is-success is-outlined"
                onClick={this.handleSave}
                disabled={!this.state.dirty}
              >
                {this.state.dirty ? '•' : null} Save
              </button>
              <button
                type="button"
                className="button is-danger is-outlined"
                style={{ marginLeft: '0.75em' }}
                onClick={this.handleDelete}
              >
                Delete
              </button>
            </p>
          </div>
        </div>
        <div className="columns is-gapless" style={{ padding: '1.25em 0 0' }}>
          <div className="column is-three-fifths">
            <Editor
              value={this.state.text}
              onValueChange={this.handleChange}
              highlight={text => highlight(text, languages.js, 'javascript')}
              padding={10}
              className="container__editor"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
              }}
            />
          </div>
          <div className="column">
            <Editor
              value={this.state.output}
              highlight={output => highlight(output, languages.js, 'javascript')}
              padding={10}
              className="container__editor"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
              }}
            />
          </div>
        </div>
        <p>
          Errors
          <textarea className="textarea is-family-code" value={this.state.errors} readOnly />
        </p>
        <p>
          Console
          <textarea className="textarea is-family-code" value={this.state.console} readOnly />
        </p>
      </div>
    );
  }
}

export default CurFile;
