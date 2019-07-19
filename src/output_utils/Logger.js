import Output from './Output';
import ExitMessage from './ExitMessage';

export default class Logger {
  constructor(autoRemove, isDry) {
    this.output = new Output();
    this.progressLength = 0;
    this.exitMessage = new ExitMessage(autoRemove, isDry);
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

  successfullyExit(testsBusted, removeList) {
    this.exitMessage.print(testsBusted, removeList);
    process.exit(0);
  }
}
