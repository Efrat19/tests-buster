import shell from 'shelljs';
import walk from 'ignore-walk';
import Output from './output_utils/Output';

const { resolve } = require('path');


export default class Scanner {
  constructor(filePattern, path) {
    this.shell = shell;
    this.filePattern = this.validatedPattern(filePattern);
    this.jest = './node_modules/.bin/jest';
    this.walk = new walk.WalkerSync({
      ignoreFiles: ['.busterignore'],
      path: resolve(path),
    });
    this.output = new Output();
  }

  async getTestFiles(onDiscovery = () => {}) {
    let counter = 0;
    return this.walk.start().result.filter((file) => {
      if (file.match(this.filePattern)) {
        counter += 1;
        onDiscovery(counter);
        return true;
      }
      return false;
    });
  }

  getErrorsFor(file) {
    return this.getErrorLines(this.getJestStderrFor(file));
  }

  getErrorLines(stderr) {
    const regex = /\n\n {2}● .*\n\n/g;
    const errorLines = stderr.match(regex) || [];
    return errorLines.map(line => line.replace(/\n\n {2}● /, '').replace(/\n\n/, '').split(' › '));
  }

  getJestStderrFor(file) {
    const cmd = `${this.jest} ${file}`;
    return this.shell.exec(cmd, { silent: true }).stderr;
  }

  validatedPattern(filePattern) {
    if (filePattern) {
      try {
        return new RegExp(filePattern);
      } catch (error) {
        this.output.error('invalid file pattern:\n', error, 2);
      }
    }
    return /.spec.js$/;
  }
}
