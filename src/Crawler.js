import fs from 'fs';

export default class Crawler {
  constructor(isDry, autoRemove) {
    this.isDry = isDry || false;
    this.autoRemove = autoRemove || false;
    this.fs = fs;
    this.removeList = [];
  }

  fixFile(file, content) {
    if (this.isEmpty(content)) {
      return this.fixEmptyFile(file, content);
    }
    return !this.isDry && this.writeContentBackTo(file, content);
  }

  fixEmptyFile(file) {
    this.removeList.push(file);
    return !this.isDry && this.autoRemove && this.fs.delete(file);
  }

  writeContentBackTo(file, content) {
    if (!this.isDry) {
      const writer = this.sf.createWriteStream(file);
      writer.write(content);
      writer.end();
    }
  }

  async getContentOf(file) {
    let fileContent = '';
    const reader = this.fs.createReadStream(file, { encoding: 'utf8' });
    for await (const chunk of reader) {
      fileContent += chunk;
    }
    return fileContent;
  }

  isEmpty(content) {
    const regex = new RegExp(`((describe)|(it)) *\\( *[${this.allowedQuotes}]`, 'g');
    return !(content.match(regex) || []).length;
  }
}
