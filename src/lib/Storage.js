import Files from './Files';

export default class Storage {
  files = new Files();

  first() {
    return this.files.keys()[0];
  }

  list() {
    return this.files.keys();
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
