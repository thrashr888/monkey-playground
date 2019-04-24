import React, { Component } from 'react';
import './CurFile.css';

import { NewEnvironment, Lexer, Parser, Eval } from 'monkey-typescript';

class CurFile extends Component {
  constructor(props) {
    super(props);
    this.env = NewEnvironment();

    this.state = {
      dirty: false,
      debug: '',
      file: props.file,
      input: props.file.text,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRename = this.handleRename.bind(this);
  }

  setFile(file) {
    this.env = NewEnvironment();
    this.setState({
      file,
      input: file.text,
      dirty: false,
    });
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.file.name !== newProps.file.name) {
      this.setFile(newProps.file);
    }
  }

  handleRename(e) {
    let name = e.target.value;
    let oldName = this.props.file.name;

    this.setState({
      file: {
        ...this.state.file,
        name,
      },
    });
    this.props.renameFile(oldName, name);
  }

  handleSave(e) {
    this.props.updateFile(this.state.file.name, this.state.input);
  }

  handleChange(e) {
    this.env = NewEnvironment();
    this.setState({
      dirty: true,
      input: e.target.value,
    });
  }

  eval(line) {
    let l = new Lexer(line);
    let p = new Parser(l);
    let program = p.ParseProgram();

    if (p.Errors().length !== 0) {
      return [p.Errors(), null];
    } else {
      return [null, Eval(program, this.env)];
    }
  }

  renderOutput(input) {
    return this.state.input
      .split('\n')
      .map(l => {
        return this.renderLine(l);
      })
      .join('\n');
  }

  renderLine(l) {
    let out = this.eval(l);
    if (!out[1]) {
      return '';
    }
    return out[1].Inspect().replace(/\n/g, ' ');
  }

  render() {
    return (
      <div class="CurFile column">
        <div>
          <div class="field is-grouped">
            <p class="control is-expanded">
              <input
                type="text"
                class="input is-family-code"
                value={this.state.file.name}
                onChange={this.handleRename}
              />
            </p>
            <p class="control">
              <button type="button" class="button is-white" onClick={this.handleSave}>
                Save
              </button>
            </p>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <textarea
              class="textarea is-family-code"
              rows="20"
              onChange={this.handleChange}
              value={this.state.input}
              focus="true"
            />
          </div>
          <div class="column">
            <textarea class="textarea is-family-code" rows="20" value={this.renderOutput()} readOnly />
          </div>
        </div>
        <pre>
          <code>{this.state.debug}</code>
        </pre>
      </div>
    );
  }
}

export default CurFile;
