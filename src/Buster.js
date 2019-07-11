import Sweeper from './Sweeper';
import Crawler from './Crawler';
import Scanner from './Scanner';
import Logger from './Logger';
import ExitMessage from './ExitMessage';

export default class Buster {
  constructor({
    projectDir, testsDir, filePattern, isDry, autoRemove,
  }) {
    this.sweeper = new Sweeper();
    this.crawler = new Crawler(isDry);
    this.scanner = new Scanner(projectDir, testsDir, filePattern);
    this.logger = new Logger();
    this.xxitMessage = new ExitMessage(autoRemove, isDry);
    this.testsBusted = 0; // deleted tests counter
  }

  async start() {
    this.logger.startSpinner();
    const files = await this.scanner.getTestFiles(this.logger.updateSpinner);
    await this.eatTests(files);
    this.ExitMessage.print(this.testsBusted, this.crawler.removeList);
  }

  async eatTests(testFiles) {
    for await (const file of testFiles) {
      const fileContent = await this.crawler.getContentOf(file);
      const cleanContent = await this.cleanFile(fileContent);
      this.crawler.fixFile(file, cleanContent);
    }
  }

  async cleanFile(file) {
    let cleanContent = fileContent.toString('utf-8');
    this.scanner.getErrorsFor(file).map((errorLine) => {
      cleanContent = this.sweeper.getCleanContent(errorLine, cleanContent);
      this.testsBusted++;
    });
    return cleanContent;
  }
}
