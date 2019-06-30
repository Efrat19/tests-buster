import fs from 'fs';
import shell from 'shelljs';

export default class Crawler {
    constructor (projectDir = '.', testsDir = '.', filePattern = /.spec.js$/, ) {
        this.fs = fs;
        this.shell = shell;
        this.projectDir = projectDir;
        this.testsDir = testsDir;
        this.filePattern = filePattern;
    }

    async start(){
        this.shell.cd(this.rootDir);
        const files = await this.getTestFiles();
        const eatenTests = await eatTests(files);
        this.shell.echo(`process completed. ${eatenTests} tests busted`);
        return eatenTests;
    }

    async getTestFiles(){
        return this.shell.find(this.testsDir).filter(file =>
            file.match(this.filePattern));
    }


    async eatTests (testFiles) {
        let eatenTests = 0;
        for await (const file of testFiles) {
            const fileContent = await getContentOf(file);
            let cleanContent = fileContent.toString('utf-8');
            getErrorLines(getJestStderrFor(file)).map(errorLine => {
                cleanContent = getCleanContent(errorLine, cleanContent);
                eatenTests++;
            });
            writeContentBackTo(file,cleanContent);
        }
        return eatenTests;
    }
    
 getJestStderrFor(file) {
        const cmd = `jest ${file}`;
        return this.shell.exec(cmd,{silent:true}).stderr;
    }
    
 writeContentBackTo(file,content){
        const writer = this.sf.createWriteStream(file);
        writer.write(content);
        writer.end();
    }
    
    async getContentOf(file) {
        let fileContent = '';
        const reader = this.sf.createReadStream(file ,{encoding: 'utf8' });
        for await (const chunk of reader) {
            fileContent += chunk;
        }
        return fileContent;
    }
    
 getErrorLines(stderr) {
        const regex = /\n\n  ● .*\n\n/g;
        const errorLines = stderr.match(regex) || [];
        return errorLines.map(line => {
            return line.replace(/\n\n  ● /,'').replace(/\n\n/,'').split(' › ');
        });
    }
    
 getCleanContent(errorLine,fileContent) {
        const test = findTest(errorLine,fileContent) || '';
        return extractTestFrom(fileContent,test) || fileContent;
    }
    
 extractTestFrom(fileContent,test) {
        return test && fileContent.split(test+';').join('\n')
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
    
 findTest(errorLine,fileContent) {
        let block = fileContent;
        errorLine.forEach(level => {
            const childBlock = findFullBlock(level,block)
            //if there is only one child in the block
            // then the parent block should be deleted as well,
            //if not-
            if(! isOnlyChild(childBlock,block)){
                block = childBlock;
            }
        });
        return block;
    }
    
 findFullBlock(description,content) {
    
        const allowedQuotes = '"\'`';
        const regex = new RegExp('((describe)|(it)) *\\( *['+allowedQuotes+']('+ escapeRegExp(description)+')['+allowedQuotes+']','g');
        const blockStart = content && content.match(regex) && content.match(regex)[0] || '';
        const lastPart = content && content.split(blockStart)[1] || ''; //get last part of the content
        return blockStart && lastPart && blockStart + getEndOfBlockFrom(lastPart)
    }
    
    
 getEndOfBlockFrom(contentPart){
        let bracketsCounter = 1, finalBlock = '';
        contentPart.split('') // break it to chars
            .every(char => {
                switch (char) {
                    case '(': bracketsCounter++;break;
                    case ')': bracketsCounter--;break;
                }
                finalBlock += char;
                // when equals 0 it means the block
                // is done and i want to quit the loop
                return !!bracketsCounter
            });
        return finalBlock;
    }
    
 escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
 isOnlyChild(child,parent) {
        return isEmptyBlock(extractTestFrom(parent,child))
    }
    
 isEmptyBlock(block) {
        const allowedQuotes = '"\'`';
        const regex = new RegExp('((describe)|(it)) *\\( *['+allowedQuotes+']','g');
        return (block.match(regex) || []).length === 1;
    }
    
}