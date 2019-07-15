import chalk from 'chalk';

export default class Output {
  constructor() {
    this.chalk = chalk;
  }

  log(text) {
    process.stdout.write(text);
  }

  info(text) {
    process.stdout.write(this.chalk.blue(text));
  }

  success(text) {
    process.stdout.write(this.chalk.green(text));
  }

  warning(text) {
    process.stdout.write(this.chalk.yellow(text));
  }

  error(text, error, code) {
    process.stdout.write(this.chalk.black.bgRed(text));
    process.stdout.write(this.chalk.red(error));
    return code && process.exit(code);
  }
}
