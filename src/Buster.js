
import Sweeper from './Sweeper';
import Crawler from './Crawler';
import Scanner from './Scanner';
import Logger from './Logger';
import ExitMessage from './ExitMessage';

export default class Buster {
  constructor({
    path, filePattern, isDry, autoRemove,
  }) {
    this.path = path || '.';
    this.sweeper = new Sweeper();
    this.crawler = new Crawler(isDry);
    this.scanner = new Scanner(this.path, filePattern);
    this.logger = new Logger();
    this.exitMessage = new ExitMessage(autoRemove, isDry);
    this.testsBusted = 0; // deleted tests counter
  }

  async start() {
    await this.crawler.createIgnoreFile(`${this.projectDir}/${'.busterignore'}`, 'node_modules\n.git');
    this.logger.startSpinner();
    const files = await this.scanner.getTestFiles(discovered => this.logger.updateSpinner(discovered));
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
      this.crawler.fixFile(file, cleanContent);
    }
  }

  async cleanFile(file, fileContent) {
    let cleanContent = fileContent.toString('utf-8');
    this.scanner.getErrorsFor(file).map((errorLine) => {
      cleanContent = this.sweeper.getCleanContent(errorLine, cleanContent);
      this.testsBusted += 1;
    });
    return cleanContent;
  }
}
