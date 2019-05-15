import Filer from 'filer';
// import S3Provider from 'filer-s3';

const { FileSystem } = Filer;

// console.log(S3Provider);
// let provider = new S3Provider({
//   keyPrefix: '__FILES__',
//   bucket: 'monkey.thrasher.dev',
//   key: '',
//   secret: '',
// });

export default class FilerFiles {
  fs = new FileSystem({
    // provider,
  }).promises;

  keys() {
    console.debug('Filer.keys', this.fs);
    return this.fs.readdir('/');
  }

  get(name) {
    console.debug('Filer.get', name);
    return this.fs.readFile(`/${name}`, 'utf8');
  }

  set(name, content) {
    console.debug('Filer.set', name);
    return this.fs.writeFile(`/${name}`, content);
  }

  delete(name) {
    console.debug('Filer.delete', name);
    return this.fs.unlink(`/${name}`);
  }

  move(oldName, newName) {
    console.debug('Filer.move', oldName, newName);
    return this.fs.rename(`/${oldName}`, `/${newName}`);
  }

  copy(fromName, toName) {
    console.debug('Filer.copy', fromName, toName);
    // no native function. meant to stream instead.
    return this.set(toName, this.get(fromName));
  }
}
