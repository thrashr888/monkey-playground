import React, { Component } from 'react';
import './CurFile.scss';

import { NewEnvironment, Lexer, Parser, Eval, OObject } from 'monkey-typescript';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

const SAVE_INTERVAL = 2000;

// TODO capture logs from inner envs

class CurFile extends Component {
  constructor(props) {
    super(props);

    // defaults
    this.state = {
      name: props.name,
      text: props.text,
      dirty: false,
      debug: 'console',
      console: [],
      errors: [],
      output: [],
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

    this.consoleLog = [...this.consoleLog, [date, ...messages].join(' ')];
    this.setState({
      console: this.consoleLog,
    });
  }

  componentDidMount() {
    this.consoleLog = [];
    this.env = NewEnvironment();
    this.env.Logger.Follow(this.followLogs.bind(this));

    let [errors, output] = this.evalInput(this.props.text);

    this.setState({
      errors,
      output,
    });
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.name !== newProps.name) {
      let name = newProps.name;
      let text = newProps.text;

      this.consoleLog = [];
      this.env = NewEnvironment();
      this.env.Logger.Follow(this.followLogs.bind(this));

      this.setState({
        name: name,
        text: text,
        dirty: false,
        debug: 'console',
        console: [],
      });

      let [errors, output] = this.evalInput(text);

      this.setState({
        errors,
        output,
      });
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
      console: [],
      errors: [],
    });
  }

  handleChange(e) {
    let value = e.target ? e.target.value : e;

    this.setState({
      console: [],
      dirty: true,
      text: value,
    });

    this.consoleLog = [];
    this.env = NewEnvironment();
    this.env.Logger.Follow(this.followLogs.bind(this));

    let [errors, output] = this.evalInput(value);

    this.setState({
      errors,
      output,
    });
  }

  evalInput(input) {
    let l = new Lexer(input);
    let p = new Parser(l);
    let program = p.ParseProgram();

    let errors = [];
    let output = [];

    // parser errors
    if (p.Errors().length !== 0) {
      errors = p.Errors();
    }

    program.Statements.forEach(s => {
      let out = Eval(s, this.env);
      let line = s.Token.Position.Line - 1;
      // let lineCount = out.split(/\r\n|\r|\n/).length;
      let ret = '';

      if (out && out.Type() === OObject.FUNCTION_OBJ) {
        ret = 'fn()';
      } else if (out) {
        ret = out.Inspect().replace(/\r\n|\r|\n/g, '');
      }

      output[line] = ret;
    });

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
        <div className="columns is-gapless container__pair">
          <div className="column is-three-fifths">
            <Editor
              value={this.state.text}
              onValueChange={this.handleChange}
              highlight={text => highlight(text, languages.js, 'javascript')}
              padding={10}
              className="container__editor"
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: 15,
              }}
            />
          </div>
          <div className="column">
            <Editor
              value={this.state.output.join('\n')}
              onValueChange={() => null}
              highlight={output => highlight(output, languages.js, 'javascript')}
              padding={10}
              className="container__output"
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: 15,
              }}
            />
          </div>
        </div>

        <div className="tabs is-boxed">
          <ul>
            <li className={this.state.debug === 'console' ? 'is-active' : null}>
              <a href={'#' + this.state.name} onClick={e => this.setState({ debug: 'console' })}>
                Console ({this.state.console.length})
              </a>
            </li>
            <li className={this.state.debug === 'errors' ? 'is-active' : null}>
              <a href={'#' + this.state.name} onClick={e => this.setState({ debug: 'errors' })}>
                Errors ({this.state.errors.length})
              </a>
            </li>
          </ul>
        </div>
        <div>
          <textarea
            className="output-debug textarea is-family-code"
            value={this.state[this.state.debug].join('\n')}
            readOnly
          />
        </div>
      </div>
    );
  }
}

export default CurFile;
