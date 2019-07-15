
export default class Sweeper {
  constructor() {
    this.allowedQuotes = '"\'`';
  }

  getCleanContent(errorLine, fileContent) {
    const test = this.findTest(errorLine, fileContent) || '';
    return this.extractTestFrom(fileContent, test) || fileContent;
  }

  extractTestFrom(fileContent, test) {
    return test && fileContent.split(`${test};`).join('\n')
      .split(test).join('\n');
  }


  // findblockToRemove(errorsArray,block) {
  //     const innerBlock = findFullBlock(errorsArray.shift(),block)
  //     if(errorsArray.length){
  //         const blockToRemove = findblockToRemove(errorsArray,innerBlock)
  //         if(isOnlyChild(innerBlock,block)){
  //             return block;
  //         }
  //     }
  //     return innerBlock;
  // }

  findTest(errorLine, fileContent) {
    let block = fileContent;
    errorLine.forEach((level) => {
      const childBlock = this.findFullBlock(level, block);
      // if there is only one child in the block
      // then the parent block should be deleted as well,
      // if not-
      if (!this.isOnlyChild(childBlock, block)) {
        block = childBlock;
      }
    });
    return block;
  }

  findFullBlock(description, content) {
    const regex = new RegExp(`((describe)|(it)|(test)) *\\( *[${this.allowedQuotes}](${this.escapeRegExp(description)})[${this.allowedQuotes}]`, 'g');
    const blockStart = (content && content.match(regex) && content.match(regex)[0]) || '';
    const lastPart = (content && content.split(blockStart)[1]) || ''; // get last part of the content
    return blockStart && lastPart && blockStart + this.getEndOfBlockFrom(lastPart);
  }


  getEndOfBlockFrom(contentPart) {
    let bracketsCounter = 1; let
      finalBlock = '';
    contentPart.split('') // break it to chars
      .every((char) => {
        switch (char) {
          case '(': bracketsCounter += 1; break;
          case ')': bracketsCounter -= 1; break;
          default: break;
        }
        finalBlock += char;
        // when equals 0 it means the block
        // is done and i want to quit the loop
        return !!bracketsCounter;
      });
    return finalBlock;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  isOnlyChild(child, parent) {
    return this.isEmptyBlock(this.extractTestFrom(parent, child));
  }

  isEmptyBlock(block) {
    const regex = new RegExp(`((describe)|(it)|(test)) *\\( *[${this.allowedQuotes}]`, 'g');
    return (block.match(regex) || []).length === 1;
  }
}
