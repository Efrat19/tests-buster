import Sweeper from './Sweeper';
import Crawler from './Crawler';
import Scanner from './Scanner';

export default class Buster {
  constructor(projectDir = '.', testsDir = '.', filePattern = /.spec.js$/) {
    this.sweeper = new Sweeper();
    this.crawler = new Crawler();
    this.scanner = new Scanner(projectDir, testsDir, filePattern);
    this.testsBusted = 0; // deleted tests counter
  }

  async start() {
    const files = await this.scanner.getTestFiles();
    await this.eatTests(files);
    this.shell.echo(`process completed. ${this.testsBusted} tests busted`);
  }

  async eatTests(testFiles) {
    for await (const file of testFiles) {
      const fileContent = await this.crawler.getContentOf(file);
      const cleanContent = await this.cleanFile(fileContent);
      this.crawler.writeContentBackTo(file, cleanContent);
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
