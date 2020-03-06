import chalk from 'chalk';
var readline = require('readline');

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
    process.stdout.write('\n');
    process.stdout.write(this.chalk.red(error));
    process.stdout.write('\n');
    return code && process.exit(code);
  }

  debug(description, text) {
    process.stdout.write(this.chalk.bgBlackBright(description));
    process.stdout.write(this.chalk.bgGreenBright.black(text));
    process.stdout.write('\n');
  }

  promotion(text) {
    process.stdout.write(this.chalk.hex('#99425B').bold(text));
  }

  progress(text) {
    readline.cursorTo(process.stdout(this.info(text)), 0);
  }

  newLine() {
    process.stdout.write('\n');
  }
}
