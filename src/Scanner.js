import shell from 'shelljs';
import walk from 'ignore-walk';

export default class Scanner {
  constructor(path, filePattern) {
    this.shell = shell;
    this.path = path;
    this.filePattern = filePattern;
    this.walk = new walk.WalkerSync({
      ignoreFiles: ['.busterignore'],
      path: this.path,
    });
  }

  async getTestFiles() {
    // let discovered = 0;
    return this.walk.start().result.filter(file => file.match(this.filePattern));
    // if (file.match(this.filePattern)) {
    // //  
    //   return true;
    // // return onDiscovery && onDiscovery(++discovered) && true;
    // }
    // return false;
    // });
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
    const cmd = `./node_modules/.bin/jest ${this.path}/${file}`;
    return this.shell.exec(cmd, { silent: true }).stderr;
  }
}
