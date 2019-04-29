export class File {
  static INDEX = 'FILE::';

  static get(name) {
    let key = `${File.INDEX}${name}`;

    if (localStorage.getItem(key)) {
      let value = localStorage.getItem(key);
      return JSON.parse(value);
    }
    return '';
  }

  static set(name, content) {
    let key = `${File.INDEX}${name}`;
    let value = JSON.stringify(content);

    if (localStorage.getItem(key)) {
      return localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
      return false;
    }
  }

  static delete(name) {
    let key = `${File.INDEX}${name}`;

    if (localStorage.getItem(key)) {
      return localStorage.removeItem(key);
    }
    return false;
  }
}

export default class Files {
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
    return File.get(name);
  }

  set(name, content) {
    if (!File.set(name, content)) {
      let files = this.keys();
      files.push(name);
      localStorage.setItem(this.INDEX, JSON.stringify(files));
    }
  }

  delete(name) {
    File.delete(name);
    let files = this.keys();
    files = files.filter(i => i !== name);
    localStorage.setItem(this.INDEX, JSON.stringify(files));
  }
}
