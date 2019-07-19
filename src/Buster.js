import Sweeper from './Sweeper';
import Crawler from './Crawler';
import Scanner from './Scanner';
import Logger from './output_utils/Logger';

export default class Buster {
  constructor({
    path, filePattern, isDry, autoRemove,
  }) {
    this.path = path || '.';
    this.sweeper = new Sweeper();
    this.crawler = new Crawler(isDry || false, autoRemove || false);
    this.scanner = new Scanner(filePattern, this.path);
    this.logger = new Logger(autoRemove || false, isDry || false);
    this.testsBusted = 0; // deleted tests counter
  }

  async start() {
    process.chdir(this.path);
    await this.crawler.createIgnoreFile('.busterignore', 'node_modules\n.git\n');
    this.logger.startSpinner();
    const onDiscovery = discovered => this.logger.updateSpinner(discovered);
    const files = await this.scanner.getTestFiles(onDiscovery);
    this.logger.startProgress(files.length);
    await this.eatTests(files);
    this.exitMessage.print(this.testsBusted, this.crawler.removeList);
  }

  async eatTests(testFiles) {
    let index = 1;
    for await (const file of testFiles) {
      this.logger.updateProgress(index);
      const fileContent = await this.crawler.getContentOf(file);
      const cleanContent = await this.cleanFile(file, fileContent);
      this.crawler.fixFile(file, cleanContent);
      index += 1;
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
