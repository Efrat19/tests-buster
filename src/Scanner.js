import shell from 'shelljs';
import walk from 'ignore-walk';

export default class Scanner {
  constructor(filePattern, path) {
    this.shell = shell;
    this.filePattern = filePattern;
    this.jest = './node_modules/.bin/jest';
    this.walk = new walk.WalkerSync({
      ignoreFiles: ['.busterignore'],
      path,
    });
  }

  async getTestFiles() {
    return this.walk.start().result.filter(file => file.match(this.filePattern));
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
}
