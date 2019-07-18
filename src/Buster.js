import Sweeper from './Sweeper';
import Crawler from './Crawler';
import Scanner from './Scanner';
import Logger from './output_utils/Logger';
import ExitMessage from './output_utils/ExitMessage';
import Output from './output_utils/Output';

const {resolve} = require('path');

export default class Buster {
  constructor({
    path, filePattern, isDry, autoRemove,
  }) {
    this.path = path || '.';
    this.sweeper = new Sweeper();
    this.crawler = new Crawler(isDry || false, autoRemove || false);
    this.scanner = new Scanner(this.getFilePattern(filePattern), resolve(this.path));
    this.logger = new Logger();
    this.output = new Output();
    this.exitMessage = new ExitMessage(autoRemove || false, isDry || false);
    this.testsBusted = 0; // deleted tests counter
  }

  async start() {
    process.chdir(this.path);
    await this.crawler.createIgnoreFile('.busterignore', 'node_modules\n.git\n');
    this.logger.startSpinner();
    const files = await this.scanner.getTestFiles();
    this.logger.updateSpinner(files.length);
    // this.logger.quitSpinner();
    await this.eatTests(files);
    this.exitMessage.print(this.testsBusted, this.crawler.removeList);
    // },1000);
  }

  async eatTests(testFiles) {
    for await (const file of testFiles) {
      const fileContent = await this.crawler.getContentOf(file);
      const cleanContent = await this.cleanFile(file, fileContent);
      return this.crawler.fixFile(file, cleanContent);
    }
    return true;
  }

  async cleanFile(file, fileContent) {
    let cleanContent = fileContent.toString('utf-8');
    this.scanner.getErrorsFor(file).map((errorLine) => {
      cleanContent = this.sweeper.getCleanContent(errorLine, cleanContent);
      this.testsBusted += 1;
    });
    return cleanContent;
  }

  getFilePattern(filePattern) {
    if (filePattern) {
      try {
        return new RegExp(filePattern);
      } catch (error) {
        this.output.error('invalid file pattern:\n', error, 2);
      }
    }
    return /.spec.js$/;
  }
}
