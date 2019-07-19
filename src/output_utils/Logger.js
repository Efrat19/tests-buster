import Output from './Output';

export default class Logger {
  constructor() {
    this.output = new Output();
    this.progressLength = 0;
  }

  startSpinner() {
    this.output.newLine();
  }

  updateSpinner(discoveredFiles = 0) {
    this.output.progress(`discovering ${discoveredFiles} test files....`);
  }

  startProgress(length) {
    this.progressLength = length;
    this.output.newLine();
  }

  updateProgress(current) {
    this.output.progress(`working on file ${current} out of ${this.progressLength}`);
  }
}
