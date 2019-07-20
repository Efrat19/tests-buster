import Output from './Output';
import ExitMessage from './ExitMessage';

export default class Logger {
  constructor(autoRemove, isDry) {
    this.output = new Output();
    this.progressLength = 0;
    this.isDry = isDry;
    this.exitMessage = new ExitMessage(autoRemove, this.isDry);
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
    const action = this.isDry ? 'reading' : 'cleaning';
    this.output.progress(`now ${action} file ${current} out of ${this.progressLength}`);
  }

  successfullyExit(testsBusted, removeList) {
    this.exitMessage.print(testsBusted, removeList);
    process.exit(0);
  }
}
