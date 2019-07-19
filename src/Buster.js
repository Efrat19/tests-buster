import Sweeper from './Sweeper';
import Crawler from './Crawler';
import Scanner from './Scanner';
import Logger from './output_utils/Logger';
import Output from './output_utils/Output';

export default class Buster {
  constructor({
    path, filePattern, isDry, autoRemove,
  }) {
    this.path = path || '.';
    this.sweeper = new Sweeper();
    this.crawler = new Crawler(isDry || false, autoRemove || false);
    this.scanner = new Scanner(filePattern, this.path);
    this.logger = new Logger(autoRemove || false, isDry || false);
    this.output = new Output();
    this.testsBusted = 0; // deleted tests counter
  }

  async start() {
    try {
      await this.getReady();
      const files = await this.discoverFiles();
      await this.eatTests(files);
      this.logger.successfullyExit(this.testsBusted, this.crawler.removeList);
    } catch (error) {
      this.output.error('tests-buster is having a problem:', error, 1);
    }
  }

  async eatTests(testFiles) {
    let index = 1;
    this.logger.startProgress(testFiles.length);
    for await (const file of testFiles) {
      this.logger.updateProgress(index);
      const fileContent = await this.crawler.getContentOf(file);
      const cleanContent = await this.cleanFile(file, fileContent);
      await this.crawler.fixFile(file, cleanContent);
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

  async getReady() {
    process.chdir(this.path);
    await this.crawler.createIgnoreFile('.busterignore', 'node_modules\n.git\n');
  }

  async discoverFiles() {
    this.logger.startSpinner();
    const onDiscovery = discovered => this.logger.updateSpinner(discovered);
    return this.scanner.getTestFiles(onDiscovery);
  }
}
