import React, { Component } from 'react';
import './App.css';

import { NewEnvironment, Lexer, Parser, Eval } from 'monkey-typescript';

class App extends Component {
  constructor() {
    super();
    this.env = NewEnvironment();

    this.onChange = this.onChange.bind(this);

    this.state = {
      debug: '',
      lines: `let double = fn(n){ n * 2 }
let a = double(102)
a * 21 - 84
let hello = fn(name){ "Hello, " + name + "!" }
hello("Paul")
let bigNum = fn(x){x>500}
`.split('\n'),
    };
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

  onChange(e) {
    let input = e.target.value;
    let lines = input.split('\n');

    this.setState({
      debug: input,
      lines,
    });
  }

  renderOutput(l) {
    let out = this.eval(l);
    if (!out[1]) {
      return '';
    }
    return out[1].Inspect().replace(/\n/g, ' ');
  }

  render() {
    let out = this.state.lines
      .map(l => {
        return this.renderOutput(l);
      })
      .join('\n');
    return (
      <div className="App">
        <textarea
          cols="45"
          rows="35"
          onKeyUp={this.onChange}
          defaultValue={this.state.lines.join('\n')}
          focus="true"
        />
        <textarea cols="25" rows="35" value={out} readOnly />
        <br />
        <pre>
          <code>{this.state.debug}</code>
        </pre>
      </div>
    );
  }
}

export default App;
