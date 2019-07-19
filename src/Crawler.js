import fs from 'fs';
import Output from './output_utils/Output';

const { promisify } = require('util');

export default class Crawler {
  constructor(isDry, autoRemove) {
    this.isDry = isDry;
    this.autoRemove = autoRemove;
    this.fs = fs;
    this.fsp = fs.promises;
    this.removeList = [];
    this.output = new Output();
    this.writeFile = promisify(this.fs.writeFile);
  }

  async fixFile(file, content) {
    if (this.isEmpty(content)) {
      return this.fixEmptyFile(file, content);
    }
    return this.writeContentBackTo(file, content);
  }

  async fixEmptyFile(file, content) {
    this.removeList.push(file);
    if (!this.autoRemove) {
      return this.writeContentBackTo(file, content);
    }
    if (!this.isDry && this.autoRemove) {
      try {
        return this.fs.unlinkSync(file);
      } catch (error) {
        return this.output.error(`unable to delete empty file ${file}`, error, 1);
      }
    }
    return false;
  }

  async writeContentBackTo(file, content) {
    if (!this.isDry) {
      try {
        await this.writeFile(file, content);
      } catch (error) {
        this.output.error(`unable to write to file ${file}`, error, 1);
      }
    }
  }

  async getContentOf(file) {
    let fileContent = '';
    try {
      const reader = this.fs.createReadStream(file, { encoding: 'utf8' });
      for await (const chunk of reader) {
        fileContent += chunk;
      }
      return fileContent;
    } catch (error) {
      return this.output.error(`unable to read file ${file}`, error, 1);
    }
  }

  isEmpty(content) {
    const allowedQuotes = '"\'`';
    const regex = new RegExp(`((describe)|(it)|(test)) *\\( *[${allowedQuotes}]`, 'g');
    return !(content.match(regex) || []).length;
  }

  async createIgnoreFile(file, content) {
    try {
      if (!this.fs.existsSync(file)) {
        return await this.fsp.appendFile(file, content);
      }
      return true;
    } catch (error) {
      return this.output.error('unable to create .busterignore file:\n', error, 2);
    }
  }
}
