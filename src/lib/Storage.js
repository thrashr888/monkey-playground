// import LocalStorageFiles from './LocalStorageFiles';
import FilerFiles from './FilerFiles';

export default class Storage {
  files = new FilerFiles();

  async first() {
    let list = await this.list();
    return list[0];
  }

  list() {
    return this.files.keys();
  }

  read(name) {
    return this.files.get(name);
  }

  write(name, content) {
    return this.files.set(name, content);
  }

  delete(name) {
    return this.files.delete(name);
  }

  move(oldName, newName) {
    return this.files.move(oldName, newName);
  }

  copy(fromName, toName) {
    return this.files.copy(fromName, toName);
  }
}
