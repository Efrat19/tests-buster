import { Spinner, Progress } from 'clui';

export default class Logger {
  constructor() {
    this.spinner = new Spinner(this.getSpinnerStatus(), ['W', 'M']);
    this.progress = new Progress();
    this.progressLength = 0;
  }

  startSpinner() {
    this.spinner.start();
  }

  updateSpinner(discoveredFiles) {
    this.spinner.message = this.getSpinnerStatus(discoveredFiles);
  }

  quitSpinner() {
    this.spinner.stop();
  }

  startProgress(length) {
    this.progressLength = length;
    this.updateProgress(0);
  }

  updateProgress(current) {
    console.log(this.progress.update(current, this.progressLength));
  }

  getSpinnerStatus(discoveredFiles = 0) {
    return `discovering ${discoveredFiles} test files....`;
  }
}
