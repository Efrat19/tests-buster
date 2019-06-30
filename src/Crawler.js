import fs from 'fs';

export default class Crawler {
  constructor() {
    this.fs = fs;
  }

  writeContentBackTo(file, content) {
    const writer = this.sf.createWriteStream(file);
    writer.write(content);
    writer.end();
  }

  async getContentOf(file) {
    let fileContent = '';
    const reader = this.sf.createReadStream(file, { encoding: 'utf8' });
    for await (const chunk of reader) {
      fileContent += chunk;
    }
    return fileContent;
  }
}
