import shell from 'shelljs';

export default class Scanner {
  constructor(projectDir = '.', testsDir = '.', filePattern = /.spec.js$/) {
    this.shell = shell;
    this.projectDir = projectDir;
    this.testsDir = testsDir;
    this.filePattern = filePattern;
  }

  async getTestFiles(onDiscovery) {
    let discovered = 0;
    return this.shell.find(this.testsDir).filter((file) => {
      if (file.match(this.filePattern)) {
        onDiscovery && onDiscovery(++discovered);
        return true;
      }
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
    const cmd = `./node_modules/.bin/jest ${file}`;
    return this.shell.exec(cmd, { silent: true }).stderr;
  }
}
