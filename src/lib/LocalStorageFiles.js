export class LocalStorageFile {
  static INDEX = 'FILE::';

  static get(name) {
    let key = `${LocalStorageFile.INDEX}${name}`;

    if (localStorage.getItem(key)) {
      let value = localStorage.getItem(key);
      return JSON.parse(value);
    }
    return null;
  }

  static set(name, content) {
    let key = `${LocalStorageFile.INDEX}${name}`;
    let value = JSON.stringify(content);

    if (localStorage.getItem(key)) {
      localStorage.setItem(key, value);
      return true;
    }

    localStorage.setItem(key, value);
    return false;
  }

  static delete(name) {
    let key = `${LocalStorageFile.INDEX}${name}`;

    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      return true;
    }

    return false;
  }
}

export default class LocalStorageFiles {
  INDEX = '__INDEX__';
  size = 0;

  keys() {
    let out = localStorage.getItem(this.INDEX);
    let files = [];

    try {
      files = JSON.parse(out) || [];
    } catch {}

    this.size = files.length;

    return files;
  }

  get(name) {
    return LocalStorageFile.get(name);
  }

  set(name, content) {
    if (!LocalStorageFile.set(name, content)) {
      let files = this.keys();
      files.push(name);
      localStorage.setItem(this.INDEX, JSON.stringify(files));
    }
  }

  delete(name) {
    LocalStorageFile.delete(name);
    let files = this.keys();
    files = files.filter(i => i !== name);
    localStorage.setItem(this.INDEX, JSON.stringify(files));
  }

  move(oldName, newName) {
    let content = this.get(oldName);
    this.set(newName, content);
    this.delete(oldName);
    return true;
  }

  copy(fromName, toName) {
    let content = this.get(fromName);
    this.set(toName, content);
    return true;
  }
}
