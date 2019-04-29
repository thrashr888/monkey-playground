import React, { Component } from 'react';
import './CurFile.css';

import { NewEnvironment, Lexer, Parser, Eval, OObject } from 'monkey-typescript';
const { ERROR_OBJ } = OObject;

const SAVE_INTERVAL = 2000;

class CurFile extends Component {
  constructor(props) {
    super(props);
    this.env = NewEnvironment();

    this.state = {
      dirty: false,
      name: props.name,
      text: props.text,
      output: this.evalInput(props.text),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRename = this.handleRename.bind(this);

    setTimeout(this.periodicSave.bind(this), SAVE_INTERVAL);
  }

  periodicSave() {
    this.handleSave();
    setTimeout(this.periodicSave.bind(this), SAVE_INTERVAL);
  }

  setFile(name, text) {
    this.env = NewEnvironment();
    this.setState({
      name,
      text,
      dirty: false,
      output: this.evalInput(text),
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

  handleChange(e) {
    this.env = NewEnvironment();
    this.setState({
      dirty: true,
      text: e.target.value,
      output: this.evalInput(e.target.value),
    });
  }

  evalInput(input) {
    return input.split('\n').map(l => {
      return this.evalLine(l);
    });
  }

  evalLine(line) {
    let l = new Lexer(line);
    let p = new Parser(l);
    let program = p.ParseProgram();

    // parser errors
    if (p.Errors().length !== 0) {
      return '';
      // return p.Errors().join(', ');
    }

    let out = Eval(program, this.env);
    if (!out) {
      return '';
    }

    // evaluation errors
    if (out.Type() === ERROR_OBJ) {
      return '';
      // return out.Inspect().replace(/\n/g, ' ');
    }

    return out.Inspect().replace(/\n/g, ' ');
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
            <textarea
              className="textarea is-family-code"
              rows="20"
              value={this.state.output.join('\n')}
              readOnly
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CurFile;
