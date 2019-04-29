export default class Storage {
  files = new Map();

  constructor() {
    // this.files = new Map();

    this.files.set(
      'test.monkey',
      `let double = fn(n){ n * 2 }
let a = double(102)
a * 21 - 84
let hello = fn(name){ "Hello, " + name + "!" }
hello("Paul")
let bigNum = fn(x){x>500}`
    );
  }

  dump() {
    console.log(this.list());
  }

  first() {
    return this.files.keys().next().value;
  }

  list() {
    return Array.from(this.files.keys());
  }

  size() {
    return this.files.size;
  }

  read(name) {
    return this.files.get(name);
  }

  write(name, content) {
    this.files.set(name, content);
  }

  delete(name) {
    this.files.delete(name);
  }

  move(oldName, newName) {
    let content = this.read(oldName);
    this.write(newName, content);
    this.delete(oldName);
  }

  copy(fromName, toName) {
    let content = this.read(fromName);
    this.write(toName, content);
  }
}
