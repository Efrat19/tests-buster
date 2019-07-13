import shell from 'shelljs';
import walk from 'ignore-walk';

export default class Scanner {
  constructor(projectDir, testsDir, filePattern) {
    this.shell = shell;
    this.projectDir = projectDir || '.';
    this.testsDir = testsDir || '.';
    this.filePattern = filePattern || /.spec.js$/;
    this.walk = new walk.WalkerSync({
      ignoreFiles: ['.busterignore'],
      path: `${this.projectDir}/${this.testsDir}`,
    });
  }

  async getTestFiles(onDiscovery) {
    let discovered = 0;
    return this.walk.start().result.filter( file => {
      // if (file.match(this.filePattern)) {
        console.log(file);
        onDiscovery && onDiscovery(++ discovered);
        return true;
      // }
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
    this.shell.cd(this.projectDir);
    const cmd = `./node_modules/.bin/jest ${this.testsDir}/${file}`;
    return this.shell.exec(cmd, { silent: true }).stderr;
  }

 
}
